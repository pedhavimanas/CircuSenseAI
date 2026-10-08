export type NavigationTab = 
  | 'dashboard' 
  | 'projects' 
  | 'analyzer' 
  | 'components' 
  | 'faults' 
  | 'datasheets' 
  | 'assistant' 
  | 'settings';

/**
 * Authoritative 22-class taxonomy matching the trained Ultralytics YOLO model (best.pt)
 */
export type ModelComponentClass =
  | 'battery'
  | 'button'
  | 'buzzer'
  | 'capacitor'
  | 'clock'
  | 'connector'
  | 'diode'
  | 'display'
  | 'fuse'
  | 'heatsink'
  | 'ic'
  | 'inductor'
  | 'led'
  | 'pads'
  | 'pins'
  | 'potentiometer'
  | 'relay'
  | 'resistor'
  | 'switch'
  | 'transducer'
  | 'transformer'
  | 'transistor';

export type CategoryGroup =
  | 'Semiconductor'
  | 'Passive'
  | 'Power'
  | 'Connector'
  | 'Electromechanical'
  | 'Display'
  | 'Mechanical/PCB Feature'
  | 'Other';

export type ComponentCategory = 
  | 'IC' 
  | 'Resistor' 
  | 'Capacitor' 
  | 'Diode' 
  | 'Transistor' 
  | 'Regulator' 
  | 'Inductor' 
  | 'Connector' 
  | 'Crystal'
  | 'Other';

export type HealthStatus = 'not_assessed' | 'visual_ok' | 'inspection_required' | 'possible_issue' | 'normal' | 'inspection' | 'issue';

export type DiagnosisStage = 
  | 'visual_inspection'
  | 'ai_suspicion'
  | 'electrical_diagnosis'
  | 'advanced_multimodal';

export interface PinDefinition {
  pin: number;
  label: string;
  type: 'PWR' | 'GND' | 'IO' | 'IN' | 'OUT' | 'NC' | 'ANALOG';
  expectedVoltage?: string;
  measuredVoltage?: string;
  description?: string;
}

export interface TestMeasurement {
  id: string;
  testPoint: string;
  type: 'voltage' | 'resistance' | 'diode' | 'frequency';
  expected: string;
  measured: string;
  unit: string;
  verified: boolean;
  status: 'passed' | 'marginal' | 'failed' | 'pending';
}

export interface ComponentFault {
  id: string;
  componentId: string;
  componentRef: string;
  title: string;
  severity: HealthStatus;
  confidence: number;
  indicators: string[];
  recommendation: string;
  diagnosisStage: DiagnosisStage;
  measurements: TestMeasurement[];
  notes?: string;
  verificationSteps?: any[];
  requiresElectricalVerification?: boolean;
}

