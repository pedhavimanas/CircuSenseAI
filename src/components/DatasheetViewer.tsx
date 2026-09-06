import React, { useState } from 'react';
import { Datasheet } from '../types';
import { 
  FileText, 
  ExternalLink, 
  Printer, 
  Download, 
  Cpu, 
  Layers, 
  ListOrdered, 
  Zap, 
  CheckCircle, 
  BookOpen, 
  Search,
  ChevronDown
} from 'lucide-react';

interface DatasheetViewerProps {
  datasheets: Datasheet[];
  initialDatasheetId?: string;
  onClose?: () => void;
  className?: string;
}

export const DatasheetViewer: React.FC<DatasheetViewerProps> = ({
  datasheets,
  initialDatasheetId,
  onClose,
  className = ''
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialDatasheetId || (datasheets.length > 0 ? datasheets[0].id : '')
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeDatasheet = datasheets.find(d => d.id === selectedId) || datasheets[0];

  const filteredDatasheets = datasheets.filter(d => 
    d.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-[#12151A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-[#0A0C0E] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                Integrated Technical Datasheet Intelligence
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#1A1E25] text-slate-300 font-mono border border-slate-700">
                Inside-App Viewer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verified electrical tolerances, pinouts, and typical application schematics
            </p>
          </div>
        </div>

        {/* Datasheet Selector Dropdown & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeDatasheet?.id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[#1A1E25] border border-slate-700 text-xs text-slate-200 font-mono font-medium focus:outline-none focus:border-[#00D1FF]"
            >
              {datasheets.map(ds => (
                <option key={ds.id} value={ds.id}>
                  {ds.partNumber} — {ds.title.slice(0, 24)}...
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          <button
            onClick={() => window.print()}
            title="Print Specification"
            className="p-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <Printer size={15} />
          </button>
        </div>
      </div>

      {activeDatasheet ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Document Title Section */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[#00D1FF] uppercase tracking-widest">
                {activeDatasheet.manufacturer}
              </span>
              <div className="flex items-center gap-2">
                {activeDatasheet.packageTypes.map((pkg, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#1A1E25] border border-slate-700 font-mono text-slate-300">
                    {pkg}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {activeDatasheet.partNumber}
            </h1>
            <p className="text-sm text-slate-300 font-medium mt-0.5">
              {activeDatasheet.title}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-4xl">
              {activeDatasheet.summary}
            </p>
          </div>

          {/* Pin Configuration Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ListOrdered size={15} className="text-[#00D1FF]" />
              <span>Pin Configuration & Functions</span>
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0A0C0E]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#12151A] border-b border-slate-800 text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2 px-3 w-16">PIN #</th>
                    <th className="py-2 px-3 w-32">PIN NAME</th>
                    <th className="py-2 px-3">FUNCTION / SIGNAL DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeDatasheet.pinout.map(pin => (
                    <tr key={pin.pin} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 text-[#00D1FF] font-bold">{pin.pin}</td>
                      <td className="py-2 px-3 text-slate-200 font-semibold">{pin.name}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans">{pin.function}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Electrical Characteristics Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={15} className="text-amber-400" />
              <span>Electrical Characteristics & Limits</span>
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0A0C0E]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#12151A] border-b border-slate-800 text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2 px-3">PARAMETER</th>
                    <th className="py-2 px-2 w-16">SYMBOL</th>
                    <th className="py-2 px-2 w-16 text-right">MIN</th>
                    <th className="py-2 px-2 w-16 text-right">TYP</th>
                    <th className="py-2 px-2 w-16 text-right">MAX</th>
                    <th className="py-2 px-2 w-14">UNIT</th>
                    <th className="py-2 px-3">TEST CONDITIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeDatasheet.electricalSpecs.map((spec, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-sans text-slate-200">{spec.parameter}</td>
                      <td className="py-2 px-2 text-[#00D1FF]">{spec.symbol}</td>
                      <td className="py-2 px-2 text-right text-slate-400">{spec.min || '—'}</td>
                      <td className="py-2 px-2 text-right text-slate-200 font-bold">{spec.typ || '—'}</td>
                      <td className="py-2 px-2 text-right text-slate-400">{spec.max || '—'}</td>
                      <td className="py-2 px-2 text-amber-300">{spec.unit}</td>
                      <td className="py-2 px-3 text-slate-400 text-[11px] font-sans">{spec.condition || 'Tamb = 25°C'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Typical Circuit Implementation Note */}
          <div className="p-4 rounded-xl bg-[#0A0C0E] border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={15} className="text-[#00D1FF]" />
              <span>Recommended PCB Layout & Decoupling Guide</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeDatasheet.typicalCircuitDescription}
            </p>
          </div>

          {/* Target Applications */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Standard Applications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeDatasheet.applications.map((app, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#0A0C0E] border border-slate-800 text-slate-300 font-sans text-xs">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          No datasheet selected.
        </div>
      )}
    </div>
  );
};
