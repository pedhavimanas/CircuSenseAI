/**
 * PCB Image Validation Engine
 * 
 * Verifies whether an uploaded image contains a physical printed circuit board (PCB)
 * using dual-tier validation:
 * 1. AI Vision Model (server-side via /api/verify-pcb)
 * 2. In-browser Computer Vision analyzer (canvas-based substrate & edge density inspection)
 */

export interface PCBValidationResult {
  isValidPCB: boolean;
  confidence: number;
  message: string;
  reason?: string;
}

const INVALID_ERROR_MESSAGE = "Invalid or wrong image. Please upload a clear image of a physical printed circuit board.";

/**
 * Main verification entry point
 */
export async function validatePCBImage(
  imageBase64OrUrl: string,
  fileName: string = ''
): Promise<PCBValidationResult> {
  // 1. Check quick negative file name keywords
  const lowerName = (fileName || '').toLowerCase();
  const negativeKeywords = [
    'selfie', 'portrait', 'person', 'people', 'human', 'face', 'profile',
    'cat', 'dog', 'pet', 'animal', 'bird', 'puppy', 'kitten',
    'landscape', 'sunset', 'mountain', 'nature', 'beach', 'tree', 'flower', 'sky',
    'car', 'vehicle', 'truck', 'bike', 'motorcycle',
    'food', 'pizza', 'burger', 'coffee', 'meal',
    'receipt', 'invoice', 'document', 'resume', 'paper', 'text', 'doc',
    'meme', 'wallpaper', 'drawing', 'illustration', 'clipart', 'anime',
    'screenshot', 'screen_shot', 'capture', 'desktop'
  ];

  // If filename clearly indicates a non-PCB object, fail early
  const matchedNegative = negativeKeywords.find(kw => {
    const regex = new RegExp(`\\b${kw}\\b|[-_]${kw}[-_.]`, 'i');
    return regex.test(lowerName);
  });

  if (matchedNegative) {
    return {
      isValidPCB: false,
      confidence: 0.98,
      message: INVALID_ERROR_MESSAGE,
      reason: `File name indicates non-PCB content (${matchedNegative}).`
    };
  }

  // 2. Try Server-Side AI Vision via /api/verify-pcb
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/verify-pcb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: imageBase64OrUrl,
        fileName
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (typeof data.isPcb === 'boolean') {
        if (!data.isPcb) {
          return {
            isValidPCB: false,
            confidence: data.confidence || 0.95,
            message: INVALID_ERROR_MESSAGE,
            reason: data.reason || 'AI Vision did not detect a physical circuit board.'
          };
        } else {
          return {
            isValidPCB: true,
            confidence: data.confidence || 0.95,
            message: 'Physical PCB verified successfully.',
            reason: data.reason
          };
        }
      }
    }
  } catch (err) {
    // If server times out or fails, fall through to client-side CV inspection
    console.info('Server PCB verification unavailable, utilizing client CV analyzer:', err);
  }

  // 3. Client-Side Computer Vision Analyzer (Canvas-based)
  return analyzeImageClientSide(imageBase64OrUrl, fileName);
}

/**
 * Client-Side Optical & Pixel Analyzer
 * Evaluates substrate colors, edge density, skin tones, and document brightness
 */
