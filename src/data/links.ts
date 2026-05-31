import { roads } from './trafficNetwork';
import type { LinkDefinition } from '../types/traffic';

const weightByRoadClass: Record<(typeof roads)[number]['roadClass'], LinkDefinition['weight']> = {
  arterial: 4,
  collector: 3,
  connector: 3,
  bypass: 5,
  transit: 4,
};

export const LINKS = roads.map((road) => ({
  id: road.id,
  from: road.from,
  to: road.to,
  waypoints: road.waypoints,
  weight: weightByRoadClass[road.roadClass],
  corridor: road.corridor,
})) as readonly LinkDefinition[];
