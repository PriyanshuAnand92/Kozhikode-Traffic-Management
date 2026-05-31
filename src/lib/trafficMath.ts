import type { RoadCondition } from '../types/traffic';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const congestionToCondition = (value: number): RoadCondition => {
  if (value < 0.28) return 'smooth';
  if (value < 0.46) return 'moderate';
  if (value < 0.66) return 'heavy';
  if (value < 0.82) return 'severe';
  return 'critical';
};

export const congestionToColor = (value: number) => {
  if (value < 0.28) return '#16a34a';
  if (value < 0.46) return '#facc15';
  if (value < 0.66) return '#f97316';
  if (value < 0.82) return '#ef4444';
  return '#7f1d1d';
};

export const congestionLabel = (value: number) => {
  if (value < 0.28) return 'Smooth';
  if (value < 0.46) return 'Moderate';
  if (value < 0.66) return 'Heavy';
  if (value < 0.82) return 'Severe';
  return 'Critical';
};

export const weightedAverage = (...values: Array<[number, number]>) => {
  const totalWeight = values.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight === 0) {
    return 0;
  }

  return values.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
};

export const formatMinutes = (value: number) => `${Math.round(value)} min`;
export const formatSeconds = (value: number) => `${Math.round(value)} sec`;

export const roundTo = (value: number, digits = 1) => Number(value.toFixed(digits));

export const makePulsedValue = (base: number, tick: number, amplitude = 1) => {
  const pulse = Math.sin((tick + base) / 3.7) * amplitude;
  return clamp(base + pulse, 0, 100);
};
