import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { getNetworkSummary, liveSnapshot } from '../../data/trafficNetwork';
import { useTrafficStore } from '../../store/useTrafficStore';

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setMobileSidebarOpen((v) => !v);
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
      if (e.key.toLowerCase() === 'm') setMobileSidebarOpen((v) => !v);
    };
    window.addEventListener('toggle-sidebar', handler as EventListener);
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('toggle-sidebar', handler as EventListener);
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);
  const [timestamp, setTimestamp] = useState(new Date());
  const bumpClockTick = useTrafficStore((state) => state.bumpClockTick);
  const location = useLocation();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimestamp(new Date());
      bumpClockTick();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [bumpClockTick]);

  const summary = getNetworkSummary();

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar id="app-sidebar" open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar
            timestamp={timestamp}
            networkLabel="Kozhikode Urban Mobility Intelligence Platform"
            summary={`Congestion ${Math.round(summary.averageCongestion * 100)}% · ${liveSnapshot.incidentsOpen} incidents · ${summary.criticalRoads} critical links`}
          />
          <main className="flex-1 px-4 py-4 sm:px-5 lg:px-6">
            <a id="main-content" tabIndex={-1} />
            <div aria-live="polite" className="sr-only" aria-hidden={!mobileSidebarOpen}>Navigation opened</div>
            <div className="mx-auto max-w-[1800px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {children ?? <Outlet />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
