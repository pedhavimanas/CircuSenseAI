import React, { useState, useMemo } from 'react';
import { PCBBoard, PCBComponent, PCBDetection } from '../types';
import { PCBAnalysisCanvas } from '../components/PCBAnalysisCanvas';
import { ComponentInspector } from '../components/ComponentInspector';
import { DetectionTable } from '../components/DetectionTable';
import { PCBViewer } from '../components/PCBViewer';
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Tag, 
  Percent, 
  Layers, 
  ArrowUpRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface ResultsProps {
  board: PCBBoard;
  selectedComponent: PCBComponent;
  onSelectComponent: (component: PCBComponent) => void;
  onOpenDatasheet: (datasheetId?: string, partName?: string) => void;
  onAskAI: (component: PCBComponent, prompt?: string) => void;
  onCheckIssues: (component: PCBComponent) => void;
  onSaveProject: () => void;
  onNavigateToFaults: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  board,
  selectedComponent,
  onSelectComponent,
  onOpenDatasheet,
  onAskAI,
  onCheckIssues,
  onSaveProject,
  onNavigateToFaults
}) => {
  // Map board components to PCBDetections for the canvas and table
  const detections: PCBDetection[] = useMemo(() => {
    if (board.analysis?.detections && board.analysis.detections.length > 0) {
      return board.analysis.detections;
    }
    return board.components.map((c, i) => ({
      id: c.id,
      classId: c.modelClassId ?? i,
      className: c.modelClass || c.type.toLowerCase(),
      categoryGroup: (c.package as any) || 'Other',
      confidence: c.confidence / 100,
      bbox: c.rawBbox || { x1: 0, y1: 0, x2: 100, y2: 100 },
      bboxNormalized: c.bbox,
      ocr: { status: c.ocrMarking ? 'detected' : 'not_attempted', text: c.ocrMarking },
      healthStatus: c.status
    }));
  }, [board]);

  const [highlightedBbox, setHighlightedBbox] = useState<any>(undefined);

  // Selected detection matching selectedComponent
  const selectedDetection = useMemo(() => {
    return detections.find(d => d.id === selectedComponent?.id) || detections[0] || null;
  }, [detections, selectedComponent]);

  const handleSelectDetection = (det: PCBDetection) => {
    const comp = board.components.find(c => c.id === det.id);
    if (comp) {
      onSelectComponent(comp);
    } else {
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

  // Distinct class count
  const distinctClassesCount = useMemo(() => {
    const set = new Set(detections.map(d => d.className.toLowerCase()));
    return set.size;
  }, [detections]);

  // OCR readings count
  const ocrCount = useMemo(() => {
    return detections.filter(d => d.ocr?.status === 'detected' && d.ocr.text).length;
  }, [detections]);

  // Low confidence count (<50%)
  const lowConfCount = useMemo(() => {
    return detections.filter(d => d.confidence < 0.5).length;
  }, [detections]);

  const isLiveYolo = Boolean(board.analysis && board.scanSource === 'circusense_yolo');
  const isDemo = Boolean(board.isDemoData || board.sourceType === 'demo' || board.presetType !== 'custom_uploaded');

  return (
    <div className="space-y-4 pb-10">
      {/* Top Header Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12151A] border border-slate-800 rounded-xl px-5 py-3.5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              PCB Inspection Results
            </h1>
            {isLiveYolo ? (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={11} />
                <span>LIVE MODEL: CircuSense YOLO (best.pt)</span>
              </span>
            ) : isDemo ? (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <AlertTriangle size={11} />
                <span>Demo Benchmark (Offline)</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center gap-1">
                <AlertTriangle size={11} />
                <span>Offline / Unverified Scan</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Target: <span className="text-slate-200 font-mono font-medium">{board.name}</span>
            {board.analysis && (
              <span className="text-slate-500 font-mono ml-2">
                • {board.analysis.sourceImage.width}×{board.analysis.sourceImage.height}px
                {board.analysis.timing && ` • ${board.analysis.timing.inferenceMs.toFixed(0)}ms inference`}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSaveProject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-lg shadow-[#00D1FF]/20 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {/* Honest 4 Top Metric Cards (Calculated directly from detections array) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#12151A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Components Detected</span>
            <div className="p-1.5 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF]">
              <Cpu size={15} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {detections.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Authoritative YOLO model detections
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Component Classes</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Tag size={15} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-2">
            {distinctClassesCount} <span className="text-xs text-slate-500 font-normal">/ 22 trained</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Distinct hardware categories found
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Confidence</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Percent size={15} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-2">
            {board.metrics.averageConfidence}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Derived from raw tensor confidences
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Quality Indicators</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Layers size={15} />
            </div>
          </div>
          <div className="text-lg font-bold font-mono text-slate-200 mt-2 flex items-center gap-3">
            <span>{ocrCount} <span className="text-xs text-slate-400 font-normal">OCR</span></span>
            <span className="text-slate-600">|</span>
            <span className={lowConfCount > 0 ? 'text-amber-400' : 'text-slate-400'}>
              {lowConfCount} <span className="text-xs text-slate-400 font-normal">Low Conf</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Silkscreen readability &amp; confidence flags
          </p>
        </div>
      </div>

      {/* Main Workspace Split: Canvas (Left) + Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
        <div className="lg:col-span-8 h-[600px]">
          {board.customImageBase64 ? (
            <PCBAnalysisCanvas
              imageUrl={board.customImageBase64}
              imageName={board.name}
              detections={detections}
              selectedDetectionId={selectedDetection?.id}
              onSelectDetection={handleSelectDetection}
              highlightedBbox={highlightedBbox}
              className="h-full"
            />
          ) : (
            <PCBViewer
              board={board}
              selectedComponent={selectedComponent}
              onSelectComponent={onSelectComponent}
            />
          )}
        </div>

        <div className="lg:col-span-4 h-[600px]">
          <ComponentInspector
            detection={selectedDetection}
            onAskAI={(det) => {
              const comp = board.components.find(c => c.id === det.id) || selectedComponent;
              onAskAI(comp);
            }}
            onFlagIssue={(det) => {
              const comp = board.components.find(c => c.id === det.id) || selectedComponent;
              onCheckIssues(comp);
            }}
            className="h-full"
          />
        </div>
      </div>

      {/* Detection Table with Synchronized Row & Box Selection */}
      <div className="pt-2">
        <DetectionTable
          detections={detections}
          selectedDetectionId={selectedDetection?.id}
          onSelectDetection={handleSelectDetection}
          onHoverDetection={(det) => setHighlightedBbox(det ? det.bboxNormalized : undefined)}
        />
      </div>
    </div>
  );
};
