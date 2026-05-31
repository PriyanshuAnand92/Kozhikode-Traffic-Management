import { create } from 'zustand';
import { events } from '../data/trafficNetwork';

type LayerKey = 'traffic' | 'nodes' | 'signals' | 'incidents' | 'events' | 'predictions';

type TrafficStore = {
  clockTick: number;
  selectedJunctionId: string;
  selectedLinkId?: string;
  activeLayers: Record<LayerKey, boolean>;
  forecastHorizon: number;
  timelineStep: number;
  selectedEventId: string;
  selectedIncidentId: string;
  searchQuery: string;
  setSelectedJunctionId: (junctionId: string) => void;
  toggleLayer: (layer: LayerKey) => void;
  setForecastHorizon: (horizon: number) => void;
  setTimelineStep: (step: number) => void;
  setSelectedEventId: (eventId: string) => void;
  setSelectedIncidentId: (incidentId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLinkId?: (linkId: string) => void;
  bumpClockTick: () => void;
};

export const useTrafficStore = create<TrafficStore>((set) => ({
  clockTick: 0,
  selectedJunctionId: 'stadium_jn',
  activeLayers: {
    traffic: true,
    nodes: true,
    signals: true,
    incidents: true,
    events: true,
    predictions: true,
  },
  forecastHorizon: 6,
  timelineStep: 2,
  selectedEventId: events[0]?.id ?? 'event-ems-match',
  selectedIncidentId: 'incident-stadium-overflow',
  selectedLinkId: undefined,
  searchQuery: '',
  setSelectedJunctionId: (junctionId) => set({ selectedJunctionId: junctionId }),
  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),
  setForecastHorizon: (forecastHorizon) => set({ forecastHorizon }),
  setTimelineStep: (timelineStep) => set({ timelineStep }),
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
  setSelectedIncidentId: (selectedIncidentId) => set({ selectedIncidentId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedLinkId: (selectedLinkId) => set({ selectedLinkId }),
  bumpClockTick: () => set((state) => ({ clockTick: state.clockTick + 1 })),
}));
