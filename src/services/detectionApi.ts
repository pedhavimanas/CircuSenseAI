import { 
  PCBAnalysis, 
  PCBDetection, 
  PCBBoard, 
  PCBComponent, 
  ComponentCategory, 
  HealthStatus,
  CategoryGroup 
} from '../types';

export interface DetectionOptions {
  confidence_threshold?: number;
  iou_threshold?: number;
  image_size?: number;
  run_ocr?: boolean;
}

export interface BackendAnalysisResponse {
  success: boolean;
  requestId: string;
  model: {
    name: string;
    framework: string;
    task: string;
    classCount: number;
    device?: string;
    modelPath?: string;
  };
  image: {
    width: number;
    height: number;
    filename: string;
    format: string;
    fileSizeBytes?: number;
  };
  detections: PCBDetection[];
  summary: {
    total: number;
    byClass: Record<string, number>;
    byCategory: Record<string, number>;
    avgConfidence: number;
    lowConfidenceCount: number;
    ocrReadableCount: number;
  };
  timing: {
    preprocessMs: number;
    inferenceMs: number;
    postprocessMs: number;
    totalMs: number;
  };
}

export interface HealthResponse {
  status: string;
  modelLoaded: boolean;
  modelClasses: number;
  modelName: string;
  device: string;
  error?: string;
}

export interface ModelInfoResponse {
  name: string;
  framework: string;
  task: string;
  classCount: number;
  classes: Record<string | number, string>;
  inputSize: number;
  device: string;
  defaultConfidence: number;
  defaultIou: number;
}

/**
 * Maps model class name into UI ComponentCategory for backwards compatibility
 */
function mapClassToCategory(className: string): ComponentCategory {
  const lower = className.toLowerCase();
  if (lower === 'ic' || lower === 'clock') return 'IC';
  if (lower === 'resistor' || lower === 'potentiometer') return 'Resistor';
  if (lower === 'capacitor') return 'Capacitor';
  if (lower === 'diode' || lower === 'led') return 'Diode';
  if (lower === 'transistor') return 'Transistor';
  if (lower === 'inductor' || lower === 'transformer') return 'Inductor';
  if (lower === 'connector' || lower === 'pins' || lower === 'pads') return 'Connector';
  return 'Other';
}

