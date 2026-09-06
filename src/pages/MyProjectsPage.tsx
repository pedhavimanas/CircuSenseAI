import React, { useState } from 'react';
import { ProjectRecord } from '../types';
import { 
  FolderKanban, 
  Trash2, 
  ArrowUpRight, 
  FileDown, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Plus,
  Calendar,
  Layers
} from 'lucide-react';

interface MyProjectsPageProps {
  projects: ProjectRecord[];
  onOpenProject: (project: ProjectRecord) => void;
  onDeleteProject: (projectId: string) => void;
  onNewScan: () => void;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({
  projects,
  onOpenProject,
  onDeleteProject,
  onNewScan
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.boardCode.toLowerCase().includes(search.toLowerCase()) ||
    (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12151A] border border-slate-800 rounded-xl px-5 py-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              My PCB Projects &amp; Historical Audits
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-[#00D1FF15] text-[#00D1FF] font-mono border border-[#00D1FF30]">
              {projects.length} Saved
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Stored circuit analyses, component inventories, and bench validation records
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-lg shadow-[#00D1FF20] cursor-pointer"
        >
          <Plus size={15} />
          <span>New PCB Scan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter saved projects by board name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12151A] border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00D1FF] font-sans"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(proj => (
          <div
            key={proj.id}
            className="bg-[#12151A] border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-[#00D1FF] font-bold bg-[#0A0C0E] px-2.5 py-1 rounded border border-slate-800">
                  {proj.boardCode}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  proj.status === 'fault_flagged'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {proj.status === 'fault_flagged' ? 'Needs Action' : 'Certified'}
                </span>
              </div>

              <h3 className="font-semibold text-base text-white group-hover:text-[#00D1FF] transition-colors line-clamp-1 mb-1">
                {proj.name}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {proj.notes || 'PCB inspection records saved.'}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="p-2 rounded bg-[#0A0C0E] border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block font-sans">Components</span>
                  <span className="text-slate-200 font-bold">{proj.componentsCount} Parts</span>
                </div>
                <div className="p-2 rounded bg-[#0A0C0E] border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block font-sans">Anomalies</span>
                  <span className={proj.warningsCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {proj.warningsCount} Flagged
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <Calendar size={12} />
                <span>{proj.updatedAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete project"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => onOpenProject(proj)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-md shadow-[#00D1FF20] cursor-pointer"
                >
                  <span>Open</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-[#12151A] border border-slate-800 rounded-xl">
          No projects found. Click "New PCB Scan" on the dashboard to analyze and save your first board.
        </div>
      )}
    </div>
  );
};
