import type { RoadLink, LinkState, JunctionNode, NodeState, TrafficState } from '../types/traffic';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const round1 = (value: number) => Math.round(value * 10) / 10;
export const round0 = (value: number) => Math.round(value);

export const getLinkColor = (speed: number) => {
  return '#f97316';
};

export const getTrafficState = (speed: number): TrafficState => {
  if (speed >= 40) return 'smooth';
  if (speed >= 30) return 'moderate';
  if (speed >= 20) return 'heavy';
  if (speed >= 12) return 'severe';
  return 'critical';
};

export const getLos = (speed: number) => {
  if (speed >= 50) return 'A';
  if (speed >= 40) return 'B';
  if (speed >= 32) return 'C';
  if (speed >= 22) return 'D';
  if (speed >= 14) return 'E';
  return 'F';
};

const hash = (value: string) => value.split('').reduce((sum, char) => sum + char.charCodeAt(0) * 17, 0);
const wave = (seed: number, factor = 1) => Math.sin(seed * factor) * 0.5 + Math.cos(seed * 0.7 * factor) * 0.5;

export const buildNodeState = (node: JunctionNode, tick: number): NodeState => {
  const seed = hash(node.id) / 100 + tick / 5;
  const phaseCycle = node.signalClass === 'signalized' ? 72 + (hash(node.id) % 16) : 90 + (hash(node.id) % 25);
  const phasePosition = Math.floor((seed * 10) % phaseCycle);
  const phase = phasePosition < phaseCycle * 0.45 ? 'green' : phasePosition < phaseCycle * 0.5 ? 'amber' : 'red';
  const queueBias = node.signalClass === 'signalized' ? 6 : node.signalClass === 'bottleneck' ? 10 : node.signalClass === 'transit' ? 4 : 0;
  const qN = round0(clamp(18 + wave(seed, 1.3) * 8 + queueBias, 0, 160));
  const qS = round0(clamp(16 + wave(seed + 1, 1.7) * 7 + (node.signalClass === 'transit' ? 4 : queueBias / 2), 0, 160));
  const qE = round0(clamp(14 + wave(seed + 2, 1.9) * 6 + (node.signalClass === 'signalized' ? 3 : 0), 0, 160));
  const qW = round0(clamp(13 + wave(seed + 3, 1.1) * 6 + (node.signalClass === 'signalized' ? 3 : 0), 0, 160));

  return {
    id: node.id,
    phase,
    phase_remaining: phase === 'green' ? 28 - (phasePosition % 28) : phase === 'amber' ? 4 : 52 - (phasePosition % 52),
    cycle: phaseCycle,
    q_n: qN,
    q_s: qS,
    q_e: qE,
    q_w: qW,
    throughput: round0(clamp(320 + wave(seed, 1.2) * 120 + (node.signalClass === 'signalized' ? 35 : 0), 100, 900)),
  };
};

export const buildLinkState = (link: RoadLink, nodes: Record<string, JunctionNode>, tick: number, loadFactor = 0) => {
  const from = nodes[link.from];
  const to = nodes[link.to];
  const seed = (hash(link.id) + tick * 17) / 100;
  const weight = link.roadClass === 'bypass' ? 5 : link.roadClass === 'arterial' ? 4 : link.roadClass === 'collector' ? 3 : 3;
  const roadBias = weight === 5 ? -4 : weight === 3 ? 2 : 8;
  const geometryBias = Math.abs(from.lat - to.lat) * 420 + Math.abs(from.lng - to.lng) * 550;
  const speed = clamp(42 + wave(seed, 1.5) * 11 - roadBias - loadFactor * 18 - geometryBias, 5, 56);
  const volume = round0(clamp((weight === 5 ? 820 : weight === 3 ? 560 : 320) + wave(seed + 1, 1.1) * 110 + loadFactor * 180, 80, 1600));
  const queue = round0(clamp(geometryBias * 1.2 + loadFactor * 120 + (50 - speed) * 4, 0, 480));
  const freeFlow = weight === 5 ? 38 : weight === 3 ? 44 : 50;
  const delay = round0(clamp(((freeFlow - speed) / freeFlow) * 100 + loadFactor * 85, 0, 260));
  const travelSeconds = round0(clamp(((Math.abs(from.lat - to.lat) + Math.abs(from.lng - to.lng)) * 111000) / Math.max(speed, 5) * 3.6, 25, 420));
  const occupancy = clamp(0.18 + (60 - speed) / 68 + loadFactor * 0.4, 0.05, 0.98);
  const congestion = clamp((60 - speed) / 6 + loadFactor * 3.5, 0, 10);
  const predictedSpeed = clamp(speed + wave(seed + 2, 1.7) * 4 - loadFactor * 8, 5, 56);

  return {
    id: link.id,
    speed: round1(speed),
    volume,
    queue,
    travel_time: travelSeconds,
    delay,
    occupancy: round1(occupancy),
    los: getLos(speed),
    congestion_index: round1(congestion),
    predicted_speed_15m: round1(predictedSpeed),
    ai_confidence: round1(clamp(0.79 + wave(seed, 1.4) * 0.08, 0.7, 0.98)),
    state: getTrafficState(speed),
  } satisfies LinkState;
};

export const buildLinkPath = (link: RoadLink, nodes: Record<string, JunctionNode>) => {
  const from = nodes[link.from];
  const to = nodes[link.to];
  const normalize = (pt: [number, number]) => {
    // If first value looks like longitude (outside -90..90), swap to [lat,lng]
    if (Math.abs(pt[0]) > 90 && Math.abs(pt[1]) <= 90) return [pt[1], pt[0]] as [number, number];
    // Otherwise assume it's already [lat,lng]
    return pt;
  };

  return [[from.lat, from.lng], ...link.waypoints.map(normalize), [to.lat, to.lng]] as Array<[number, number]>;
};
