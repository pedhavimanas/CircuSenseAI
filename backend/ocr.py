from typing import List, Optional
from PIL import Image
from .schemas import OCRResult, RawBBox

def run_ocr_on_crops(
    pil_image: Image.Image,
    raw_boxes: List[RawBBox],
    enabled: bool = False
) -> List[OCRResult]:
    """
    Extracts visible component markings from cropped bounding boxes.
    Never invents or hallucinates text. Returns 'not_attempted' or 'not_found'
    when OCR cannot reliably read markings.
    """
    results: List[OCRResult] = []
    
    # If OCR is not explicitly requested or OCR engine is not installed,
    # report honestly as 'not_attempted'
    if not enabled:
        return [OCRResult(status="not_attempted") for _ in raw_boxes]

    # Try importing optional OCR engine (e.g. pytesseract)
    try:
        import pytesseract
        has_tesseract = True
    except ImportError:
        has_tesseract = False

    for box in raw_boxes:
        if not has_tesseract:
            results.append(OCRResult(status="not_attempted"))
            continue

        try:
            # Crop box with slight margin
            w, h = pil_image.size
            crop_x1 = max(0, int(box.x1) - 2)
            crop_y1 = max(0, int(box.y1) - 2)
            crop_x2 = min(w, int(box.x2) + 2)
            crop_y2 = min(h, int(box.y2) + 2)

            if crop_x2 - crop_x1 < 10 or crop_y2 - crop_y1 < 10:
                results.append(OCRResult(status="not_found"))
                continue

            crop = pil_image.crop((crop_x1, crop_y1, crop_x2, crop_y2))
            
            # Simple optical preprocessing: convert grayscale
            gray = crop.convert('L')
            text = pytesseract.image_to_string(
                gray,
                config='--psm 7 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-/'
            ).strip()

            if text and len(text) >= 2:
                results.append(OCRResult(text=text, confidence=0.75, status="detected"))
            else:
                results.append(OCRResult(status="not_found"))
        except Exception:
            results.append(OCRResult(status="uncertain"))

    return results
