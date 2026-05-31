import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { sidebarRoutes } from '../../lib/appRoutes';

interface SidebarProps {
  id?: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* mobile backdrop */}
      {open ? (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 hidden lg:hidden mobile-drawer-backdrop"
          aria-hidden
        />
      ) : null}

      <aside id={"app-sidebar"} aria-label="Main navigation" className={cn(
        'flex h-full w-full flex-col border-r border-slate-200 bg-slate-950 px-4 py-5 text-slate-100 lg:w-[288px]',
        open ? 'fixed left-0 top-0 z-50 h-full w-[84%] max-w-xs transform shadow-2xl lg:relative lg:block' : 'hidden lg:flex'
      )} aria-hidden={!open && typeof window !== 'undefined' && window.innerWidth < 1024}>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Kozhikode District</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Mobility Command Center</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Smart city traffic intelligence for live operations, forecasting, event control, and emergency coordination.
        </p>
      </div>

      <nav className="mt-6 space-y-2">
        {sidebarRoutes.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={false}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-colors',
                isActive
                  ? 'border-blue-400/40 bg-blue-500/15 text-white shadow-lg shadow-blue-950/10'
                  : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white',
              )
            }
          >
            <span>{item.label}</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{item.short}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">Operational note</p>
        <p className="mt-2 leading-6">
          Roads and junctions are aligned to the Kozhikode corridor graph centered on Mavoor Road, Bus Stand,
          Stadium, Mananchira, Poonthanam, Arayidathupalam, and Palayam.
        </p>
      </div>
      </aside>
    </>
  );
}
