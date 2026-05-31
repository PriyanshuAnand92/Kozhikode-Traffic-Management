import { create } from 'zustand';
import { LIVE_INCIDENTS } from '../data/mock';
import type { Incident } from '../types/traffic';

export const useIncidentStore = create<{ incidents: Incident[]; setIncidents: (incidents: Incident[]) => void }>((set) => ({
  incidents: LIVE_INCIDENTS,
  setIncidents: (incidents) => set({ incidents }),
}));
