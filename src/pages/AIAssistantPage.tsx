import React from 'react';
import { PCBBoard, PCBComponent } from '../types';
import { AIChat } from '../components/AIChat';
import { Sparkles, Cpu, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface AIAssistantPageProps {
  board: PCBBoard;
  selectedComponent?: PCBComponent;
  onOpenDatasheet: (datasheetId?: string) => void;
  onNavigateToFaults: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  board,
  selectedComponent,
  onOpenDatasheet,
  onNavigateToFaults
}) => {
  return (
    <div className="space-y-4 pb-10">
      {/* Top Banner */}
      <div className="bg-[#12151A] border border-slate-800 rounded-xl px-5 py-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              PCB-Aware Engineering Assistant
            </h1>
            <p className="text-xs text-slate-400">
              Active Context: <span className="text-[#00D1FF] font-mono font-medium">{board.name}</span> ({board.boardCode})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>RAG Circuit Vector Store Synced</span>
        </div>
      </div>

      {/* Main Grid: Left = AI Chat, Right = Active PCB Context Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[620px]">
        {/* Chat Interface */}
        <div className="lg:col-span-8 h-[640px]">
          <AIChat
            board={board}
            selectedComponent={selectedComponent}
            onOpenDatasheet={onOpenDatasheet}
            onNavigateToFaults={onNavigateToFaults}
            className="h-full"
          />
        </div>

        {/* Right Column: Context Board Telemetry & Quick References */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#12151A] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={15} className="text-[#00D1FF]" />
              <span>Loaded Netlist Metadata</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-[#0A0C0E] border border-slate-800">
                <span className="text-slate-400">Board Code:</span>
                <span className="text-[#00D1FF] font-bold">{board.boardCode}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0A0C0E] border border-slate-800">
                <span className="text-slate-400">Layer Stackup:</span>
                <span className="text-slate-200">{board.layerCount}-Layer FR4</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0A0C0E] border border-slate-800">
                <span className="text-slate-400">Total Components:</span>
                <span className="text-slate-200">{board.components.length} parts</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0A0C0E] border border-slate-800">
                <span className="text-slate-400">Identified Coverage:</span>
                <span className="text-emerald-400">{board.metrics.identifiedPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Anomaly quick list */}
          <div className="bg-[#12151A] border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-400" />
              <span>Active Anomaly Flags</span>
            </h3>

            <div className="space-y-2">
              {board.components.filter(c => c.status !== 'normal').map(c => (
                <div 
                  key={c.id} 
                  onClick={onNavigateToFaults}
                  className="p-2.5 rounded-lg bg-[#0A0C0E] border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00D1FF] font-bold">{c.id}</span>
                    <span className="text-amber-400 text-[10px]">{c.confidence}% conf</span>
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-1">{c.fault?.title || c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
