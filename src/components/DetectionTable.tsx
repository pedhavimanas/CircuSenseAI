import React, { useState, useMemo } from 'react';
import { PCBDetection } from '../types';
import { Search, Filter, Cpu, ArrowUpDown, ChevronRight, Eye } from 'lucide-react';

interface DetectionTableProps {
  detections: PCBDetection[];
  selectedDetectionId?: string;
  onSelectDetection: (detection: PCBDetection) => void;
  onHoverDetection?: (detection: PCBDetection | null) => void;
  className?: string;
}

export const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  selectedDetectionId,
  onSelectDetection,
  onHoverDetection,
  className = ''
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'class' | 'confidence'>('id');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Derive unique categories and classes from actual detections
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: detections.length };
    detections.forEach(d => {
      counts[d.categoryGroup] = (counts[d.categoryGroup] || 0) + 1;
    });
    return counts;
  }, [detections]);

  // Filter & sort detections
  const filteredDetections = useMemo(() => {
    return detections
      .filter(d => {
        if (selectedCategory !== 'all' && d.categoryGroup !== selectedCategory) {
          return false;
        }
        if (search) {
          const q = search.toLowerCase();
          const matchId = d.id.toLowerCase().includes(q);
          const matchClass = d.className.toLowerCase().includes(q);
          const matchCat = d.categoryGroup.toLowerCase().includes(q);
          const matchOcr = d.ocr?.text?.toLowerCase().includes(q);
          if (!matchId && !matchClass && !matchCat && !matchOcr) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'confidence') {
          diff = b.confidence - a.confidence;
        } else if (sortBy === 'class') {
          diff = a.className.localeCompare(b.className);
        } else {
          diff = a.id.localeCompare(b.id);
        }
        return sortAsc ? diff : -diff;
      });
  }, [detections, selectedCategory, search, sortBy, sortAsc]);

  const toggleSort = (field: 'id' | 'class' | 'confidence') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className={`flex flex-col bg-[#12151A] border border-slate-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Table Controls & Filter Header */}
      <div className="p-4 bg-[#0B0E13] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20">
            <Cpu size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Detection Table</h3>
            <p className="text-[11px] text-slate-400">
              Showing {filteredDetections.length} of {detections.length} components detected by YOLO
            </p>
          </div>
        </div>

        {/* Search Input & Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search class, ID, OCR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0A0C0E] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00D1FF] w-48 font-sans"
            />
          </div>

          <div className="flex items-center bg-[#0A0C0E] rounded-lg border border-slate-800 p-0.5 overflow-x-auto max-w-[400px]">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00D1FF]/15 text-[#00D1FF] font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300 font-sans">
          <thead className="bg-[#0A0D12] text-[11px] font-mono text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
            <tr>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white"
                onClick={() => toggleSort('id')}
              >
                <div className="flex items-center gap-1">
                  <span># ID</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white"
                onClick={() => toggleSort('class')}
              >
                <div className="flex items-center gap-1">
                  <span>Component Class</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-2.5 px-4">Category</th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white"
                onClick={() => toggleSort('confidence')}
              >
                <div className="flex items-center gap-1">
                  <span>Confidence</span>
                  <ArrowUpDown size={11} />
                </div>
              </th>
              <th className="py-2.5 px-4">Box Center (X, Y)</th>
              <th className="py-2.5 px-4">OCR Status</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredDetections.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                  No components match the selected filter.
                </td>
              </tr>
            ) : (
              filteredDetections.map((det) => {
                const isSelected = det.id === selectedDetectionId;
                const confPercent = (det.confidence * 100).toFixed(1);
                const isLowConf = det.confidence < 0.5;

                return (
                  <tr
                    key={det.id}
                    onClick={() => onSelectDetection(det)}
                    onMouseEnter={() => onHoverDetection?.(det)}
                    onMouseLeave={() => onHoverDetection?.(null)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00D1FF]/10 text-white font-medium'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-bold text-[#00D1FF]">
                      {det.id}
                    </td>
                    <td className="py-2.5 px-4 capitalize font-semibold text-slate-200">
                      {det.className}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {det.categoryGroup}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        isLowConf
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {confPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {det.bboxNormalized.x.toFixed(1)}%, {det.bboxNormalized.y.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4">
                      {det.ocr?.status === 'detected' && det.ocr.text ? (
                        <span className="text-emerald-400 font-bold text-[11px]">
                          {det.ocr.text}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Not readable
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDetection(det);
                        }}
                        className="p-1 rounded hover:bg-[#00D1FF]/20 text-slate-400 hover:text-[#00D1FF] transition-colors"
                        title="Highlight Box"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
