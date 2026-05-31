export type ThemeName = 'light' | 'dark' | 'satellite';

export type NodeType = 'transit_hub' | 'hospital' | 'connector' | 'event_zone' | 'rotary' | 'signalized' | 'commercial' | 'urban' | 'bottleneck';
export type TrafficState = 'smooth' | 'moderate' | 'heavy' | 'severe' | 'critical';
export type RoadCondition = TrafficState;

export interface NodeDefinition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: NodeType;
}

export interface LinkDefinition {
  id: string;
  from: string;
  to: string;
  waypoints: Array<[number, number]>;
  weight: number;
  corridor: string;
}

export interface LinkState {
  id: string;
  speed: number;
  volume: number;
  queue: number;
  travel_time: number;
  delay: number;
  occupancy: number;
  los: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  congestion_index: number;
  predicted_speed_15m: number;
  ai_confidence: number;
  state: TrafficState;
}

export interface NodeState {
  id: string;
  phase: 'green' | 'amber' | 'red' | 'flashing';
  phase_remaining: number;
  cycle: number;
  q_n: number;
  q_s: number;
  q_e: number;
  q_w: number;
  throughput: number;
  recommendation?: Recommendation;
}

export interface Recommendation {
  id: string;
  junctionId: string;
  action: string;
  reduction_pct: number;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  new_green_n: number;
  new_green_s: number;
  new_green_e: number;
  new_green_w: number;
}

export interface Incident {
  id: string;
  type: 'accident' | 'breakdown' | 'roadblock' | 'vip' | 'flooding';
  severity: 'critical' | 'high' | 'medium' | 'low';
  node_id: string;
  affected_links: string[];
  status: 'active' | 'responding' | 'resolved';
  reported_at: number;
  title: string;
  note: string;
}

export interface ForecastPoint {
  horizon: number;
  speed: number;
  ci_upper: number;
  ci_lower: number;
  congestion_index: number;
  queue: number;
  r2: number;
}

export interface EventPlan {
  id: string;
  name: string;
  type: 'sports' | 'festival' | 'rally' | 'vip';
  venue_node: string;
  datetime: string;
  crowd_size: number;
  duration: number;
  active: boolean;
  dispersal: 0 | 30 | 60;
}

export interface ThemeTokens {
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  success: string;
  warn: string;
  danger: string;
}

export type JunctionType =
  | 'Major Signalized Junction'
  | 'Urban Signalized Intersection'
  | 'Critical Bottleneck Junction'
  | 'Urban Connector Node'
  | 'Smart Event-Aware Junction'
  | 'Traffic Distribution Junction'
  | 'Commercial Activity Node'
  | 'Transit Hub Junction';

export interface JunctionNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: JunctionType;
  zone: string;
  signalClass: 'signalized' | 'connector' | 'bottleneck' | 'transit' | 'event-aware';
  headline: string;
  currentPhase: string;
  queueLength: number;
  density: number;
  speed: number;
  delay: number;
  travelTime: number;
  congestionIndex: number;
  predictedRisk: number;
  aiConfidence: number;
  signalTimings: {
    green: number;
    amber: number;
    red: number;
  };
}

export interface RoadLink {
  id: string;
  name: string;
  from: string;
  to: string;
  corridor: string;
  roadClass: 'arterial' | 'collector' | 'connector' | 'bypass' | 'transit';
  waypoints: Array<[number, number]>;
  density: number;
  speed: number;
  queueLength: number;
  travelTime: number;
  congestionIndex: number;
  predictedDelay: number;
  occupancy: number;
  aiConfidence: number;
  trafficState: 'smooth' | 'moderate' | 'heavy' | 'severe' | 'critical';
  eventSensitive?: boolean;
}

export interface TrafficIncident {
  id: string;
  title: string;
  location: string;
  junctionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'mitigated' | 'closed';
  description: string;
  etaMinutes: number;
  reportedAt: string;
}

export interface TrafficEvent {
  id: string;
  name: string;
  category: 'sports' | 'festival' | 'vip' | 'rally' | 'religious';
  venue: string;
  impactRadiusKm: number;
  attendance: number;
  startTime: string;
  endTime: string;
  state: 'scheduled' | 'live' | 'completed';
}

export interface TrafficForecastPoint {
  timestamp: string;
  congestionIndex: number;
  travelTimeMinutes: number;
  queueLength: number;
  risk: number;
}

export interface AIRecommendation {
  id: string;
  junctionId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  action: string;
  mitigation: string;
  signalTiming: string;
  confidence: number;
  impactEstimate: number;
  approvalState: 'pending' | 'approved' | 'rejected';
}

export interface SignalTimingPlan {
  junctionId: string;
  green: number;
  amber: number;
  red: number;
  manualOverride: boolean;
  lastUpdated: string;
}

export interface SystemMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  detail: string;
}

export interface TrafficSnapshot {
  timestamp: string;
  weather: string;
  temperatureC: number;
  humidity: number;
  visibility: string;
  overallCongestion: number;
  incidentsOpen: number;
  activeSignals: number;
  emergencyLanes: number;
}
