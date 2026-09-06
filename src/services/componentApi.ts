import { PCBComponent, Datasheet, TestMeasurement, HealthStatus } from '../types';
import { DATASHEETS, MOCK_BOARDS } from '../data/mockBoards';

export const componentApi = {
  getDatasheets: async (): Promise<Datasheet[]> => {
    return DATASHEETS;
  },

  getDatasheetById: async (id: string): Promise<Datasheet | undefined> => {
    return DATASHEETS.find(d => d.id === id || d.partNumber.toLowerCase() === id.toLowerCase());
  },

  findComponent: (boardComponents: PCBComponent[], compId: string): PCBComponent | undefined => {
    return boardComponents.find(c => c.id.toLowerCase() === compId.toLowerCase());
  },

  recordMeasurement: (
    components: PCBComponent[],
    componentId: string,
    measurementId: string,
    measuredValue: string,
    status: 'passed' | 'marginal' | 'failed'
  ): PCBComponent[] => {
    return components.map(c => {
      if (c.id === componentId && c.fault) {
        const updatedMeasurements = c.fault.measurements.map(m => {
          if (m.id === measurementId) {
            return {
              ...m,
              measured: measuredValue,
              verified: true,
              status
            };
          }
          return m;
        });

        // Determine if fault severity should adjust
        const hasFailed = updatedMeasurements.some(m => m.status === 'failed');
        const newSeverity: HealthStatus = hasFailed ? 'issue' : (c.fault.severity === 'issue' ? 'inspection' : 'normal');

        return {
          ...c,
          status: newSeverity,
          fault: {
            ...c.fault,
            severity: newSeverity,
            diagnosisStage: 'electrical_diagnosis',
            measurements: updatedMeasurements
          }
        };
      }
      return c;
    });
  }
};
