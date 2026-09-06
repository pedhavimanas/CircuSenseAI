import React, { useState, useMemo } from 'react';
import { PCBBoard, PCBComponent, ComponentCategory, HealthStatus } from '../types';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { 
  Search, 
  Filter, 
  Cpu, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Package, 
  ArrowUpRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface ComponentsPageProps {
  board: PCBBoard;
  onSelectComponent: (component: PCBComponent) => void;
  onOpenDatasheet: (datasheetId?: string, partName?: string) => void;
  onAskAI: (component: PCBComponent, prompt?: string) => void;
  onNavigateToResults: () => void;
}

export const ComponentsPage: React.FC<ComponentsPageProps> = ({
  board,
  onSelectComponent,
  onOpenDatasheet,
  onAskAI,
  onNavigateToResults
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dynamically compute category counts from actual detection array
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: board.components.length };
    board.components.forEach(c => {
      const key = c.modelClass 
        ? (c.modelClass.charAt(0).toUpperCase() + c.modelClass.slice(1))
        : c.type;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [board.components]);

  const filteredComponents = useMemo(() => {
    return board.components.filter(c => {
      const compClass = (c.modelClass || c.type).toLowerCase();
      const matchesSearch = 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        compClass.includes(searchQuery.toLowerCase()) ||
        c.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.ocrMarking && c.ocrMarking.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        categoryFilter === 'all' || 
        compClass === categoryFilter.toLowerCase() ||
        c.type.toLowerCase() === categoryFilter.toLowerCase();

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [board.components, searchQuery, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12151A] border border-slate-800 rounded-xl px-5 py-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Component Inventory &amp; Specifications
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-[#00D1FF]/10 text-[#00D1FF] font-mono border border-[#00D1FF]/20">
              {board.components.length} Total Detected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Authoritative component catalog indexed from CircuSense YOLO detections
          </p>
        </div>

        <button
          onClick={onNavigateToResults}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
        >
          <span>View on PCB Layout</span>
          <ArrowUpRight size={14} className="text-[#00D1FF]" />
        </button>
      </div>

      {/* Search & Dynamic Category Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, class (capacitor), OCR marking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151A] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00D1FF] font-sans"
          />
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#00D1FF]/15 text-[#00D1FF] border border-[#00D1FF]/30 font-semibold'
                  : 'bg-[#12151A] border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Components */}
      {filteredComponents.length === 0 ? (
        <div className="p-12 text-center bg-[#12151A] border border-slate-800 rounded-xl text-slate-500 space-y-2">
          <p className="text-sm font-semibold text-slate-400">No components match your search criteria.</p>
          <p className="text-xs text-slate-500">Try adjusting the filter query or selecting "All".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents.map((component) => {
            const isLowConf = component.confidence < 50;

            return (
              <div 
                key={component.id}
                className="bg-[#12151A] border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Top line: ID, category badge, and confidence badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {component.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {component.modelClass || component.type}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-slate-300 mt-1 capitalize">
                        {component.name}
                      </h3>
                    </div>

                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                      isLowConf
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {component.confidence}%
                    </span>
                  </div>

                  {/* Specifications & OCR */}
                  <div className="mt-3 p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800/80 space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Normalized Box:</span>
                      <span className="text-slate-300">
                        {component.bbox.x.toFixed(1)}%, {component.bbox.y.toFixed(1)}%
                      </span>
                    </div>
                    {component.ocrMarking && (
                      <div className="flex justify-between text-slate-400">
                        <span>OCR Marking:</span>
                        <span className="text-emerald-400 font-bold">{component.ocrMarking}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Detection Source:</span>
                      <span className="text-slate-300">CircuSense YOLO</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      onSelectComponent(component);
                      onNavigateToResults();
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#181E27] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Highlight on Canvas</span>
                    <ArrowUpRight size={13} className="text-[#00D1FF]" />
                  </button>

                  <button
                    onClick={() => onAskAI(component)}
                    className="p-1.5 rounded-lg bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/20 transition-colors cursor-pointer"
                    title="Ask AI assistant about this component"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
