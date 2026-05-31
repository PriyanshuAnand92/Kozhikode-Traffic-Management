import { events, incidents, junctions, roads } from '../data/trafficNetwork';
import type { EventPlan, Incident, JunctionNode, RoadLink } from '../types/traffic';

export const searchTraffic = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return { junctions, roads, incidents, events };
  }

  return {
    junctions: junctions.filter((junction) => `${junction.name} ${junction.zone}`.toLowerCase().includes(normalized)),
    roads: roads.filter((road) => `${road.name} ${road.corridor}`.toLowerCase().includes(normalized)),
    incidents: incidents.filter((incident) => `${incident.title} ${incident.location}`.toLowerCase().includes(normalized)),
    events: events.filter((event) => `${event.name} ${event.venue}`.toLowerCase().includes(normalized)),
  };
};

export const selectItemById = <T extends { id: string }>(items: T[], id: string | null | undefined) => items.find((item) => item.id === id) ?? items[0] ?? null;

export const selectJunction = (items: JunctionNode[], selectedId: string | null | undefined) => selectItemById(items, selectedId);

export const selectRoad = (items: RoadLink[], selectedId: string | null | undefined) => selectItemById(items, selectedId);

export const selectIncident = <T extends { id: string }>(items: T[], selectedId: string | null | undefined) => selectItemById(items, selectedId);

export const selectEvent = <T extends { id: string }>(items: T[], selectedId: string | null | undefined) => selectItemById(items, selectedId);
