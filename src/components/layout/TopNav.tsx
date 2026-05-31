import { Moon, Satellite, SunMedium } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '../../store/theme.store';
import { useTrafficStore } from '../../store/traffic.store';
import { Badge } from '../ui/Badge';
import { topNavRoutes } from '../../lib/appRoutes';

export function TopNav() {
  const { theme, setTheme } = useThemeStore();
  const tick = useTrafficStore((state) => state.tick);

  const time = new Date(Date.now() + tick * 1000).toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="flex h-12 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
      {/* Desktop: logo + nav — hidden on mobile */}
      <div className="hidden items-center gap-2 text-[14px] font-medium text-[var(--text)] lg:flex">
        <span>KUTIS</span>
        <span className="text-[var(--muted)]">·</span>
        <span className="text-[12px] text-[var(--muted)]">Kozhikode</span>
      </div>

      <nav className="hidden items-center gap-5 lg:flex">
        {topNavRoutes.map((page) => (
          <NavLink
            key={page.to}
            to={page.to}
            className={({ isActive }) =>
              `border-b-2 pb-1 text-[12px] font-medium ${isActive ? 'border-[var(--accent)] text-[var(--text)]' : 'border-transparent text-[var(--muted)]'}`
            }
          >
            {page.label}
            {(page.label === 'Incidents' || page.label === 'Events') && (
              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[var(--danger)] align-middle" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mobile: clock left, theme right — no logo, no bell, no search */}
      <div className="flex items-center lg:hidden">
        <Badge tone="accent">{time}</Badge>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search — desktop only */}
        <label className="hidden h-8 items-center gap-2 rounded-[10px] border border-[var(--border)] px-3 lg:flex">
          <input placeholder="Search" className="w-28 bg-transparent text-[12px] outline-none placeholder:text-[var(--muted)]" />
          <span className="text-[10px] text-[var(--muted)]">⌘K</span>
        </label>

        {/* Theme toggle — visible on both */}
        <div className="flex items-center rounded-[10px] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-2 ${theme === 'light' ? 'bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}
          >
            <SunMedium size={14} />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-2 ${theme === 'dark' ? 'bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}
          >
            <Moon size={14} />
          </button>
          <button
            type="button"
            onClick={() => setTheme('satellite')}
            className={`p-2 ${theme === 'satellite' ? 'bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]' : 'text-[var(--muted)]'}`}
          >
            <Satellite size={14} />
          </button>
        </div>

        {/* Clock — desktop only (mobile shows it on the left) */}
        <Badge tone="accent" className="hidden lg:inline-flex">{time}</Badge>
      </div>
    </header>
  );
}
