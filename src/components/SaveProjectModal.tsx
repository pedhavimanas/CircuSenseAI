import React, { useState } from 'react';
import { PCBBoard, ProjectRecord } from '../types';
import { X, Save, Check, FileDown, FolderKanban, ShieldCheck } from 'lucide-react';

interface SaveProjectModalProps {
  board: PCBBoard;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectRecord) => void;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  board,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [projectName, setProjectName] = useState<string>(board.name);
  const [boardCode, setBoardCode] = useState<string>(board.boardCode);
  const [notes, setNotes] = useState<string>(
    board.metrics.warningsCount > 0 
      ? `Visual scan flagged ${board.metrics.warningsCount} anomaly points. Multimeter measurement recommended for C14/Q1.`
      : 'All component packages and solder fillets within nominal specs.'
  );
  const [status, setStatus] = useState<ProjectRecord['status']>(
    board.metrics.warningsCount > 0 ? 'fault_flagged' : 'certified'
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      name: projectName,
      boardCode,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      componentsCount: board.components.length,
      warningsCount: board.metrics.warningsCount,
      status,
      board,
      notes
    };

    onSave(newProject);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(board, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${board.boardCode}-circusense-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12151A] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0C0E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
              <FolderKanban size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Save Analysis Project</h2>
              <p className="text-xs text-slate-400">Persist PCB diagnostics, component logs &amp; test notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1E25] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-slate-700 text-slate-100 focus:outline-none focus:border-[#00D1FF] font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Board Code / Revision</label>
              <input
                type="text"
                value={boardCode}
                onChange={(e) => setBoardCode(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-[#00D1FF]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Classification</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-slate-700 text-slate-100 focus:outline-none focus:border-[#00D1FF]"
              >
                <option value="analyzed">Analyzed (Pending Review)</option>
                <option value="in_progress">In Progress (Bench Testing)</option>
                <option value="fault_flagged">Fault Flagged (Requires Action)</option>
                <option value="certified">Certified Pass</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Engineering Notes &amp; Verification Logs</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-slate-700 text-slate-100 focus:outline-none focus:border-[#00D1FF] font-sans leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between font-mono">
              <span>Total Components Indexed:</span>
              <span className="text-white font-bold">{board.components.length}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Anomalies Flagged:</span>
              <span className="text-amber-400 font-bold">{board.metrics.warningsCount}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-300 text-xs border border-slate-700 transition-colors"
            >
              <FileDown size={14} />
              <span>Export JSON Report</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-md shadow-[#00D1FF20] cursor-pointer"
              >
                {savedSuccess ? <Check size={14} /> : <Save size={14} />}
                <span>{savedSuccess ? 'Project Saved!' : 'Save Project'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
