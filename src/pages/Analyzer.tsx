import React, { useState, useMemo, useRef } from 'react';
import { PCBBoard, PCBComponent, PCBDetection } from '../types';
import { PCBAnalysisCanvas } from '../components/PCBAnalysisCanvas';
import { PCBViewer } from '../components/PCBViewer';
import { detectionApi, DetectionOptions } from '../services/detectionApi';
import { pcbApi } from '../services/pcbApi';
import { 
  Scan, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Activity, 
  AlertTriangle,
  Loader2,
  SlidersHorizontal,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface AnalyzerProps {
  board: PCBBoard;
  onViewResults: () => void;
  onSelectComponent: (component: PCBComponent) => void;
  onUpdateBoard?: (board: PCBBoard) => void;
}

export const Analyzer: React.FC<AnalyzerProps> = ({
  board,
  onViewResults,
  onSelectComponent,
  onUpdateBoard
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<string>('Ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.25);
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | undefined>(
    board.components[0]?.id
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  const effectiveError = errorMessage || (!isProcessing ? board.apiError : null) || null;
  const isAnalyzing = isProcessing || (board.dimensions === 'Detecting...' && !board.analysis && !effectiveError);

  // Derive real detections from board.analysis or board.components
  const detections: PCBDetection[] = useMemo(() => {
    if (board.analysis?.detections) {
      return board.analysis.detections;
    }
    // Convert components to PCBDetection shape for canvas
    return board.components.map((c, i) => ({
      id: c.id,
      classId: c.modelClassId ?? i,
      className: c.modelClass || c.type.toLowerCase(),
      categoryGroup: 'Other',
      confidence: c.confidence / 100,
      bbox: c.rawBbox || { x1: 0, y1: 0, x2: 100, y2: 100 },
      bboxNormalized: c.bbox,
      ocr: { status: c.ocrMarking ? 'detected' : 'not_attempted', text: c.ocrMarking },
      healthStatus: c.status
    }));
  }, [board]);

  const handleSelectDetection = (det: PCBDetection) => {
    setSelectedDetectionId(det.id);
    const matchedComp = board.components.find(c => c.id === det.id);
    if (matchedComp) {
      onSelectComponent(matchedComp);
    } else {
      // Create component from detection
      onSelectComponent({
        id: det.id,
        name: det.className,
        type: 'IC',
        package: det.categoryGroup,
        confidence: Math.round(det.confidence * 100),
        status: det.healthStatus,
        description: `Detected ${det.className}`,
        specs: {},
        bbox: det.bboxNormalized,
        rawBbox: det.bbox,
        modelClass: det.className,
        modelClassId: det.classId
      });
    }
  };

  const handleRunInference = async () => {
    if (!board.customImageBase64) return;

    // Abort previous running request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStage('Preparing image for YOLO inference...');

    try {
      // Convert image source to File blob
      const res = await fetch(board.customImageBase64);
      const blob = await res.blob();
      const file = new File([blob], board.name.replace(/[^a-zA-Z0-9.-]/g, '_') + '.jpg', { type: blob.type || 'image/jpeg' });

      setCurrentStage('Running CircuSense YOLO model (best.pt)...');

      const updatedBoard = await pcbApi.executeRealAnalysis(
        file,
        { confidence_threshold: confidenceThreshold, iou_threshold: 0.45, image_size: 640 },
        controller.signal,
        (stage) => setCurrentStage(stage)
      );

      setIsProcessing(false);
      setCurrentStage('Analysis complete.');
      if (onUpdateBoard) {
        onUpdateBoard(updatedBoard);
      }
      if (updatedBoard.components.length > 0) {
        onSelectComponent(updatedBoard.components[0]);
        setSelectedDetectionId(updatedBoard.components[0].id);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setCurrentStage('Analysis cancelled.');
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
      setErrorMessage(err?.message || 'Inference service failed to process image.');
      setCurrentStage('Analysis failed.');
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setCurrentStage('Cancelled by user.');
  };

  const isLiveUpload = Boolean(board.customImageBase64) && !board.isDemoData;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12151A] border border-slate-800 rounded-xl px-5 py-3.5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20">
            <Scan size={20} className={isAnalyzing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                PCB Optical Inspection Analyzer
              </h1>
              {board.isDemoData ? (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO BENCHMARK (OFFLINE)
                </span>
              ) : (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>LIVE YOLO MODEL (best.pt)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Active Target: <span className="text-slate-200 font-mono font-medium">{board.name}</span> ({board.boardCode})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {isProcessing ? (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs border border-rose-500/40 transition-colors cursor-pointer"
            >
              <XCircle size={14} />
              <span>Cancel</span>
            </button>
          ) : (
            isLiveUpload && (
              <button
                onClick={handleRunInference}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-200 text-xs border border-slate-700 transition-colors cursor-pointer"
                title="Re-run YOLO Model with current threshold"
              >
                <RotateCcw size={13} />
                <span>Re-run YOLO</span>
              </button>
            )
          )}

          <button
            onClick={onViewResults}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] text-xs font-bold shadow-lg shadow-[#00D1FF]/20 transition-all cursor-pointer"
          >
            <span>View Full Results</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Processing Status Banner */}
      {isAnalyzing && (
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs text-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Loader2 size={18} className="animate-spin text-[#00D1FF]" />
            <div className="space-y-0.5">
              <span className="font-bold text-white block">
                {isProcessing ? currentStage : 'Running CircuSense YOLO model (best.pt)...'}
              </span>
              <span className="text-slate-400 text-[11px] font-mono">Running Ultralytics inference on 22 hardware classes</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#00D1FF] animate-pulse">MODEL INFERENCE ACTIVE</span>
        </div>
      )}

      {/* Technical Error Notice (Honest Error Handling - No Fake Fallback!) */}
      {effectiveError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <AlertTriangle size={18} className="text-rose-400" />
            <span>PCB Detection Service Error</span>
          </div>
          <p className="text-slate-300 font-mono text-[11px] bg-black/40 p-2.5 rounded border border-rose-500/30">
            {effectiveError}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              The CircuSense YOLO model could not complete detection on this file.
            </span>
            <button
              onClick={handleRunInference}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Honest Empty Detection Notice */}
      {!isAnalyzing && !effectiveError && isLiveUpload && detections.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <HelpCircle size={18} className="text-amber-400" />
            <span>No Components Detected Above Threshold ({confidenceThreshold.toFixed(2)})</span>
          </div>
          <p className="text-slate-300 text-xs">
            The model ran successfully but found no components matching the current confidence threshold. 
            Try lowering the detection threshold using the slider below or uploading a closer crop with brighter lighting.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] font-mono text-slate-400">Lower Threshold:</span>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="accent-[#00D1FF] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#00D1FF] font-bold">{confidenceThreshold.toFixed(2)}</span>
            <button
              onClick={handleRunInference}
              className="px-3 py-1 rounded bg-[#00D1FF] text-black font-bold text-xs cursor-pointer ml-auto"
            >
              Re-scan at {confidenceThreshold.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* Derived Real Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#12151A] border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Detected</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {board.metrics.totalComponents}
          </span>
          <span className="text-[10px] text-slate-500">Components in netlist</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151A] border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Passives (R + C)</span>
          <span className="text-xl font-bold font-mono text-[#00D1FF] mt-1 block">
            {board.metrics.resistorsCount + board.metrics.capacitorsCount}
          </span>
          <span className="text-[10px] text-slate-500">
            {board.metrics.resistorsCount} Resistors, {board.metrics.capacitorsCount} Capacitors
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151A] border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">ICs &amp; Diodes</span>
          <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
            {board.metrics.icsCount + board.metrics.diodesCount}
          </span>
          <span className="text-[10px] text-slate-500">
            {board.metrics.icsCount} ICs, {board.metrics.diodesCount} Diodes/LEDs
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12151A] border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Mean Confidence</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {board.metrics.averageConfidence}%
          </span>
          <span className="text-[10px] text-slate-500">From YOLO tensor output</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="h-[620px] w-full">
        {board.customImageBase64 ? (
          /* Real PCB Canvas: Exact Photograph + Real YOLO Overlays */
          <PCBAnalysisCanvas
            imageUrl={board.customImageBase64}
            imageName={board.name}
            detections={detections}
            selectedDetectionId={selectedDetectionId}
            onSelectDetection={handleSelectDetection}
            className="h-full"
          />
        ) : (
          /* Preset Demo Board (Synthetic board only for explicitly labeled offline benchmarks) */
          <PCBViewer
            board={board}
            selectedComponent={board.components.find(c => c.id === selectedDetectionId)}
            onSelectComponent={(comp) => {
              setSelectedDetectionId(comp.id);
              onSelectComponent(comp);
            }}
          />
        )}
      </div>
    </div>
  );
};
