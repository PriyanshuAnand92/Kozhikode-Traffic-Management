import { AlertTriangle, CalendarDays, Map, TrendingUp, Zap } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/command-center', label: 'Map',       Icon: Map           },
  { to: '/measures',       label: 'Measures',  Icon: Zap           },
  { to: '/incidents',      label: 'Incidents', Icon: AlertTriangle  },
  { to: '/events',         label: 'Events',    Icon: CalendarDays  },
  { to: '/forecasting',    label: 'Forecast',  Icon: TrendingUp    },
] as const;

export function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] lg:hidden">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`rounded-xl p-1.5 transition-colors ${isActive ? 'bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.6} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
