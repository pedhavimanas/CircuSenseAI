import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PCBDetection, BoundingBox } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Eye, 
  EyeOff, 
  Layers, 
  Tag, 
  Percent, 
  Filter,
  Move
} from 'lucide-react';

interface PCBAnalysisCanvasProps {
  imageUrl: string;
  imageName?: string;
  detections: PCBDetection[];
  selectedDetectionId?: string;
  onSelectDetection: (detection: PCBDetection) => void;
  activeFilter?: string; // 'all' | class name | category
  showLowConfidenceOnly?: boolean;
  highlightedBbox?: BoundingBox;
  className?: string;
}

// Color palette tailored for PCB inspection engineering
const CLASS_COLORS: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  capacitor: { border: '#00D1FF', bg: 'rgba(0, 209, 255, 0.12)', text: '#00D1FF', badge: 'bg-[#00D1FF]/20 text-[#00D1FF]' },
  resistor: { border: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38BDF8', badge: 'bg-sky-500/20 text-sky-400' },
  ic: { border: '#A855F7', bg: 'rgba(168, 85, 247, 0.14)', text: '#C084FC', badge: 'bg-purple-500/20 text-purple-300' },
  diode: { border: '#34D399', bg: 'rgba(52, 211, 153, 0.12)', text: '#34D399', badge: 'bg-emerald-500/20 text-emerald-300' },
  led: { border: '#4ADE80', bg: 'rgba(74, 222, 128, 0.14)', text: '#4ADE80', badge: 'bg-green-500/20 text-green-300' },
  transistor: { border: '#F472B6', bg: 'rgba(244, 114, 182, 0.12)', text: '#F472B6', badge: 'bg-pink-500/20 text-pink-300' },
  connector: { border: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', text: '#FBBF24', badge: 'bg-amber-500/20 text-amber-300' },
  inductor: { border: '#FB923C', bg: 'rgba(251, 146, 60, 0.12)', text: '#FB923C', badge: 'bg-orange-500/20 text-orange-300' },
  switch: { border: '#818CF8', bg: 'rgba(129, 140, 248, 0.12)', text: '#818CF8', badge: 'bg-indigo-500/20 text-indigo-300' },
  relay: { border: '#E879F9', bg: 'rgba(232, 121, 249, 0.12)', text: '#E879F9', badge: 'bg-fuchsia-500/20 text-fuchsia-300' },
  clock: { border: '#2DD4BF', bg: 'rgba(45, 212, 191, 0.12)', text: '#2DD4BF', badge: 'bg-teal-500/20 text-teal-300' },
  default: { border: '#94A3B8', bg: 'rgba(148, 163, 184, 0.10)', text: '#E2E8F0', badge: 'bg-slate-700 text-slate-200' }
};

export const PCBAnalysisCanvas: React.FC<PCBAnalysisCanvasProps> = ({
  imageUrl,
  imageName = 'PCB Image',
  detections,
  selectedDetectionId,
  onSelectDetection,
  activeFilter = 'all',
  showLowConfidenceOnly = false,
  highlightedBbox,
  className = ''
}) => {
  // Transform & View State
  const [zoom, setZoom] = useState<number>(100);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Visibility
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showConfidence, setShowConfidence] = useState<boolean>(true);

  // Hovered box
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 40));
  const handleReset = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -15 : 15;
      setZoom(prev => Math.min(Math.max(prev + delta, 40), 400));
    }
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on empty area or with middle click / space key
    if (e.button === 0 && (e.target as HTMLElement).tagName !== 'BUTTON') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Filter detections
  const visibleDetections = useMemo(() => {
    return detections.filter(d => {
      if (showLowConfidenceOnly && d.confidence >= 0.5) return false;
      if (activeFilter && activeFilter !== 'all') {
        const matchClass = d.className.toLowerCase() === activeFilter.toLowerCase();
        const matchCat = d.categoryGroup.toLowerCase() === activeFilter.toLowerCase();
        if (!matchClass && !matchCat) return false;
      }
      return true;
    });
  }, [detections, activeFilter, showLowConfidenceOnly]);

  const getColor = (className: string) => {
    return CLASS_COLORS[className.toLowerCase()] || CLASS_COLORS.default;
  };

  return (
    <div className={`flex flex-col h-full bg-[#0E1217] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative select-none ${className}`}>
      {/* Engineering Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#080B0E] border-b border-slate-800 text-xs text-slate-300 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-slate-200">{imageName}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
              {visibleDetections.length} of {detections.length} Boxes
            </span>
          </div>
        </div>

        {/* Toolbar Toggles & Zoom */}
        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <div className="flex items-center bg-[#13171E] rounded-lg border border-slate-800 p-0.5">
            <button
              onClick={() => setShowBoxes(!showBoxes)}
              title="Toggle Bounding Boxes"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showBoxes ? 'bg-[#00D1FF]/15 text-[#00D1FF] font-medium' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {showBoxes ? <Eye size={13} /> : <EyeOff size={13} />}
              <span className="hidden md:inline">Boxes</span>
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              title="Toggle Class Labels"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showLabels ? 'bg-[#00D1FF]/15 text-[#00D1FF] font-medium' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Tag size={13} />
              <span className="hidden md:inline">Labels</span>
            </button>

            <button
              onClick={() => setShowConfidence(!showConfidence)}
              title="Toggle Confidence Scores"
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                showConfidence ? 'bg-[#00D1FF]/15 text-[#00D1FF] font-medium' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Percent size={13} />
              <span className="hidden md:inline">Conf</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Zoom controls */}
          <div className="flex items-center bg-[#13171E] rounded-lg border border-slate-800 px-1 py-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-200 min-w-[38px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-white transition-colors ml-0.5 cursor-pointer"
              title="Reset Zoom & Pan"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 relative overflow-hidden bg-[#06080B] flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
      >
        {/* Transform container applying pan and scale atomically to image + overlay */}
        <div
          className="relative inline-block max-w-full max-h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Base Layer: Actual Uploaded PCB Image */}
          <img
            src={imageUrl}
            alt={imageName}
            className="block max-w-full max-h-[68vh] w-auto h-auto rounded border border-slate-800 shadow-2xl pointer-events-none"
            draggable={false}
          />

          {/* Bounding Box Overlay Layer (Matches Image Geometry Exactly with inset: 0) */}
          {showBoxes && (
            <div className="absolute inset-0 pointer-events-none">
              {visibleDetections.map((det) => {
                const isSelected = det.id === selectedDetectionId;
                const isHovered = det.id === hoveredId;
                const isLowConf = det.confidence < 0.5;
                const color = isLowConf 
                  ? { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', badge: 'bg-amber-500/20 text-amber-300' }
                  : getColor(det.className);

                const norm = det.bboxNormalized;
                const confPercent = (det.confidence * 100).toFixed(1);

                return (
                  <div
                    key={det.id}
                    id={`bbox-${det.id}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${det.className} detection, confidence ${confPercent}%`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDetection(det);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onSelectDetection(det);
                      }
                    }}
                    onMouseEnter={() => setHoveredId(det.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      left: `${norm.x}%`,
                      top: `${norm.y}%`,
                      width: `${norm.width}%`,
                      height: `${norm.height}%`,
                      borderColor: isSelected ? '#00D1FF' : isHovered ? '#FFFFFF' : color.border,
                      backgroundColor: isSelected ? 'rgba(0, 209, 255, 0.24)' : isHovered ? color.bg : 'transparent',
                      borderWidth: isSelected ? '2.5px' : isHovered ? '2px' : '1.5px',
                    }}
                    className={`absolute pointer-events-auto cursor-pointer transition-all duration-150 rounded-[2px] ${
                      isSelected ? 'ring-2 ring-[#00D1FF] ring-offset-1 ring-offset-black z-30 shadow-lg shadow-[#00D1FF]/30' : 'z-10'
                    }`}
                  >
                    {/* Corner Accent Anchor (Selected State) */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#00D1FF] border border-black" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00D1FF] border border-black" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#00D1FF] border border-black" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#00D1FF] border border-black" />
                      </>
                    )}

                    {/* Class & Confidence Badge */}
                    {(showLabels || isSelected || isHovered) && (
                      <div 
                        className={`absolute left-0 bottom-full mb-0.5 whitespace-nowrap text-[10px] font-mono font-medium px-1.5 py-0.5 rounded shadow-md pointer-events-none flex items-center gap-1.5 z-40 transition-all ${
                          isSelected
                            ? 'bg-[#00D1FF] text-[#0A0C0E] font-bold ring-1 ring-black'
                            : 'bg-[#0A0E14]/90 backdrop-blur-sm border border-slate-700 text-white'
                        }`}
                      >
                        <span className="capitalize">{det.className}</span>
                        {showConfidence && (
                          <span className={isSelected ? 'text-black font-semibold' : 'text-slate-300'}>
                            {confPercent}%
                          </span>
                        )}
                        {det.ocr?.status === 'detected' && det.ocr.text && (
                          <span className="text-[9px] bg-slate-800 text-sky-300 px-1 rounded border border-slate-600">
                            OCR: {det.ocr.text}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Highlighted Bounding Box from External Trigger (e.g. table hover) */}
              {highlightedBbox && (
                <div
                  style={{
                    left: `${highlightedBbox.x}%`,
                    top: `${highlightedBbox.y}%`,
                    width: `${highlightedBbox.width}%`,
                    height: `${highlightedBbox.height}%`,
                  }}
                  className="absolute pointer-events-none border-2 border-dashed border-amber-400 bg-amber-400/10 z-25 animate-pulse"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="px-4 py-1.5 bg-[#080B0E] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Detector:</span>
          <span className="text-[#00D1FF] font-semibold">CircuSense YOLO (best.pt)</span>
          <span className="text-slate-600">•</span>
          <span>Classes: 22</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Hold Ctrl + Scroll to Zoom</span>
          <span className="text-slate-600">•</span>
          <span>Click & Drag to Pan</span>
        </div>
      </div>
    </div>
  );
};