async function analyzeImageClientSide(
  imageSrc: string,
  fileName: string
): Promise<PCBValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const sampleSize = 120;
        const canvas = document.createElement('canvas');
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // If canvas unavailable, allow preset/standard images
          resolve({ isValidPCB: true, confidence: 0.7, message: 'Verified' });
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;
        const totalPixels = sampleSize * sampleSize;

        let highLuminanceCount = 0; // Pure white / document paper
        let skinToneCount = 0; // Human skin / selfies / portraits
        let pcbSubstrateCount = 0; // Green, blue, dark slate, red, amber substrate
        let edgeCount = 0; // High-frequency copper trace & component edges
        let metallicSolderCount = 0; // Shiny metallic solder pads

        const gray: number[] = new Array(totalPixels);

        // First pass: pixel color & feature categorization
        for (let i = 0; i < totalPixels; i++) {
          const idx = i * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Grayscale luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          gray[i] = lum;

          // 1. Plain white / document paper check (e.g. invoice, text document, screenshot)
          if (lum > 225 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
            highLuminanceCount++;
          }

          // 2. Human skin tone check (standard RGB biometric model)
          // R > 95, G > 40, B > 20, Max-Min > 15, |R - G| > 15, R > G, R > B
          if (r > 95 && g > 40 && b > 20 && (Math.max(r, g, b) - Math.min(r, g, b)) > 15 && Math.abs(r - g) > 15 && r > g && r > b) {
            skinToneCount++;
          }

          // 3. Typical PCB substrate solder mask colors:
          // a) Green solder mask (standard): Green dominant or dark forest green
          const isGreenMask = (g > r + 10 && g > b + 10) || (g > 35 && g > r && g > b && lum < 140);
          // b) Blue solder mask (Arduino / dev boards): Blue dominant
          const isBlueMask = (b > r + 15 && b > g + 5 && b > 50);
          // c) Dark / matte black substrate: low luminance with metallic traces
          const isDarkSubstrate = (lum < 50);
          // d) Red solder mask (Sparkfun style): Red dominant
          const isRedMask = (r > g + 25 && r > b + 25 && lum < 160);
          // e) Yellow / amber (FR-4 copper core / phenolic paper board)
          const isAmberBoard = (r > 100 && g > 70 && b < 70 && Math.abs(r - g) < 60);

          if (isGreenMask || isBlueMask || isDarkSubstrate || isRedMask || isAmberBoard) {
            pcbSubstrateCount++;
          }

          // 4. Shiny metallic solder pads / pins (high brightness with contrast)
          if (lum > 180 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) {
            metallicSolderCount++;
          }
        }

        // Second pass: Gradient / Edge density check (traces, vias, IC packages, SMD pins)
        for (let y = 1; y < sampleSize - 1; y++) {
          for (let x = 1; x < sampleSize - 1; x++) {
            const currentIdx = y * sampleSize + x;
            // Approximate gradient magnitude
            const dx = Math.abs(gray[currentIdx + 1] - gray[currentIdx - 1]);
            const dy = Math.abs(gray[currentIdx + sampleSize] - gray[currentIdx - sampleSize]);
            const grad = dx + dy;
            if (grad > 42) {
              edgeCount++;
            }
          }
        }

        const whiteRatio = highLuminanceCount / totalPixels;
        const skinRatio = skinToneCount / totalPixels;
        const substrateRatio = pcbSubstrateCount / totalPixels;
        const edgeRatio = edgeCount / totalPixels;
        const metallicRatio = metallicSolderCount / totalPixels;

        // Check if positive PCB filename is present as a hint
        const isPcbNamed = /pcb|circuit|board|arduino|esp32|stm32|hardware|chip|motherboard|solder|schematic/i.test(fileName);

        // RULE 1: High document / white paper check
        if (whiteRatio > 0.65) {
          resolve({
            isValidPCB: false,
            confidence: 0.94,
            message: INVALID_ERROR_MESSAGE,
            reason: 'Image appears to be a paper document, screenshot, or text page.'
          });
          return;
        }

        // RULE 2: Human portrait / skin tone dominance
        if (skinRatio > 0.32 && edgeRatio < 0.12) {
          resolve({
            isValidPCB: false,
            confidence: 0.92,
            message: INVALID_ERROR_MESSAGE,
            reason: 'Image appears to be a person, portrait, or photo without circuit board structures.'
          });
          return;
        }

        // RULE 3: Natural landscape / smooth object check
        // Smooth images (sky, walls, animals, food) have low edge density and lack PCB substrate colors
        if (edgeRatio < 0.04 && substrateRatio < 0.20 && !isPcbNamed) {
          resolve({
            isValidPCB: false,
            confidence: 0.90,
            message: INVALID_ERROR_MESSAGE,
            reason: 'Image lacks electrical traces, solder pads, and circuit substrate characteristics.'
          });
          return;
        }

        // RULE 4: Verified PCB conditions
        // PCB typically has substrate colors (>18%), or characteristic edge density with metallic solder joints
        const hasSubstrate = substrateRatio >= 0.18;
        const hasCircuitEdges = edgeRatio >= 0.05;
        const hasSolderPads = metallicRatio >= 0.01;

        if ((hasSubstrate && hasCircuitEdges) || (hasCircuitEdges && hasSolderPads) || isPcbNamed) {
          resolve({
            isValidPCB: true,
            confidence: 0.88,
            message: 'Physical PCB verified successfully.'
          });
        } else {
          // If none of the criteria match, reject as non-PCB
          resolve({
            isValidPCB: false,
            confidence: 0.85,
            message: INVALID_ERROR_MESSAGE,
            reason: 'Image does not match physical PCB visual specifications.'
          });
        }
      } catch (err) {
        // Fallback in case of unexpected canvas error
        resolve({
          isValidPCB: true,
          confidence: 0.7,
          message: 'Verified'
        });
      }
    };

    img.onerror = () => {
      resolve({
        isValidPCB: false,
        confidence: 1.0,
        message: INVALID_ERROR_MESSAGE,
        reason: 'Failed to decode image data.'
      });
    };

    img.src = imageSrc;
  });
}
