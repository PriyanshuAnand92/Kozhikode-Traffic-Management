import { create } from 'zustand';
import { DEFAULT_FORECAST, getForecastSeries } from '../data/mock';
import type { ForecastPoint } from '../types/traffic';

export const useForecastStore = create<{
  horizon: 25 | 20 | 15 | 10 | 5;
  playing: boolean;
  speed: 1 | 2 | 4;
  points: ForecastPoint[];
  setHorizon: (value: 25 | 20 | 15 | 10 | 5) => void;
  setPlaying: (value: boolean) => void;
  setSpeed: (value: 1 | 2 | 4) => void;
  recompute: (eventOn: boolean, crowd: number) => void;
}>((set) => ({
  horizon: 25,
  playing: false,
  speed: 1,
  points: DEFAULT_FORECAST,
  setHorizon: (horizon) => set({ horizon }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  recompute: (eventOn, crowd) => set({ points: getForecastSeries(eventOn, crowd) }),
}));
