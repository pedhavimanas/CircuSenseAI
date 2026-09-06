import React, { useState, useRef } from 'react';
import { PCBBoard, ProjectRecord } from '../types';
import { validatePCBImage } from '../services/pcbValidator';
import { 
  UploadCloud, 
  Cpu, 
  Scan, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Image as ImageIcon,
  Layers,
  Loader2,
  ShieldAlert
} from 'lucide-react';

interface DashboardProps {
  onAnalyzePCB: (boardToAnalyze?: PCBBoard, customImageBase64?: string) => void;
  onNavigateToProjects: () => void;
  presetBoards: PCBBoard[];
  recentProjects: ProjectRecord[];
  onOpenProject: (project: ProjectRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onAnalyzePCB,
  onNavigateToProjects,
  presetBoards,
  recentProjects,
  onOpenProject
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<PCBBoard>(presetBoards[0]);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPcbVerified, setIsPcbVerified] = useState<boolean>(false);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadFileName(file.name);
    setValidationError(null);
    setIsPcbVerified(false);
    setIsVerifying(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImagePreview(base64);

      try {
        const result = await validatePCBImage(base64, file.name);
        setIsVerifying(false);
        if (!result.isValidPCB) {
          setValidationError(result.message || "Invalid or wrong image. Please upload a clear image of a physical printed circuit board.");
          setIsPcbVerified(false);
        } else {
          setValidationError(null);
          setIsPcbVerified(true);
        }
      } catch (err) {
        setIsVerifying(false);
        setValidationError("Invalid or wrong image. Please upload a clear image of a physical printed circuit board.");
        setIsPcbVerified(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = () => {
    if (uploadedImagePreview) {
      if (isVerifying) return;

      // If validation check determined this is NOT a physical PCB, abort pipeline immediately
      if (!isPcbVerified || validationError) {
        setValidationError("Invalid or wrong image. Please upload a clear image of a physical printed circuit board.");
        return;
      }

      // Create a custom board representation with the verified uploaded image
      const customBoard: PCBBoard = {
        ...selectedPreset,
        id: `custom-${Date.now()}`,
        name: uploadFileName ? `Uploaded: ${uploadFileName.replace(/\.[^/.]+$/, "")}` : 'Custom Uploaded Board',
        boardCode: 'CUSTOM-PCB-SCAN',
        customImageBase64: uploadedImagePreview,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      onAnalyzePCB(customBoard, uploadedImagePreview);
    } else {
      onAnalyzePCB(selectedPreset);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Section */}
      <section className="flex flex-col gap-1 text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Understand Every Circuit
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          AI-powered PCB identification &amp; diagnosis for precision engineering.
        </p>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area (Span 2) */}
        <div className="lg:col-span-2 flex flex-col">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 bg-[#12151A] border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-5 group transition-all relative overflow-hidden ${
              dragActive 
                ? 'border-[#00D1FF] bg-[#00D1FF08] shadow-[0_0_24px_rgba(0,209,255,0.15)]' 
                : 'border-slate-800 hover:border-[#00D1FF50]'
            }`}
          >
            <div className="absolute inset-0 bg-[#00D1FF05] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploadedImagePreview ? (
              <div className="w-full max-w-md relative group/preview rounded-xl overflow-hidden border border-[#00D1FF40] shadow-xl bg-[#0A0C0E]">
                <img 
                  src={uploadedImagePreview} 
                  alt="PCB Upload Preview" 
                  className="w-full h-52 object-contain"
                />
                <div className="absolute inset-0 bg-[#0A0C0E]/70 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#1A1E25] text-slate-200 text-xs font-medium hover:bg-slate-700"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={() => {
                      setUploadedImagePreview(null);
                      setUploadFileName(null);
                      setValidationError(null);
                      setIsPcbVerified(false);
                      setIsVerifying(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/80 text-rose-200 text-xs font-medium hover:bg-rose-800"
                  >
                    Remove
                  </button>
                </div>
                <div className="p-2.5 bg-[#12151A] text-xs font-mono text-[#00D1FF] truncate border-t border-slate-800">
                  {uploadFileName}
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 bg-[#1A1E25] rounded-full flex items-center justify-center text-slate-500 group-hover:text-[#00D1FF] transition-colors cursor-pointer"
              >
                <UploadCloud size={32} className="stroke-[2]" />
              </div>
            )}

            {/* Validation Feedback & Error Alerts */}
            {isVerifying && (
              <div className="w-full max-w-md px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 flex items-center justify-center gap-2.5 text-xs font-medium animate-pulse">
                <Loader2 size={16} className="animate-spin text-sky-400 shrink-0" />
                <span>Verifying physical PCB hardware authenticity...</span>
              </div>
            )}

            {validationError && (
              <div 
                id="upload-pcb-validation-error"
                role="alert"
                className="w-full max-w-lg p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 flex items-start gap-3 shadow-lg shadow-rose-950/30 text-left animate-fadeIn"
              >
                <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                    Image Verification Notice
                  </div>
                  <div className="text-sm font-medium text-rose-100 mt-1 leading-snug">
                    Invalid or wrong image. Please upload a clear image of a physical printed circuit board.
                  </div>
                </div>
              </div>
            )}

            {isPcbVerified && uploadedImagePreview && !isVerifying && !validationError && (
              <div className="w-full max-w-md px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-xs font-medium">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Physical PCB Verified — Ready for Component Detection</span>
              </div>
            )}

            <div className="text-center space-y-1">
              <p className="text-white font-semibold text-lg">
                Upload / Drag &amp; Drop PCB Photograph
              </p>
              <p className="text-slate-500 text-sm">
                Supported formats: JPG, PNG, WEBP (Max 25MB)
              </p>
            </div>

            {/* Hardware benchmarks preset selector */}
            <div className="w-full max-w-xl pt-3 border-t border-slate-800/80">
              <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
                <span>Or evaluate with pre-scanned engineering hardware benchmarks:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                {presetBoards.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setUploadedImagePreview(null);
                      setUploadFileName(null);
                      setValidationError(null);
                      setIsPcbVerified(false);
                      setIsVerifying(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      selectedPreset.id === preset.id && !uploadedImagePreview
                        ? 'border-[#00D1FF] bg-[#00D1FF10] text-white shadow-sm'
                        : 'border-slate-800 bg-[#1A1E25] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 truncate">{preset.name.split('—')[0]}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{preset.boardCode}</div>
                    <div className="text-[10px] text-[#00D1FF] font-mono mt-1">
                      {preset.components.length} parts • {preset.metrics.warningsCount} warnings
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary CTA button */}
            <button
              onClick={handleStartAnalysis}
              disabled={uploadedImagePreview ? (!isPcbVerified || isVerifying) : false}
              className={`mt-2 px-8 py-3 font-bold rounded-lg transition-all flex items-center gap-2 ${
                uploadedImagePreview && (!isPcbVerified || isVerifying)
                  ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] shadow-lg shadow-[#00D1FF20] cursor-pointer'
              }`}
            >
              <Scan size={18} />
              <span>Analyze PCB</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Quick Stats & Info Panel */}
        <div className="flex flex-col gap-6">
          {/* Recent Assets Card */}
          <div className="p-5 bg-[#12151A] border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recent Assets
              </span>
              <span 
                onClick={onNavigateToProjects}
                className="text-[10px] text-[#00D1FF] cursor-pointer hover:underline font-medium"
              >
                View All
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {recentProjects.slice(0, 2).map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj)}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer ${
                    idx === 0 
                      ? 'bg-[#1A1E25] border-slate-700/50' 
                      : 'hover:bg-[#1A1E25] border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-md overflow-hidden shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-slate-900 flex items-center justify-center text-xs font-mono text-cyan-400">
                      PCB
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-medium text-slate-200 truncate">{proj.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {proj.updatedAt.slice(0, 10)} • {proj.status === 'fault_flagged' ? 'Anomalies' : 'Verified'}
                    </p>
                  </div>
                </div>
              ))}

              {recentProjects.length === 0 && (
                <div className="text-xs text-slate-500 py-3 text-center">
                  No previous assets scanned yet.
                </div>
              )}
            </div>
          </div>

          {/* AI Engine Status Card */}
          <div className="p-5 bg-[#12151A] border border-slate-800 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white">AI Engine Status</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Component Detection</span>
                <span className="text-green-500 font-medium">Ready</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[94%]"></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Fault Prediction</span>
                <span className="text-slate-200 font-medium">Active</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-[#00D1FF] h-full w-[78%] shadow-[0_0_8px_#00D1FF]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-800">
        {/* Card 1: Component Detection */}
        <div className="group p-4 bg-[#12151A]/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all">
          <div className="w-8 h-8 mb-3 bg-[#1A1E25] rounded flex items-center justify-center text-slate-400 group-hover:text-[#00D1FF] transition-colors">
            <Cpu size={18} />
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">Component Detection</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Real-time identification of ICs, SMD resistors, and passives.
          </p>
        </div>

        {/* Card 2: AI Analysis */}
        <div className="group p-4 bg-[#12151A]/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all">
          <div className="w-8 h-8 mb-3 bg-[#1A1E25] rounded flex items-center justify-center text-slate-400 group-hover:text-[#00D1FF] transition-colors">
            <Sparkles size={18} />
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">AI Analysis</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Trace mapping and signal flow reconstruction using neural nets.
          </p>
        </div>

        {/* Card 3: Datasheet Intelligence */}
        <div className="group p-4 bg-[#12151A]/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all">
          <div className="w-8 h-8 mb-3 bg-[#1A1E25] rounded flex items-center justify-center text-slate-400 group-hover:text-[#00D1FF] transition-colors">
            <BookOpen size={18} />
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">Datasheet Intelligence</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Instant pinning and electrical specs from global repositories.
          </p>
        </div>

        {/* Card 4: Fault Detection */}
        <div className="group p-4 bg-[#12151A]/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all">
          <div className="w-8 h-8 mb-3 bg-[#1A1E25] rounded flex items-center justify-center text-slate-400 group-hover:text-red-400 transition-colors">
            <AlertTriangle size={18} />
          </div>
          <h3 className="text-white text-sm font-semibold mb-1">Fault Detection</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Thermal anomalies and physical damage scoring via vision AI.
          </p>
        </div>
      </div>
    </div>
  );
};
