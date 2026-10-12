import os
import shutil
import logging
from typing import List, Optional, Dict, Any
from PIL import Image
from .schemas import OCRResult, RawBBox

logger = logging.getLogger("circusense.ocr")

# Default common installation paths across platforms
_DEFAULT_TESSERACT_PATHS = [
    # Windows standard 64-bit and 32-bit install paths
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    # Unix / Linux / macOS standard paths
    "/usr/bin/tesseract",
    "/usr/local/bin/tesseract",
    "/opt/homebrew/bin/tesseract",
]


def find_tesseract_cmd() -> Optional[str]:
    """
    Locates the Tesseract OCR executable.
    Resolution order:
    1. TESSERACT_CMD or TESSERACT_PATH environment variable
    2. System PATH lookup via shutil.which('tesseract')
    3. Sensible Windows default paths (e.g. C:\\Program Files\\Tesseract-OCR\\tesseract.exe)
    4. Sensible Unix/Linux/macOS default paths
    """
    env_path = os.getenv("TESSERACT_CMD") or os.getenv("TESSERACT_PATH")
    if env_path:
        if os.path.isfile(env_path) or shutil.which(env_path):
            return env_path
        logger.warning("Configured Tesseract path does not exist: %s", env_path)

    which_cmd = shutil.which("tesseract") or shutil.which("tesseract.exe")
    if which_cmd:
        return which_cmd

    for candidate in _DEFAULT_TESSERACT_PATHS:
        if os.path.isfile(candidate):
            return candidate

    return None


def configure_tesseract() -> bool:
    """
    Configures pytesseract with the resolved Tesseract executable path.
    Returns True if pytesseract is installed and the executable is found.
    """
    try:
        import pytesseract
    except ImportError:
        logger.warning("pytesseract package is not installed.")
        return False

    cmd = find_tesseract_cmd()
    if not cmd:
        logger.warning(
            "Tesseract executable not found. Set TESSERACT_CMD environment variable "
            "or install Tesseract to a default location."
        )
        return False

    try:
        pytesseract.pytesseract.tesseract_cmd = cmd
        return True
    except Exception as e:
        logger.error("Failed to set pytesseract.tesseract_cmd to %s: %s", cmd, e)
        return False


def get_tesseract_info() -> Dict[str, Any]:
    """
    Returns engine metadata including availability, version, language packs, and binary path.
    """
    if not configure_tesseract():
        return {"available": False, "version": None, "languages": []}

    try:
        import pytesseract
        return {
            "available": True,
            "version": str(pytesseract.get_tesseract_version()),
            "languages": pytesseract.get_languages(),
            "cmd": pytesseract.pytesseract.tesseract_cmd
        }
    except Exception as e:
        return {"available": False, "error": str(e)}


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
    # If OCR is not explicitly requested, report honestly as 'not_attempted'
    if not enabled:
        return [OCRResult(status="not_attempted") for _ in raw_boxes]

    # Verify OCR engine is installed and configured
    if not configure_tesseract():
        return [OCRResult(status="not_attempted") for _ in raw_boxes]

    import pytesseract

    results: List[OCRResult] = []
    for box in raw_boxes:
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

            # Optical preprocessing: convert to grayscale
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
