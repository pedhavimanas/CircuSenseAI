import React, { useState, useRef } from 'react';
import { PCBBoard } from '../types';
import { DetectionOptions } from '../services/detectionApi';
import { 
  UploadCloud, 
  X, 
  Scan, 
  Image as ImageIcon, 
  Sliders, 
  SlidersHorizontal,
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadAndAnalyze: (fileOrBoard: File | PCBBoard, options?: DetectionOptions) => void;
  presetBoards: PCBBoard[];
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadAndAnalyze,
  presetBoards
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'upload' | 'preset'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.25);
  const [runOcr, setRunOcr] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<PCBBoard>(presetBoards[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setValidationError(null);
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
      setValidationError('Unsupported format. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setValidationError('Image exceeds 30MB limit.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      // Extract image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = () => {
    if (activeMode === 'upload' && selectedFile) {
      onUploadAndAnalyze(selectedFile, {
        confidence_threshold: confidenceThreshold,
        iou_threshold: 0.45,
        image_size: 640,
        run_ocr: runOcr
      });
      onClose();
    } else if (activeMode === 'preset') {
      onUploadAndAnalyze(selectedPreset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#12151A] border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0E13]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20">
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Inspect PCB with CircuSense YOLO
              </h2>
              <p className="text-xs text-slate-400">
                Authoritative 22-class hardware detection using <span className="text-[#00D1FF] font-mono font-medium">models/best.pt</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-[#080B0E] p-1 gap-1">
          <button
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-[#181E27] text-[#00D1FF] border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud size={15} />
            <span>Upload Real PCB Photo</span>
          </button>

          <button
            onClick={() => setActiveMode('preset')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeMode === 'preset'
                ? 'bg-[#181E27] text-[#00D1FF] border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={15} />
            <span>Pre-calibrated Demo Boards</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeMode === 'upload' ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files?.[0] && processSelectedFile(e.target.files[0])}
                className="hidden"
              />

              {/* Drag & Drop Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#00D1FF] bg-[#00D1FF]/10'
                    : 'border-slate-700 hover:border-slate-500 bg-[#0A0C0E]'
                }`}
              >
                {imagePreview ? (
                  <div className="space-y-2.5">
                    <img
                      src={imagePreview}
                      alt="PCB Preview"
                      className="max-h-44 mx-auto rounded-lg object-contain border border-slate-700 shadow-lg"
                    />
                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                      <span className="text-slate-200 font-medium truncate max-w-[240px]">
                        {selectedFile?.name}
                      </span>
                      {imageDimensions && (
                        <span className="text-[#00D1FF] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                          {imageDimensions.width} × {imageDimensions.height} px
                        </span>
                      )}
                      {selectedFile && (
                        <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">Click or drag new image to change photo</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] mx-auto flex items-center justify-center border border-[#00D1FF]/20">
                      <ImageIcon size={24} />
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      Select or drag &amp; drop high-resolution PCB photograph
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Supports JPG, PNG, WEBP (Up to 30MB)
                    </div>
                  </div>
                )}
              </div>

              {validationError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle size={15} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Inference Tuning Options */}
              <div className="p-4 rounded-xl bg-[#080B0E] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <SlidersHorizontal size={14} className="text-[#00D1FF]" />
                    <span>YOLO Confidence Threshold</span>
                  </span>
                  <span className="font-mono text-[#00D1FF] font-bold bg-[#00D1FF]/10 px-2 py-0.5 rounded border border-[#00D1FF]/20">
                    {confidenceThreshold.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  className="w-full accent-[#00D1FF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.10 (High Sensitivity)</span>
                  <span>0.25 (Default)</span>
                  <span>0.90 (High Precision)</span>
                </div>
              </div>

              {/* Fast Model Guarantee Notice */}
              <div className="p-3 rounded-xl bg-[#080B0E] border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Backend active • Ultralytics YOLO initialized with 22 trained classes</span>
              </div>
            </>
          ) : (
            /* Demo Presets Mode */
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <strong>Demo Mode:</strong> Pre-calibrated boards represent offline benchmark reference data. No model inference is executed for presets.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {presetBoards.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedPreset.id === preset.id
                        ? 'border-[#00D1FF] bg-[#00D1FF]/15 text-white shadow-md'
                        : 'border-slate-800 bg-[#0A0C0E] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 truncate">{preset.name.split('—')[0]}</div>
                    <div className="text-[11px] font-mono text-[#00D1FF] mt-1">{preset.components.length} components</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{preset.boardCode}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0B0E13] flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            {activeMode === 'upload' ? 'Authoritative YOLO Detection' : 'Offline Demonstration'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#181E27] hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={activeMode === 'upload' && !selectedFile}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold text-xs transition-all shadow-md cursor-pointer ${
                activeMode === 'upload' && !selectedFile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] shadow-[#00D1FF]/20'
              }`}
            >
              <Scan size={14} />
              <span>{activeMode === 'upload' ? 'Run YOLO Analysis' : 'Load Demo Board'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
