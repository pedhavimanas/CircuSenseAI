from typing import List, Dict, Any, Tuple
from .schemas import PCBDetectionItem, RawBBox, NormalizedBBox, OCRResult, AnalysisSummary

# Authoritative classification grouping according to hardware engineering categories
CATEGORY_MAP: Dict[str, str] = {
    "battery": "Power",
    "button": "Electromechanical",
    "buzzer": "Electromechanical",
    "capacitor": "Passive",
    "clock": "Semiconductor",
    "connector": "Connector",
    "diode": "Semiconductor",
    "display": "Display",
    "fuse": "Power",
    "heatsink": "Mechanical/PCB Feature",
    "ic": "Semiconductor",
    "inductor": "Passive",
    "led": "Semiconductor",
    "pads": "Mechanical/PCB Feature",
    "pins": "Connector",
    "potentiometer": "Passive",
    "relay": "Electromechanical",
    "resistor": "Passive",
    "switch": "Electromechanical",
    "transducer": "Electromechanical",
    "transformer": "Power",
    "transistor": "Semiconductor"
}

def postprocess_yolo_detections(
    boxes_tensor,
    class_names: Dict[int, str],
    image_width: int,
    image_height: int,
    ocr_results: List[OCRResult] = None
) -> Tuple[List[PCBDetectionItem], AnalysisSummary]:
    """
    Converts raw YOLO boxes into validated, normalized detection items.
    """
    detections: List[PCBDetectionItem] = []
    by_class: Dict[str, int] = {}
    by_category: Dict[str, int] = {}
    conf_sum = 0.0
    low_conf_count = 0
    ocr_count = 0

    if boxes_tensor is not None and len(boxes_tensor) > 0:
        xyxy = boxes_tensor.xyxy.cpu().numpy()
        confs = boxes_tensor.conf.cpu().numpy()
        clss = boxes_tensor.cls.cpu().numpy()

        for idx in range(len(xyxy)):
            x1_raw, y1_raw, x2_raw, y2_raw = xyxy[idx]
            conf = float(confs[idx])
            class_id = int(clss[idx])
            class_name = class_names.get(class_id, f"class_{class_id}")
            category = CATEGORY_MAP.get(class_name, "Other")

            # Clamp coordinates to image boundaries
            x1 = max(0.0, min(float(x1_raw), float(image_width)))
            y1 = max(0.0, min(float(y1_raw), float(image_height)))
            x2 = max(0.0, min(float(x2_raw), float(image_width)))
            y2 = max(0.0, min(float(y2_raw), float(image_height)))

            box_w = x2 - x1
            box_h = y2 - y1

            # Reject zero or negative size boxes
            if box_w <= 0.5 or box_h <= 0.5:
                continue

            # Calculate normalized percentages 0 - 100
            norm_x = (x1 / image_width) * 100.0
            norm_y = (y1 / image_height) * 100.0
            norm_w = (box_w / image_width) * 100.0
            norm_h = (box_h / image_height) * 100.0

            det_id = f"det-{len(detections) + 1:04d}"

            ocr = ocr_results[idx] if (ocr_results and idx < len(ocr_results)) else OCRResult()
            if ocr.status == "detected" and ocr.text:
                ocr_count += 1

            detection_item = PCBDetectionItem(
                id=det_id,
                classId=class_id,
                className=class_name,
                categoryGroup=category,
                confidence=round(conf, 4),
                bbox=RawBBox(x1=round(x1, 2), y1=round(y1, 2), x2=round(x2, 2), y2=round(y2, 2)),
                bboxNormalized=NormalizedBBox(
                    x=round(norm_x, 2),
                    y=round(norm_y, 2),
                    width=round(norm_w, 2),
                    height=round(norm_h, 2)
                ),
                ocr=ocr,
                healthStatus="not_assessed"
            )

            detections.append(detection_item)

            by_class[class_name] = by_class.get(class_name, 0) + 1
            by_category[category] = by_category.get(category, 0) + 1
            conf_sum += conf
            if conf < 0.5:
                low_conf_count += 1

    total = len(detections)
    avg_conf = round(conf_sum / total, 4) if total > 0 else 0.0

    summary = AnalysisSummary(
        total=total,
        byClass=by_class,
        byCategory=by_category,
        avgConfidence=avg_conf,
        lowConfidenceCount=low_conf_count,
        ocrReadableCount=ocr_count
    )

    return detections, summary
