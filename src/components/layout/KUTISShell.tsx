import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { KUTISMap } from '../map/KUTISMap';
import { TopNav } from './TopNav';
import { BottomTabBar } from './BottomTabBar';
import { useTrafficStore } from '../../store/traffic.store';

export function KUTISShell() {
  const location = useLocation();
  const tickNow = useTrafficStore((state) => state.tickNow);
  const hiddenMap = useTrafficStore((state) => state.hiddenMap);
  const setHiddenMap = useTrafficStore((state) => state.setHiddenMap);

  useEffect(() => {
    const interval = window.setInterval(() => tickNow(), 1000);
    return () => window.clearInterval(interval);
  }, [tickNow]);

  useEffect(() => {
    setHiddenMap(['/analytics', '/system-admin'].includes(location.pathname));
  }, [location.pathname, setHiddenMap]);

  return (
    <div className="flex h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <TopNav />
      <div className="relative flex-1 overflow-hidden">
        <KUTISMap hidden={hiddenMap} />
        {/* On mobile: pb-16 so content clears the bottom tab bar */}
        <div className="absolute inset-0 z-20 overflow-auto pointer-events-none pb-16 lg:pb-0">
          <Outlet />
        </div>
      </div>
      {/* Footer — desktop only */}
      <footer className="hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] text-[var(--muted)] lg:block">
        KUTIS v1.0 · Kozhikode Smart City Mission · ST-GNN Traffic Intelligence
      </footer>
      {/* Bottom tab bar — mobile only */}
      <BottomTabBar />
    </div>
  );
}

export const appRoutes = {
  commandCenter: '/command-center',
  measures: '/measures',
  forecasting: '/forecasting',
  analytics: '/analytics',
  incidents: '/incidents',
  events: '/events',
  systemAdmin: '/system-admin',
} as const;

export const topNavRoutes = [
  { to: appRoutes.commandCenter, label: 'Command Center' },
  { to: appRoutes.measures, label: 'Measures' },
  { to: appRoutes.forecasting, label: 'Forecasting' },
  { to: appRoutes.analytics, label: 'Analytics' },
  { to: appRoutes.incidents, label: 'Incidents' },
  { to: appRoutes.events, label: 'Events' },
  { to: appRoutes.systemAdmin, label: 'System Admin' },
] as const;

export const sidebarRoutes = [
  { to: appRoutes.commandCenter, label: 'Live Command Center', short: 'Command' },
  { to: appRoutes.measures, label: 'Measures', short: 'Measures' },
  { to: appRoutes.forecasting, label: 'Forecasting', short: 'Forecast' },
  { to: appRoutes.analytics, label: 'Analytics & Insights', short: 'Insights' },
  { to: appRoutes.incidents, label: 'Incidents', short: 'Response' },
  { to: appRoutes.events, label: 'Events', short: 'Events' },
  { to: appRoutes.systemAdmin, label: 'System Admin', short: 'Health' },
] as const;
