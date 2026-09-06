import React from 'react';
import { Datasheet, PCBBoard } from '../types';
import { DatasheetViewer } from '../components/DatasheetViewer';

interface DatasheetsPageProps {
  datasheets: Datasheet[];
  initialDatasheetId?: string;
  activeBoard: PCBBoard;
}

export const DatasheetsPage: React.FC<DatasheetsPageProps> = ({
  datasheets,
  initialDatasheetId,
  activeBoard
}) => {
  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400">
          Showing technical component specifications for parts indexed on <span className="text-cyan-300 font-mono font-medium">{activeBoard.name}</span>
        </p>
      </div>

      <DatasheetViewer
        datasheets={datasheets}
        initialDatasheetId={initialDatasheetId}
        className="min-h-[700px]"
      />
    </div>
  );
};
