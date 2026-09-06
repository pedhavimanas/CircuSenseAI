import { PCBBoard, PCBComponent } from '../types';

export interface AIResponseResult {
  text: string;
  relatedComponentId?: string;
  relatedDatasheetId?: string;
  suggestedPrompts?: string[];
  isError?: boolean;
}

export const aiApi = {
  generateResponse: async (
    query: string,
    board: PCBBoard,
    selectedComponent?: PCBComponent
  ): Promise<AIResponseResult> => {
    try {
      const response = await fetch('/api/chat-pcb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          boardContext: {
            name: board.name,
            boardCode: board.boardCode,
            presetType: board.presetType,
            components: board.components,
            metrics: board.metrics,
            isDemoData: board.isDemoData
          },
          selectedComponent
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Gemini 2.5 Flash response generation failed on the server.');
      }

      // Check if related component has a datasheet
      let relatedDatasheetId: string | undefined;
      if (data.relatedComponentId) {
        const comp = board.components.find(c => c.id.toLowerCase() === data.relatedComponentId?.toLowerCase());
        if (comp?.datasheetId) {
          relatedDatasheetId = comp.datasheetId;
        }
      } else if (selectedComponent?.datasheetId) {
        relatedDatasheetId = selectedComponent.datasheetId;
      }

      return {
        text: data.text,
        relatedComponentId: data.relatedComponentId,
        relatedDatasheetId,
        suggestedPrompts: data.suggestedPrompts || [
          'Explain this circuit',
          'What could be wrong?',
          'Check for Possible Issues'
        ]
      };
    } catch (err: any) {
      console.error('aiApi.generateResponse failed:', err);
      // Re-throw so caller can display the visible error state in the UI as required
      throw new Error(err?.message || 'Failed to connect to AI server');
    }
  }
};