export const detectionApi = {
  /**
   * Health check to test backend connectivity and verify YOLO model readiness
   */
  getHealth: async (signal?: AbortSignal): Promise<HealthResponse> => {
    const res = await fetch('/api/health', { signal });
    if (!res.ok) {
      throw new Error(`Health check failed with HTTP ${res.status}`);
    }
    return res.json();
  },

  /**
   * Fetches model class taxonomy and runtime info
   */
  getModelInfo: async (signal?: AbortSignal): Promise<ModelInfoResponse> => {
    const res = await fetch('/api/model-info', { signal });
    if (!res.ok) {
      throw new Error(`Failed to fetch model info (HTTP ${res.status})`);
    }
    return res.json();
  },

  /**
   * Primary inference endpoint: uploads real image file and returns real YOLO detections
   */
  detectPCB: async (
    file: File,
    options?: DetectionOptions,
    signal?: AbortSignal
  ): Promise<PCBAnalysis> => {
    const formData = new FormData();
    formData.append('image', file, file.name);

    if (options?.confidence_threshold !== undefined) {
      formData.append('confidence_threshold', options.confidence_threshold.toString());
    }
    if (options?.iou_threshold !== undefined) {
      formData.append('iou_threshold', options.iou_threshold.toString());
    }
    if (options?.image_size !== undefined) {
      formData.append('image_size', options.image_size.toString());
    }
    if (options?.run_ocr !== undefined) {
      formData.append('run_ocr', options.run_ocr ? 'true' : 'false');
    }

    const response = await fetch('/api/detect-pcb', {
      method: 'POST',
      body: formData,
      signal
    });

    if (!response.ok) {
      let errorMsg = `Server error (HTTP ${response.status})`;
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.detail || errorJson.error?.message || errorMsg;
      } catch {
        // use default
      }
      throw new Error(errorMsg);
    }

    const data: BackendAnalysisResponse = await response.json();

    if (!data.success) {
      throw new Error('Analysis failed on server.');
    }

    // Return strictly formatted PCBAnalysis object
    const analysis: PCBAnalysis = {
      id: data.requestId,
      sourceType: 'live_upload',
      sourceImage: {
        name: data.image.filename || file.name,
        width: data.image.width,
        height: data.image.height,
        fileSizeBytes: data.image.fileSizeBytes || file.size
      },
      status: 'complete',
      detections: data.detections || [],
      summary: data.summary,
      timing: data.timing,
      model: data.model,
      createdAt: new Date().toISOString()
    };

    return analysis;
  },

  /**
   * Helper that converts a real PCBAnalysis into a complete PCBBoard model
   * ensuring that all counts, lists, and coordinates are derived solely from the real detections.
   */
  analysisToBoard: (
    analysis: PCBAnalysis,
    imageUrl: string,
    storageKey?: string
  ): PCBBoard => {
    const detections = analysis.detections;
    const byClass = analysis.summary?.byClass || {};

    // Map each real detection item to a PCBComponent
    const components: PCBComponent[] = detections.map((det, idx) => {
      const classDisplayName = det.className.charAt(0).toUpperCase() + det.className.slice(1);
      const category = mapClassToCategory(det.className);

      return {
        id: det.id,
        name: det.referenceDesignator || `${classDisplayName} #${idx + 1}`,
        type: category,
        package: det.categoryGroup,
        confidence: Math.round(det.confidence * 100),
        status: det.healthStatus || 'not_assessed',
        ocrMarking: det.ocr?.status === 'detected' ? det.ocr.text : undefined,
        description: `CircuSense YOLO detected ${det.className} with ${(det.confidence * 100).toFixed(1)}% confidence.`,
        specs: {
          mounting: 'SMD',
          detectionSource: 'CircuSense YOLO (best.pt)'
        },
        bbox: det.bboxNormalized,
        rawBbox: det.bbox,
        modelClass: det.className,
        modelClassId: det.classId
      };
    });

    const total = detections.length;
    const avgConf = analysis.summary?.avgConfidence 
      ? Math.round(analysis.summary.avgConfidence * 100)
      : (total > 0 ? Math.round(detections.reduce((s, d) => s + d.confidence, 0) / total * 100) : 0);

    return {
      id: analysis.id,
      name: `Analysis: ${analysis.sourceImage.name}`,
      boardCode: `PCB-SCAN-${analysis.id.slice(0, 8).toUpperCase()}`,
      layerCount: 2,
      dimensions: `${analysis.sourceImage.width}x${analysis.sourceImage.height}px`,
      thumbnailColor: '#00D1FF',
      uploadedAt: analysis.createdAt.replace('T', ' ').slice(0, 16),
      presetType: 'custom_uploaded',
      sourceType: 'live_upload',
      isDemoData: false,
      scanSource: 'circusense_yolo',
      customImageBase64: imageUrl,
      analysis,
      components,
      metrics: {
        totalComponents: total,
        icsCount: byClass['ic'] || 0,
        resistorsCount: byClass['resistor'] || 0,
        capacitorsCount: byClass['capacitor'] || 0,
        diodesCount: (byClass['diode'] || 0) + (byClass['led'] || 0),
        otherCount: total - ((byClass['ic'] || 0) + (byClass['resistor'] || 0) + (byClass['capacitor'] || 0) + (byClass['diode'] || 0) + (byClass['led'] || 0)),
        warningsCount: analysis.summary?.lowConfidenceCount || 0,
        identifiedPercentage: total > 0 ? Math.round((analysis.summary?.ocrReadableCount || 0) / total * 100) : 0,
        averageConfidence: avgConf,
        healthScore: 100 // Unassessed components start at neutral/full until electrical verification
      }
    };
  }
};
