import { create } from 'zustand';
import { defaultRecommendations, getSnapshot } from '../data/mock';
import { LINKS } from '../data/links';
import { NODES } from '../data/nodes';
import type { LinkState, NodeState, Recommendation } from '../types/traffic';

type LayerKey = 'traffic' | 'nodes' | 'heatmap' | 'aiOverlays' | 'incidents';

interface TrafficStore {
  tick: number;
  historicalOffset: number;
  selectedNodeId: string;
  selectedLinkId: string;
  activeLinkId: string | null;
  selectedJunctionIdForAnalytics: string;
  selectedIncidentId: string | null;
  selectedEventId: string | null;
  searchQuery: string;
  hiddenMap: boolean;
  layers: Record<LayerKey, boolean>;
  linkStates: Record<string, LinkState>;
  nodeStates: Record<string, NodeState>;
  recommendations: Recommendation[];
  forecastCrowd: number;
  eventEnabled: boolean;
  eventDispersal: 0 | 30 | 60;
  themeMode: 'light' | 'dark' | 'satellite';
  refreshSnapshot: () => void;
  setSelectedNodeId: (id: string) => void;
  setSelectedLinkId: (id: string) => void;
  setActiveLinkId: (id: string | null) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setSelectedEventId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setHistoricalOffset: (offset: number) => void;
  toggleLayer: (layer: LayerKey) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'satellite') => void;
  setForecastCrowd: (value: number) => void;
  setEventEnabled: (value: boolean) => void;
  setEventDispersal: (value: 0 | 30 | 60) => void;
  setHiddenMap: (hidden: boolean) => void;
  approveRecommendation: (junctionId: string) => void;
  rejectRecommendation: (junctionId: string) => void;
  previewRecommendation: (junctionId: string) => void;
  tickNow: () => void;
}

const live = getSnapshot(0);
const nodeCount = NODES.length;

export const useTrafficStore = create<TrafficStore>((set, get) => ({
  tick: 0,
  historicalOffset: 0,
  selectedNodeId: 'stadium_jn',
  selectedLinkId: 'road-stadium-mananchira',
  activeLinkId: null,
  selectedJunctionIdForAnalytics: 'stadium_jn',
  selectedIncidentId: 'INC-01',
  selectedEventId: 'EV-01',
  searchQuery: '',
  hiddenMap: false,
  layers: { traffic: true, nodes: true, heatmap: true, aiOverlays: true, incidents: true },
  linkStates: Object.fromEntries(live.linkStates.map((link) => [link.id, link])),
  nodeStates: Object.fromEntries(live.nodeStates.map((node) => [node.id, node])),
  recommendations: defaultRecommendations,
  forecastCrowd: 32000,
  eventEnabled: true,
  eventDispersal: 30,
  themeMode: 'light',
  refreshSnapshot: () => {
    const state = get();
    const snapshot = getSnapshot(state.tick, state.eventEnabled ? state.forecastCrowd / 50000 : 0);
    set({
      linkStates: Object.fromEntries(snapshot.linkStates.map((link) => [link.id, link])),
      nodeStates: Object.fromEntries(snapshot.nodeStates.map((node) => [node.id, node])),
    });
  },
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setSelectedLinkId: (selectedLinkId) => set({ selectedLinkId, activeLinkId: selectedLinkId }),
  setActiveLinkId: (activeLinkId) => set({ activeLinkId }),
  setSelectedIncidentId: (selectedIncidentId) => set({ selectedIncidentId }),
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setHistoricalOffset: (historicalOffset) => set({ historicalOffset }),
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
  setThemeMode: (themeMode) => set({ themeMode }),
  setForecastCrowd: (forecastCrowd) => set({ forecastCrowd }),
  setEventEnabled: (eventEnabled) => set({ eventEnabled }),
  setEventDispersal: (eventDispersal) => set({ eventDispersal }),
  setHiddenMap: (hiddenMap) => set({ hiddenMap }),
  approveRecommendation: (junctionId) =>
    set((state) => ({
      recommendations: state.recommendations.map((recommendation) =>
        recommendation.junctionId === junctionId
          ? { ...recommendation, status: 'approved' as const }
          : recommendation,
      ),
    })),
  rejectRecommendation: (junctionId) =>
    set((state) => ({
      recommendations: state.recommendations.map((recommendation) =>
        recommendation.junctionId === junctionId
          ? { ...recommendation, status: 'rejected' as const }
          : recommendation,
      ),
    })),
  previewRecommendation: (junctionId) => set({ activeLinkId: LINKS.find((link) => link.from === junctionId || link.to === junctionId)?.id ?? null }),
  tickNow: () => {
    const tick = get().tick + 1;
    set({ tick });
    get().refreshSnapshot();
  },
}));
