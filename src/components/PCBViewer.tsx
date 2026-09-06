import React, { useState, useRef } from 'react';
import { PCBBoard, PCBComponent } from '../types';
import { DetectionOverlay } from './DetectionOverlay';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers, 
  AlertTriangle,
  Cpu,
  Zap,
  Info
} from 'lucide-react';

interface PCBViewerProps {
  board: PCBBoard;
  selectedComponent?: PCBComponent;
  onSelectComponent: (component: PCBComponent) => void;
  isScanning?: boolean;
  highlightedBbox?: { x: number; y: number; width: number; height: number };
  showOverlays?: boolean;
  activeFilter?: 'all' | 'ics' | 'passives' | 'faults';
  onFilterChange?: (filter: 'all' | 'ics' | 'passives' | 'faults') => void;
}

export const PCBViewer: React.FC<PCBViewerProps> = ({
  board,
  selectedComponent,
  onSelectComponent,
  isScanning = false,
  highlightedBbox,
  showOverlays = true,
  activeFilter = 'all',
  onFilterChange
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [showSilk, setShowSilk] = useState<boolean>(true);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 60));
  const handleResetZoom = () => setZoom(100);

  // Filter components according to current filter
  const visibleComponents = board.components.filter(c => {
    if (activeFilter === 'faults') return c.status !== 'normal';
    if (activeFilter === 'ics') return c.type === 'IC' || c.type === 'Regulator';
    if (activeFilter === 'passives') return c.type === 'Resistor' || c.type === 'Capacitor' || c.type === 'Inductor';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#12151A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative select-none">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A0C0E] border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-medium text-slate-200">{board.boardCode}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">{board.layerCount}-Layer FR4</span>
            <span className="text-slate-400 hidden md:inline">({board.dimensions})</span>
          </div>

          {/* Layer Filter Pills */}
          {onFilterChange && (
            <div className="hidden lg:flex items-center bg-[#0A0C0E] p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => onFilterChange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeFilter === 'all' ? 'bg-[#00D1FF15] text-[#00D1FF] font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({board.components.length})
              </button>
              <button
                onClick={() => onFilterChange('ics')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeFilter === 'ics' ? 'bg-[#00D1FF15] text-[#00D1FF] font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ICs ({board.metrics.icsCount})
              </button>
              <button
                onClick={() => onFilterChange('passives')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeFilter === 'passives' ? 'bg-[#00D1FF15] text-[#00D1FF] font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passives ({board.metrics.resistorsCount + board.metrics.capacitorsCount})
              </button>
              <button
                onClick={() => onFilterChange('faults')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                  activeFilter === 'faults' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle size={12} className="text-amber-400" />
                <span>Warnings ({board.metrics.warningsCount})</span>
              </button>
            </div>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Silkscreen & Boxes Toggles */}
          <button
            onClick={() => setShowSilk(!showSilk)}
            title="Toggle Silkscreen Markings"
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              showSilk ? 'bg-[#1A1E25] border-slate-700 text-[#00D1FF]' : 'bg-transparent border-slate-800 text-slate-500'
            }`}
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Silk</span>
          </button>

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            title="Toggle Bounding Boxes"
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              showBoxes ? 'bg-[#1A1E25] border-slate-700 text-[#00D1FF]' : 'bg-transparent border-slate-800 text-slate-500'
            }`}
          >
            {showBoxes ? <Eye size={13} /> : <EyeOff size={13} />}
            <span className="hidden sm:inline">Boxes</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center bg-[#0A0C0E] rounded-lg border border-slate-800 px-1 py-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-1.5 font-mono text-[11px] text-slate-300 min-w-[42px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-white transition-colors ml-1 cursor-pointer"
              title="Reset 100%"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main PCB Canvas Stage */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-auto pcb-circuit-pattern flex items-center justify-center p-6 bg-[#0A0C0E]"
      >
        <div
          className="relative transition-transform duration-200 ease-out origin-center shrink-0"
          style={{
            transform: `scale(${zoom / 100})`,
            width: '840px',
            height: '520px',
          }}
        >
          {/* Custom Uploaded Image or High-Fidelity Vector Board */}
          {board.customImageBase64 ? (
            <img 
              src={board.customImageBase64} 
              alt={board.name}
              className="w-full h-full object-cover rounded-md border-2 border-emerald-950 shadow-2xl"
            />
          ) : (
            /* Realistic High-Precision Circuit Board Graphic */
            <div className="w-full h-full rounded-md shadow-2xl relative overflow-hidden bg-[#092c1e] border-2 border-[#104b34]">
              {/* Copper Ground Plane Texture & Stipple */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#22c55e 0.75px, transparent 0.75px)',
                  backgroundSize: '8px 8px'
                }}
              />

              {/* Board Edge Chamfer and Mounting Holes */}
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full border-2 border-[#a3e635]/80 bg-[#061e15] flex items-center justify-center shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-[#030d0a] border border-[#a3e635]/50" />
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full border-2 border-[#a3e635]/80 bg-[#061e15] flex items-center justify-center shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-[#030d0a] border border-[#a3e635]/50" />
              </div>
              <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full border-2 border-[#a3e635]/80 bg-[#061e15] flex items-center justify-center shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-[#030d0a] border border-[#a3e635]/50" />
              </div>
              <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full border-2 border-[#a3e635]/80 bg-[#061e15] flex items-center justify-center shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-[#030d0a] border border-[#a3e635]/50" />
              </div>

              {/* Realistic Copper PCB Traces */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#2ad58b] opacity-50" strokeWidth="2.5" fill="none">
                {/* Input jack J1 to Diode D1 */}
                <path d="M 120 180 L 150 180 L 150 205 L 180 205" />
                {/* D1 cathode to U1 Pin 1 (IN) */}
                <path d="M 230 205 L 290 205 L 320 160 L 370 160" />
                {/* Input Decoupling C1 */}
                <path d="M 290 205 L 290 145" />
                <path d="M 290 145 L 260 145" />
                {/* U1 Pin 3 (OUT) to Output Rail and C14 */}
                <path d="M 480 160 L 550 160 L 570 185 L 610 185" />
                {/* C14 to TB1 output connector */}
                <path d="M 640 185 L 700 185 L 730 140" />
                {/* Output bypass C2 */}
                <path d="M 550 160 L 550 260" />
                {/* LED Ballast R1 to D2 */}
                <path d="M 640 290 L 680 290 L 710 350" />
                {/* Crowbar Q1 traces */}
                <path d="M 470 330 L 490 330 L 490 380 L 440 380" />
                {/* Ground Vias & Tracks */}
                <circle cx="280" cy="180" r="3" fill="#eab308" stroke="#166534" strokeWidth="1" />
                <circle cx="340" cy="240" r="3" fill="#eab308" stroke="#166534" strokeWidth="1" />
                <circle cx="490" cy="230" r="3" fill="#eab308" stroke="#166534" strokeWidth="1" />
                <circle cx="630" cy="230" r="3" fill="#eab308" stroke="#166534" strokeWidth="1" />
                <circle cx="580" cy="380" r="3" fill="#eab308" stroke="#166534" strokeWidth="1" />
              </svg>

              {/* Silkscreen Markings Layer */}
              {showSilk && (
                <div className="absolute inset-0 pointer-events-none text-[11px] font-mono text-slate-200/80">
                  <div className="absolute top-5 left-16 font-bold tracking-wider text-xs text-white/90">
                    CIRCUSENSE LABS • REV 2.1
                  </div>
                  <div className="absolute bottom-5 left-16 text-[10px] text-slate-400">
                    5V / 1.5A REGULATED PSU • TOP COPPER
                  </div>

                  {/* Silkscreen Component Outlines */}
                  <div className="absolute top-[18%] left-[6%] border border-white/60 p-1 text-[9px]">J1 DC_IN</div>
                  <div className="absolute top-[34%] left-[12%] border border-white/60 px-2 py-0.5 text-[9px]">D1 [|&gt;]</div>
                  <div className="absolute top-[22%] left-[28%] border border-dashed border-white/60 px-1 text-[9px]">C1</div>
                  <div className="absolute top-[22%] left-[38%] border border-white/70 px-4 py-2 text-[10px] font-bold">
                    U1 [LM7805]
                    <div className="text-[8px] font-normal text-slate-300">1:IN 2:GND 3:OUT</div>
                  </div>
                  <div className="absolute top-[26%] left-[64%] border border-white/70 rounded-full w-14 h-14 flex items-center justify-center text-[10px] font-bold">
                    C14 (+)
                  </div>
                  <div className="absolute top-[46%] left-[62%] border border-dashed border-white/60 px-1 text-[9px]">C2</div>
                  <div className="absolute top-[52%] left-[74%] border border-white/60 px-2 py-0.5 text-[9px]">R1 [1K]</div>
                  <div className="absolute top-[64%] left-[80%] border border-white/60 rounded-full w-8 h-8 flex items-center justify-center text-[9px]">
                    D2
                  </div>
                  <div className="absolute top-[16%] left-[82%] border border-white/70 px-2 py-3 text-[10px] font-bold">
                    TB1 [+5V GND]
                  </div>
                  <div className="absolute top-[56%] left-[50%] border border-white/60 px-3 py-2 text-[10px]">
                    Q1 [IRF540N]
                  </div>
                </div>
              )}

              {/* Physical Component Visual Layer */}
              <div className="absolute inset-0 pointer-events-none">
                {/* U1: Realistic TO-220 Voltage Regulator */}
                <div 
                  className="absolute"
                  style={{ left: '38%', top: '22%', width: '22%', height: '26%' }}
                >
                  {/* Metal Heatsink Tab */}
                  <div className="w-full h-[28%] bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-xs border border-slate-500 shadow-md flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-400 shadow-inner" />
                  </div>
                  {/* Black Molded Epoxy Body */}
                  <div className="w-full h-[62%] bg-gradient-to-b from-[#1c1d22] via-[#24262c] to-[#16171b] border-x border-b border-slate-700 rounded-b-xs p-2 shadow-xl flex flex-col justify-between">
                    <div className="text-[10px] font-mono font-bold text-slate-300 tracking-tight flex items-center justify-between">
                      <span>ST LM7805</span>
                      <span className="text-[8px] text-slate-500">CZ47</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-400">
                      V_OUT: +5.0V • 1.5A
                    </div>
                  </div>
                  {/* 3 Solder Pins */}
                  <div className="w-full flex justify-around px-4 -mt-0.5">
                    <div className="w-2 h-4 bg-gradient-to-b from-slate-400 to-amber-200/80 rounded-b-xs shadow" />
                    <div className="w-2 h-4 bg-gradient-to-b from-slate-400 to-amber-200/80 rounded-b-xs shadow" />
                    <div className="w-2 h-4 bg-gradient-to-b from-slate-400 to-amber-200/80 rounded-b-xs shadow" />
                  </div>
                </div>

                {/* C14: Realistic Radial Electrolytic Capacitor with Anomaly */}
                <div 
                  className="absolute flex flex-col items-center justify-center"
                  style={{ left: '64%', top: '26%', width: '14%', height: '18%' }}
                >
                  {/* Aluminum Can Top with Pressure Relief Stamped Cross and Slight Bulge Accent */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 border-2 border-slate-600 shadow-xl relative flex items-center justify-center">
                    {/* Dark polarity negative stripe */}
                    <div className="absolute -left-1 top-2 bottom-2 w-3 bg-slate-800 rounded-l-full flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">-</span>
                    </div>
                    {/* Stamped Vent Cross (+) */}
                    <div className="w-8 h-8 relative flex items-center justify-center">
                      <div className="w-full h-0.5 bg-slate-500/70" />
                      <div className="h-full w-0.5 bg-slate-500/70 absolute" />
                      {/* Subtle Visual Anomaly: Raised dome patina highlight */}
                      <div className="absolute w-5 h-5 rounded-full bg-amber-500/25 blur-xs animate-pulse-subtle" title="Visual Anomaly: Dome Vent Distortion" />
                    </div>
                    <div className="absolute bottom-1 right-2 text-[7px] font-mono text-slate-600 font-bold">
                      100µF 25V
                    </div>
                  </div>
                </div>

                {/* D1: 1N4007 Diode */}
                <div 
                  className="absolute flex items-center"
                  style={{ left: '12%', top: '34%', width: '16%', height: '10%' }}
                >
                  {/* Lead 1 */}
                  <div className="w-4 h-1 bg-slate-400" />
                  {/* Black cylinder body with silver cathode band */}
                  <div className="h-6 flex-1 bg-slate-950 border border-slate-700 rounded-xs flex items-center shadow-md overflow-hidden">
                    <div className="w-2.5 h-full bg-slate-300 border-r border-slate-400" title="Cathode" />
                    <span className="text-[7px] font-mono text-slate-400 ml-1.5 font-bold">1N4007</span>
                  </div>
                  {/* Lead 2 */}
                  <div className="w-4 h-1 bg-slate-400" />
                </div>

                {/* Q1: IRF540N MOSFET */}
                <div 
                  className="absolute"
                  style={{ left: '50%', top: '56%', width: '18%', height: '24%' }}
                >
                  <div className="w-full h-[30%] bg-slate-300 rounded-t-xs border border-slate-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-500" />
                  </div>
                  <div className="w-full h-[60%] bg-[#1a1c23] border border-slate-700 rounded-b-xs p-1.5 text-[9px] font-mono text-slate-300">
                    <div className="font-bold text-slate-200">IRF540N</div>
                    <div className="text-[7px] text-slate-400">100V 33A N-CH</div>
                  </div>
                </div>

                {/* R1: Axial Resistor */}
                <div 
                  className="absolute flex items-center"
                  style={{ left: '74%', top: '52%', width: '14%', height: '8%' }}
                >
                  <div className="w-3 h-0.5 bg-slate-400" />
                  <div className="h-4 flex-1 bg-[#d4a373] rounded-xs border border-[#b07d62] flex items-center justify-around px-1 shadow-xs">
                    <div className="w-1 h-full bg-[#582f0e]" title="Brown: 1" />
                    <div className="w-1 h-full bg-[#111111]" title="Black: 0" />
                    <div className="w-1 h-full bg-[#e63946]" title="Red: x100" />
                    <div className="w-1 h-full bg-[#ffd166]" title="Gold: 5%" />
                  </div>
                  <div className="w-3 h-0.5 bg-slate-400" />
                </div>

                {/* J1: DC Jack */}
                <div 
                  className="absolute bg-slate-900 border-2 border-slate-700 rounded-xs shadow-lg flex items-center justify-center"
                  style={{ left: '6%', top: '18%', width: '14%', height: '18%' }}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>

                {/* TB1: Screw Terminal */}
                <div 
                  className="absolute bg-emerald-800 border-2 border-emerald-600 rounded-xs shadow-lg flex flex-col justify-around p-1"
                  style={{ left: '82%', top: '16%', width: '14%', height: '26%' }}
                >
                  <div className="w-full h-5 rounded-xs bg-emerald-950 border border-emerald-700 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-amber-300 border border-amber-600" />
                  </div>
                  <div className="w-full h-5 rounded-xs bg-emerald-950 border border-emerald-700 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-amber-300 border border-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Detection Overlays */}
          {showOverlays && (
            <div className="absolute inset-0 pointer-events-auto">
              {visibleComponents.map((component) => (
                <DetectionOverlay
                  key={component.id}
                  component={component}
                  isSelected={selectedComponent?.id === component.id}
                  onSelect={onSelectComponent}
                  showLabels={showBoxes}
                />
              ))}
            </div>
          )}

          {/* Scanning Line Animation (Analyzer Mode) */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md z-40">
              {/* Laser line moving vertically */}
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-scanline" />
              <div className="absolute inset-0 bg-cyan-500/5 backdrop-contrast-125" />
            </div>
          )}

          {/* Active Target Box Highlight during scanning */}
          {highlightedBbox && isScanning && (
            <div
              className="absolute border-2 border-cyan-400 bg-cyan-400/20 rounded-xs transition-all duration-300 z-30 pointer-events-none"
              style={{
                left: `${highlightedBbox.x}%`,
                top: `${highlightedBbox.y}%`,
                width: `${highlightedBbox.width}%`,
                height: `${highlightedBbox.height}%`,
              }}
            >
              <span className="absolute -top-5 left-0 bg-cyan-500 text-slate-950 font-mono text-[9px] font-bold px-1 rounded">
                SCANNING
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status & Calibration Bar */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Normal: {board.components.filter(c => c.status === 'normal').length}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Needs Inspection: {board.components.filter(c => c.status === 'inspection').length}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Possible Issue: {board.components.filter(c => c.status === 'issue').length}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span className="hidden sm:inline">Optical Resolution: 2400 DPI</span>
          <span>•</span>
          <span>{visibleComponents.length} displayed</span>
        </div>
      </div>
    </div>
  );
};