export interface BoundingBox {
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface RawBBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface OCRResult {
  text?: string;
  confidence?: number;
  status: 'detected' | 'uncertain' | 'not_found' | 'not_attempted';
}

export interface PCBDetection {
  id: string;                       // e.g. "det-0001"
  classId: number;                  // 0 to 21
  className: ModelComponentClass | string; // authoritative class from YOLO
  categoryGroup: CategoryGroup;     // UI grouping
  confidence: number;               // 0.0 to 1.0 from model
  bbox: RawBBox;                    // Image pixel coordinates
  bboxNormalized: BoundingBox;      // Normalized 0-100% coordinates
  ocr: OCRResult;
  referenceDesignator?: string;     // e.g. "C14" only if OCR found it
  referenceSource?: 'ocr' | 'silkscreen' | 'user';
  healthStatus: HealthStatus;
}

export interface PCBComponent {
  id: string;
  name: string;
  type: ComponentCategory;
  package: string;
  confidence: number; // 0 to 100
  status: HealthStatus;
  ocrMarking?: string;
  description: string;
  specs: {
    inputVoltage?: string;
    outputVoltage?: string;
    ratedCurrent?: string;
    capacitance?: string;
    resistance?: string;
    tolerance?: string;
    operatingTemp?: string;
    mounting?: 'SMD' | 'THT';
    [key: string]: string | undefined;
  };
  bbox: BoundingBox;
  rawBbox?: RawBBox;
  modelClass?: ModelComponentClass | string;
  modelClassId?: number;
  pins?: PinDefinition[];
  datasheetId?: string;
  fault?: ComponentFault;
}

export interface ElectricalSpecItem {
  parameter: string;
  symbol: string;
  min?: string;
  typ?: string;
  max?: string;
  unit: string;
  condition?: string;
}

export interface Datasheet {
  id: string;
  partNumber: string;
  title: string;
  manufacturer: string;
  category: ComponentCategory;
  summary: string;
  packageTypes: string[];
  pinout: { pin: number; name: string; function: string }[];
  electricalSpecs: ElectricalSpecItem[];
  applications: string[];
  typicalCircuitDescription: string;
  sourceUrl?: string;
}

export interface AnalysisSummary {
  total: number;
  byClass: Record<string, number>;
  byCategory: Record<string, number>;
  avgConfidence: number;
  lowConfidenceCount: number;
  ocrReadableCount: number;
}

export interface AnalysisTiming {
  preprocessMs: number;
  inferenceMs: number;
  postprocessMs: number;
  totalMs: number;
}

export interface ModelMetadata {
  name: string;
  framework: string;
  task: string;
  classCount: number;
  device?: string;
  modelPath?: string;
}

export interface PCBAnalysis {
  id: string;
  sourceType: 'live_upload' | 'demo';
  sourceImage: {
    name: string;
    width: number;
    height: number;
    url?: string;
    storageKey?: string;
    fileSizeBytes?: number;
  };
  status: 'idle' | 'uploading' | 'preprocessing' | 'detecting' | 'postprocessing' | 'complete' | 'error';
  detections: PCBDetection[];
  summary: AnalysisSummary;
  timing?: AnalysisTiming;
  model: ModelMetadata;
  createdAt: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PCBBoard {
  id: string;
  name: string;
  boardCode: string;
  layerCount: number;
  dimensions: string;
  thumbnailColor: string;
  uploadedAt: string;
  presetType: 'power_supply' | 'iot_mcu' | 'motor_driver' | 'custom_uploaded';
  components: PCBComponent[];
  customImageBase64?: string;
  isDemoData?: boolean;
  sourceType?: 'live_upload' | 'demo';
  scanSource?: 'real_ai' | 'demo_fallback' | 'circusense_yolo';
  apiError?: string;
  circuitOverview?: string;
  analysis?: PCBAnalysis;
  metrics: {
    totalComponents: number;
    icsCount: number;
    resistorsCount: number;
    capacitorsCount: number;
    diodesCount: number;
    otherCount: number;
    warningsCount: number;
    identifiedPercentage: number;
    averageConfidence: number;
    healthScore: number;
  };
}

export interface ProjectRecord {
  id: string;
  name: string;
  boardCode: string;
  updatedAt: string;
  componentsCount: number;
  warningsCount: number;
  status: 'analyzed' | 'in_progress' | 'fault_flagged' | 'certified';
  board: PCBBoard;
  analysis?: PCBAnalysis;
  imageStorageKey?: string;
  notes?: string;
}

export interface ScanProgressState {
  isScanning: boolean;
  progress: number;
  stageName: 'idle' | 'uploading' | 'preprocessing' | 'detecting' | 'postprocessing' | 'complete' | 'error';
  currentStage: string;
  detectedCount: {
    ics: number;
    resistors: number;
    capacitors: number;
    diodes: number;
    total: number;
  };
  currentHighlightedBbox?: BoundingBox;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  relatedComponentId?: string;
  relatedDatasheetId?: string;
  suggestedPrompts?: string[];
}

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  avatar?: string;
  createdAt: string;
}

export type AuthMode = 'login' | 'signup' | 'forgot_password';
