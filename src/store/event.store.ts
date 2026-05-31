import { create } from 'zustand';
import type { TrafficEvent } from '../types/traffic';
import { events as seedEvents } from '../data/trafficNetwork';

const STORAGE_KEY = 'kvt_events_v1';

const loadFromStorage = (): TrafficEvent[] => {
  try {
    if (typeof window === 'undefined') return seedEvents.slice();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedEvents.slice();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return seedEvents.slice();
  } catch (_e) {
    return seedEvents.slice();
  }
};

const saveToStorage = (items: TrafficEvent[]) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_e) {
    // ignore
  }
};

type EventStore = {
  events: TrafficEvent[];
  addEvent: (ev: TrafficEvent) => void;
  setEvents: (items: TrafficEvent[]) => void;
  replaceIfMissing: (ev: TrafficEvent) => void;
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: loadFromStorage(),
  addEvent: (ev) => {
    set((s) => {
      const next = [ev, ...s.events];
      saveToStorage(next);
      return { events: next };
    });
  },
  setEvents: (items) => {
    saveToStorage(items);
    set({ events: items });
  },
  replaceIfMissing: (ev) => {
    const existing = get().events.find((e) => e.id === ev.id);
    if (!existing) {
      const next = [ev, ...get().events];
      saveToStorage(next);
      set({ events: next });
    }
  },
}));

export default useEventStore;
