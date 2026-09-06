import os
import time
import logging
from typing import Dict, Any, Optional
import torch
from ultralytics import YOLO

logger = logging.getLogger("circusense.detector")

EXPECTED_CLASSES = {
    0: "battery",
    1: "button",
    2: "buzzer",
    3: "capacitor",
    4: "clock",
    5: "connector",
    6: "diode",
    7: "display",
    8: "fuse",
    9: "heatsink",
    10: "ic",
    11: "inductor",
    12: "led",
    13: "pads",
    14: "pins",
    15: "potentiometer",
    16: "relay",
    17: "resistor",
    18: "switch",
    19: "transducer",
    20: "transformer",
    21: "transistor"
}

class PCBDetector:
    _instance: Optional["PCBDetector"] = None

    def __init__(self, model_path: str = "models/best.pt"):
        self.model_path = model_path
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model: Optional[YOLO] = None
        self.class_names: Dict[int, str] = {}
        self.is_loaded = False
        self.load_error: Optional[str] = None
        self._load_and_validate()

    @classmethod
    def get_instance(cls, model_path: str = "models/best.pt") -> "PCBDetector":
        if cls._instance is None:
            cls._instance = PCBDetector(model_path)
        return cls._instance

    def _load_and_validate(self):
        logger.info(f"Initializing PCBDetector with model: {self.model_path}")
        
        if not os.path.exists(self.model_path):
            # Check relative to project root or cwd
            alt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "best.pt")
            if os.path.exists(alt_path):
                self.model_path = alt_path
            else:
                self.load_error = f"Model file not found at '{self.model_path}'"
                logger.error(self.load_error)
                raise FileNotFoundError(self.load_error)

        try:
            self.model = YOLO(self.model_path)
            
            # Verify task
            task = getattr(self.model, "task", "detect")
            logger.info(f"Model task verified: {task}")
            
            # Read class names
            raw_names = self.model.names
            if isinstance(raw_names, dict):
                self.class_names = {int(k): str(v) for k, v in raw_names.items()}
            elif isinstance(raw_names, list):
                self.class_names = {i: str(v) for i, v in enumerate(raw_names)}
            else:
                self.class_names = EXPECTED_CLASSES.copy()

            logger.info(f"Model loaded with {len(self.class_names)} classes on device: {self.device}")

            # Validate against expected 22 classes
            mismatches = []
            for cls_id, expected_name in EXPECTED_CLASSES.items():
                actual = self.class_names.get(cls_id)
                if actual != expected_name:
                    mismatches.append(f"Class {cls_id}: expected '{expected_name}', got '{actual}'")
            
            if mismatches:
                logger.warning(f"Class taxonomy differences detected ({len(mismatches)}): {mismatches[:3]}")
            else:
                logger.info("Class taxonomy strictly matches the expected 22 CircuSense classes.")

            self.is_loaded = True
            logger.info("PCBDetector successfully initialized and ready for inference.")

        except Exception as e:
            self.is_loaded = False
            self.load_error = f"Failed to load Ultralytics YOLO model: {str(e)}"
            logger.error(self.load_error, exc_info=True)
            raise RuntimeError(self.load_error) from e

    def predict(
        self,
        image,
        conf: float = 0.25,
        iou: float = 0.45,
        imgsz: int = 640
    ) -> Any:
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Model is not loaded. Cannot run inference.")

        t0 = time.perf_counter()
        results = self.model.predict(
            source=image,
            conf=conf,
            iou=iou,
            imgsz=imgsz,
            device=self.device,
            verbose=False
        )
        inference_ms = (time.perf_counter() - t0) * 1000.0

        return results, inference_ms
