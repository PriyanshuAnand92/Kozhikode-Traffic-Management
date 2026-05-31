import { LINKS } from './links';
import { NODES } from './nodes';
import { roads } from './trafficNetwork';
import { junctions } from './trafficNetwork';
import { buildLinkState, buildNodeState, clamp, round0, round1 } from '../lib/traffic';
import type { EventPlan, ForecastPoint, Incident, LinkState, NodeState, Recommendation } from '../types/traffic';

const nodeMap = Object.fromEntries(NODES.map((node) => [node.id, node]));

export const LIVE_INCIDENTS: Incident[] = [
  {
    id: 'INC-01',
    type: 'roadblock',
    severity: 'critical',
    node_id: 'stadium_jn',
    affected_links: ['road-ksrtc-stadium', 'road-stadium-gtech', 'road-puthiyara-stadium'],
    status: 'active',
    reported_at: Date.now() - 16 * 60 * 1000,
    title: 'Event spillover at Stadium corridor',
    note: 'Queue propagation detected on event-sensitive links.',
  },
  {
    id: 'INC-02',
    type: 'breakdown',
    severity: 'high',
    node_id: 'palayam_jn',
    affected_links: ['road-gtech-palayam'],
    status: 'responding',
    reported_at: Date.now() - 28 * 60 * 1000,
    title: 'Bus dwell time rise at Palayam',
    note: 'Loading activity is extending cycle times.',
  },
  {
    id: 'INC-03',
    type: 'vip',
    severity: 'medium',
    node_id: 'ksrtc_jn',
    affected_links: ['road-ksrtc-arayidathupalam', 'road-ksrtc-stadium'],
    status: 'active',
    reported_at: Date.now() - 9 * 60 * 1000,
    title: 'VIP convoy approaching transit hub',
    note: 'Priority route is reserved through Arayidathupalam.',
  },
];

export const DEFAULT_EVENTS: EventPlan[] = [
  {
    id: 'EV-01',
    name: 'EMS Stadium football match',
    type: 'sports',
    venue_node: 'stadium_jn',
    datetime: '2026-05-21T18:30:00+05:30',
    crowd_size: 32000,
    duration: 150,
    active: true,
    dispersal: 30,
  },
  {
    id: 'EV-02',
    name: 'Palayam cultural rally',
    type: 'rally',
    venue_node: 'palayam_jn',
    datetime: '2026-05-21T14:00:00+05:30',
    crowd_size: 12000,
    duration: 80,
    active: false,
    dispersal: 0,
  },
];

export const DEFAULT_FORECAST: ForecastPoint[] = [5, 10, 15, 20, 25].map((horizon, index) => ({
  horizon,
  speed:            [34, 31, 28, 25, 23][index],
  ci_upper:         [38, 35, 32, 29, 27][index],
  ci_lower:         [29, 26, 23, 20, 18][index],
  congestion_index: [4.2, 4.8, 5.6, 6.4, 7.1][index],
  queue:            [48, 58, 76, 92, 108][index],
  r2:               [0.94, 0.91, 0.88, 0.84, 0.82][index],
}));

export const defaultRecommendations: Recommendation[] = [
  {
    id: 'rec-stadium-01',
    junctionId: 'stadium_jn',
    action: 'Increase green phase by 20 seconds',
    reduction_pct: 32,
    confidence: 0.96,
    priority: 'critical',
    status: 'pending',
    new_green_n: 42,
    new_green_s: 40,
    new_green_e: 18,
    new_green_w: 18,
  },
  {
    id: 'rec-divert-01',
    junctionId: 'mavoor_road_jn',
    action: 'Divert traffic via alternate corridor',
    reduction_pct: 24,
    confidence: 0.90,
    priority: 'high',
    status: 'pending',
    new_green_n: 30,
    new_green_s: 30,
    new_green_e: 20,
    new_green_w: 20,
  },
  {
    id: 'rec-restrict-01',
    junctionId: 'palayam_jn',
    action: 'Restrict heavy vehicle entry',
    reduction_pct: 18,
    confidence: 0.88,
    priority: 'high',
    status: 'approved',
    new_green_n: 28,
    new_green_s: 28,
    new_green_e: 24,
    new_green_w: 24,
  },
  {
    id: 'rec-emergency-01',
    junctionId: 'bus_stand_jn',
    action: 'Activate emergency priority mode',
    reduction_pct: 37,
    confidence: 0.98,
    priority: 'critical',
    status: 'pending',
    new_green_n: 50,
    new_green_s: 46,
    new_green_e: 16,
    new_green_w: 16,
  },
];

export const getSnapshot = (tick = 0, loadFactor = 0) => {
  const nodeMap = Object.fromEntries(junctions.map((node) => [node.id, node]));
  const linkStates: LinkState[] = roads.map((link) => buildLinkState(link, nodeMap, tick, loadFactor));
  const nodeStates: NodeState[] = junctions.map((node) => buildNodeState(node, tick));
  const totalFreeFlow   = linkStates.reduce((sum, link) => sum + link.speed + loadFactor * 6, 0);
  const networkScore    = round0((totalFreeFlow / (LINKS.length * 50)) * 100);
  const averageSpeed    = round1(linkStates.reduce((sum, link) => sum + link.speed, 0) / linkStates.length);
  const totalQueue      = round0(linkStates.reduce((sum, link) => sum + link.queue, 0));
  const overallCongestion = round1(
    linkStates.reduce((sum, link) => sum + link.congestion_index, 0) / linkStates.length,
  );
  return { linkStates, nodeStates, networkScore, averageSpeed, totalQueue, overallCongestion };
};

export const getForecastSeries = (eventOn = false, crowd = 32000) => {
  const crowdFactor = eventOn ? clamp((crowd / 50000) * 0.6, 0, 0.6) : 0;
  return DEFAULT_FORECAST.map((point, index) => ({
    ...point,
    speed:            round1(clamp(point.speed - crowdFactor * [8, 9, 10, 11, 12][index], 5, 60)),
    ci_upper:         round1(clamp(point.ci_upper - crowdFactor * 4, 5, 60)),
    ci_lower:         round1(clamp(point.ci_lower - crowdFactor * 6, 5, 60)),
    congestion_index: round1(clamp(point.congestion_index + crowdFactor * 4, 0, 10)),
    queue:            round0(clamp(point.queue + crowdFactor * 140, 0, 500)),
  }));
};