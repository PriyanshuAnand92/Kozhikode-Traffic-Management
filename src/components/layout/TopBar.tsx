import { formatClock } from '../../lib/format';

interface TopBarProps {
  timestamp: Date;
  networkLabel: string;
  summary: string;
  onToggleSidebar?: () => void;
}

export function TopBar({ timestamp, networkLabel, summary }: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <button
          aria-label="Toggle navigation"
          aria-controls="app-sidebar"
          className="-ml-2 mr-3 inline-flex items-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={typeof window !== 'undefined' ? () => window.dispatchEvent(new CustomEvent('toggle-sidebar')) : undefined}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Operational status bar</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">{networkLabel}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700">{summary}</div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
          Live clock {formatClock(timestamp)} IST
        </div>
      </div>
    </header>
  );
}
