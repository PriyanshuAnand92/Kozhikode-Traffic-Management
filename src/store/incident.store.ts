import { create } from 'zustand';
import { LIVE_INCIDENTS } from '../data/mock';
import type { Incident } from '../types/traffic';

interface IncidentStore {
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  removeIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
}

const STORAGE_KEY = 'kutis_incidents';

const loadIncidents = (): Incident[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load incidents from localStorage:', e);
  }
  return LIVE_INCIDENTS;
};

const saveIncidents = (incidents: Incident[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.error('Failed to save incidents to localStorage:', e);
  }
};

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: loadIncidents(),
  setIncidents: (incidents) => {
    saveIncidents(incidents);
    set({ incidents });
  },
  addIncident: (incident) =>
    set((state) => {
      const updated = [incident, ...state.incidents];
      saveIncidents(updated);
      return { incidents: updated };
    }),
  updateIncident: (id, updates) =>
    set((state) => {
      const updated = state.incidents.map((inc) =>
        inc.id === id ? { ...inc, ...updates } : inc
      );
      saveIncidents(updated);
      return { incidents: updated };
    }),
  removeIncident: (id) =>
    set((state) => {
      const updated = state.incidents.filter((inc) => inc.id !== id);
      saveIncidents(updated);
      return { incidents: updated };
    }),
  resolveIncident: (id) =>
    set((state) => {
      const updated = state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'resolved' as const } : inc
      );
      saveIncidents(updated);
      return { incidents: updated };
    }),
}));
