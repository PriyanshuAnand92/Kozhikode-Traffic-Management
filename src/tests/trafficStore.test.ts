import { describe, expect, it } from 'vitest';
import { useTrafficStore } from '../store/traffic.store';

describe('traffic store selection', () => {
  it('syncs the active link when a link is selected', () => {
    useTrafficStore.getState().setSelectedLinkId('road-bus-stand-arayidathupalam');

    expect(useTrafficStore.getState().selectedLinkId).toBe('road-bus-stand-arayidathupalam');
    expect(useTrafficStore.getState().activeLinkId).toBe('road-bus-stand-arayidathupalam');
  });
});