import { junctions } from './trafficNetwork';
import type { NodeDefinition } from '../types/traffic';

const typeBySignalClass: Record<(typeof junctions)[number]['signalClass'], NodeDefinition['type']> = {
  signalized: 'signalized',
  connector: 'connector',
  bottleneck: 'bottleneck',
  transit: 'transit_hub',
  'event-aware': 'event_zone',
};

export const NODES = junctions.map((junction) => ({
  id: junction.id,
  name: junction.name,
  lat: junction.lat,
  lng: junction.lng,
  type: typeBySignalClass[junction.signalClass],
})) as readonly NodeDefinition[];
