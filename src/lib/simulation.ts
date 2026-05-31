import type { JunctionNode, RoadLink } from '../types/traffic';
import { clamp, congestionToCondition, congestionToColor, roundTo } from './trafficMath';

export const simulateRoadFrame = (road: RoadLink, tick: number, pressure = 0) => {
  const oscillation = Math.sin(tick / 2.7 + road.congestionIndex * 8) * 0.05;
  const congestionIndex = clamp(road.congestionIndex + oscillation + pressure, 0.08, 0.97);
  const density = clamp(road.density + Math.cos(tick / 4 + road.density * 10) * 0.03 + pressure * 0.4, 0.06, 0.98);
  const speed = clamp(road.speed - congestionIndex * 10 + Math.sin(tick / 5) * 1.4, 8, 48);
  const queueLength = Math.round(road.queueLength + congestionIndex * 20 + Math.sin(tick / 3) * 3);
  const predictedDelay = clamp(road.predictedDelay + congestionIndex * 5 + pressure * 10, 0, 38);
  const occupancy = clamp(road.occupancy + congestionIndex * 0.1 + pressure * 0.08, 0.08, 0.99);
  const volume = Math.round(Math.max(80, (50 - speed) * 12 + (road.density || 0) * 200));
  const los = speed >= 50 ? 'A' : speed >= 40 ? 'B' : speed >= 32 ? 'C' : speed >= 22 ? 'D' : speed >= 14 ? 'E' : 'F';
  const predicted_speed_15m = Math.round(Math.max(5, speed * 0.95));
  const ai_confidence = Math.round(((road.aiConfidence ?? 0.88) * 100)) / 100;

  return {
    ...road,
    congestionIndex: roundTo(congestionIndex, 2),
    density: roundTo(density, 2),
    speed: roundTo(speed, 1),
    queueLength,
    volume,
    predictedDelay: roundTo(predictedDelay, 1),
    occupancy: roundTo(occupancy, 2),
    trafficState: congestionToCondition(congestionIndex),
    congestionColor: congestionToColor(congestionIndex),
    los,
    predicted_speed_15m,
    ai_confidence,
  };
};

export const simulateJunctionFrame = (junction: JunctionNode, tick: number, pressure = 0) => {
  const oscillation = Math.sin(tick / 3.2 + junction.congestionIndex * 8) * 0.04;
  const congestionIndex = clamp(junction.congestionIndex + oscillation + pressure, 0.08, 0.98);
  const density = clamp(junction.density + oscillation + pressure * 0.8, 0.05, 0.99);
  const speed = clamp(junction.speed - congestionIndex * 8 + Math.cos(tick / 4) * 1.2, 6, 42);
  const queueLength = Math.round(junction.queueLength + congestionIndex * 12 + pressure * 10);
  const delay = clamp(junction.delay + congestionIndex * 6 + pressure * 8, 1, 30);
  const travelTime = clamp(junction.travelTime + congestionIndex * 4 + pressure * 4, 2, 18);
  const predictedRisk = clamp(junction.predictedRisk + congestionIndex * 0.2 + pressure * 0.3, 0.05, 0.99);

  return {
    ...junction,
    congestionIndex: roundTo(congestionIndex, 2),
    density: roundTo(density, 2),
    speed: roundTo(speed, 1),
    queueLength,
    delay: roundTo(delay, 1),
    travelTime: roundTo(travelTime, 1),
    predictedRisk: roundTo(predictedRisk, 2),
  };
};

export const junctionPressure = (junctionId: string) => {
  if (junctionId === 'stadium_jn') return 0.12;
  if (junctionId === 'palayam_jn') return 0.08;
  if (junctionId === 'arayidathupalam_jn') return 0.1;
  return 0;
};

export const roadPressure = (road: RoadLink, activeEventId: string) => {
  if (activeEventId === 'event-ems-match' && road.eventSensitive) {
    return 0.11;
  }
  if (
    activeEventId === 'event-vip-corridor' &&
    (road.from === 'palayam_jn' || road.to === 'palayam_jn' || road.from === 'bus_stand_jn' || road.to === 'bus_stand_jn')
  ) {
    return 0.08;
  }
  return 0;
};
