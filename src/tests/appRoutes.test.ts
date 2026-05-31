import { describe, expect, it } from 'vitest';
import { appRoutes, sidebarRoutes, topNavRoutes } from '../lib/appRoutes';

describe('app routes', () => {
  it('keeps a single canonical route map', () => {
    expect(Object.values(appRoutes)).toEqual([
      '/command-center',
      '/measures',
      '/forecasting',
      '/analytics',
      '/incidents',
      '/events',
      '/system-admin',
    ]);
  });

  it('reuses the same canonical routes in navigation', () => {
    expect(topNavRoutes.map((item) => item.to)).toEqual(Object.values(appRoutes));
    expect(sidebarRoutes.map((item) => item.to)).toEqual(Object.values(appRoutes));
  });

  it('does not include legacy aliases in the canonical map', () => {
    expect(Object.values(appRoutes)).not.toContain('/forecast');
    expect(Object.values(appRoutes)).not.toContain('/incident-response');
    expect(Object.values(appRoutes)).not.toContain('/event-management');
    expect(Object.values(appRoutes)).not.toContain('/monitoring');
  });
});