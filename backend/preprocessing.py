import io
from typing import Tuple, Dict, Any
from PIL import Image, ImageOps, UnidentifiedImageError
import numpy as np

MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024  # 30 MB
ALLOWED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP", "BMP"}

def validate_and_preprocess_image(
    file_bytes: bytes,
    filename: str = "uploaded_pcb.jpg"
) -> Tuple[np.ndarray, Image.Image, Dict[str, Any]]:
    """
    Validates uploaded image bytes, fixes EXIF rotation, ensures RGB,
    and returns numpy array for YOLO plus PIL image and image metadata.
    """
    if not file_bytes:
        raise ValueError("Image file is empty (0 bytes).")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError(f"Image exceeds maximum size limit of {MAX_FILE_SIZE_BYTES // (1024*1024)} MB.")

    try:
        pil_image = Image.open(io.BytesIO(file_bytes))
    except UnidentifiedImageError:
        raise ValueError("File is not a valid image or format is unsupported. Please upload JPG, PNG, or WEBP.")
    except Exception as e:
        raise ValueError(f"Failed to decode image: {str(e)}")

    img_format = (pil_image.format or "JPEG").upper()
    if img_format not in ALLOWED_FORMATS:
        raise ValueError(f"Image format '{img_format}' is not supported. Please upload JPG, PNG, or WEBP.")

    # Correct EXIF rotation if photo was taken on phone/tablet
    try:
        pil_image = ImageOps.exif_transpose(pil_image)
    except Exception:
        pass  # If EXIF reading fails, continue with raw orientation

    # Ensure RGB
    if pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")

    width, height = pil_image.size
    if width < 32 or height < 32:
        raise ValueError(f"Image resolution too low ({width}x{height}). Minimum resolution is 32x32.")

    # Convert to RGB numpy array for Ultralytics YOLO
    np_image = np.array(pil_image)

    metadata = {
        "width": width,
        "height": height,
        "filename": filename,
        "format": img_format,
        "fileSizeBytes": len(file_bytes)
    }

    return np_image, pil_image, metadata
