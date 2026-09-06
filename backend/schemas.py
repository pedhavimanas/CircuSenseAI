from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field

class RawBBox(BaseModel):
    x1: float = Field(..., description="Left pixel coordinate")
    y1: float = Field(..., description="Top pixel coordinate")
    x2: float = Field(..., description="Right pixel coordinate")
    y2: float = Field(..., description="Bottom pixel coordinate")

class NormalizedBBox(BaseModel):
    x: float = Field(..., description="Left coordinate as percentage 0-100")
    y: float = Field(..., description="Top coordinate as percentage 0-100")
    width: float = Field(..., description="Width as percentage 0-100")
    height: float = Field(..., description="Height as percentage 0-100")

class OCRResult(BaseModel):
    text: Optional[str] = None
    confidence: Optional[float] = None
    status: Literal["detected", "uncertain", "not_found", "not_attempted"] = "not_attempted"

class PCBDetectionItem(BaseModel):
    id: str
    classId: int
    className: str
    categoryGroup: str
    confidence: float
    bbox: RawBBox
    bboxNormalized: NormalizedBBox
    ocr: OCRResult
    referenceDesignator: Optional[str] = None
    referenceSource: Optional[str] = None
    healthStatus: Literal["not_assessed", "visual_ok", "inspection_required", "possible_issue"] = "not_assessed"

class ImageMetadata(BaseModel):
    width: int
    height: int
    filename: Optional[str] = None
    format: Optional[str] = None
    fileSizeBytes: Optional[int] = None

class ModelMetadata(BaseModel):
    name: str = "CircuSense PCB Detector"
    framework: str = "Ultralytics YOLO"
    task: str = "detect"
    classCount: int = 22
    device: str = "cpu"
    modelPath: str = "models/best.pt"

class AnalysisSummary(BaseModel):
    total: int
    byClass: Dict[str, int]
    byCategory: Dict[str, int]
    avgConfidence: float
    lowConfidenceCount: int
    ocrReadableCount: int

class AnalysisTiming(BaseModel):
    preprocessMs: float
    inferenceMs: float
    postprocessMs: float
    totalMs: float

class AnalysisResponse(BaseModel):
    success: bool = True
    requestId: str
    model: ModelMetadata
    image: ImageMetadata
    detections: List[PCBDetectionItem]
    summary: AnalysisSummary
    timing: AnalysisTiming

class HealthResponse(BaseModel):
    status: str = "ok"
    modelLoaded: bool
    modelClasses: int
    modelName: str
    device: str
    error: Optional[str] = None

class ModelInfoResponse(BaseModel):
    name: str
    framework: str
    task: str
    classCount: int
    classes: Dict[int, str]
    inputSize: int
    device: str
    defaultConfidence: float = 0.25
    defaultIou: float = 0.45

class ChatRequest(BaseModel):
    query: str
    analysisContext: Optional[Dict[str, Any]] = None
    selectedComponent: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    success: bool
    text: str
    relatedComponentId: Optional[str] = None
    suggestedPrompts: Optional[List[str]] = None
    error: Optional[str] = None
