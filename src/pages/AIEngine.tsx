import { useMemo, useState } from 'react';
import { useTrafficStore } from '../store/traffic.store';
import { Panel } from '../components/ui/Panel';
import { Badge } from '../components/ui/Badge';
import { MetricCard } from '../components/ui/MetricCard';

const filters = ['All', 'Pending', 'Approved', 'Critical'] as const;

export function Measures() {
  const recommendations = useTrafficStore((state) => state.recommendations);
  const previewRecommendation = useTrafficStore((state) => state.previewRecommendation);
  const approveRecommendation = useTrafficStore((state) => state.approveRecommendation);
  const rejectRecommendation = useTrafficStore((state) => state.rejectRecommendation);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  const cards = useMemo(() => recommendations.length > 0 ? recommendations : [
    { id: 'stub-1', junctionId: 'stadium_jn', action: 'Increase green phase by 20 seconds', reduction_pct: 32, confidence: 0.96, priority: 'critical', status: 'pending', new_green_n: 42, new_green_s: 40, new_green_e: 18, new_green_w: 18 },
    { id: 'stub-2', junctionId: 'palayam_jn', action: 'Divert traffic via alternate corridor', reduction_pct: 24, confidence: 0.9, priority: 'high', status: 'pending', new_green_n: 30, new_green_s: 30, new_green_e: 20, new_green_w: 20 },
    { id: 'stub-3', junctionId: 'bus_stand_jn', action: 'Activate emergency priority mode', reduction_pct: 37, confidence: 0.98, priority: 'critical', status: 'pending', new_green_n: 50, new_green_s: 46, new_green_e: 16, new_green_w: 16 },
  ], [recommendations]);

  const visibleCards = cards.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return item.status === 'pending';
    if (filter === 'Approved') return item.status === 'approved';
    return item.priority === 'critical';
  });

  const cardList = (
    <>
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3 text-[12px]">
        {filters.map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)}
            className={`shrink-0 rounded-[6px] border px-3 py-1 ${filter === item ? 'border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--text)]' : 'border-[var(--border)] text-[var(--muted)]'}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {visibleCards.map((item) => (
          <div key={item.id} className="rounded-[10px] border border-[var(--border)] p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">{item.priority}</div>
                <div className="mt-1 text-[13px] font-medium">{item.action}</div>
              </div>
              <Badge tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warn'}>{item.status}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MetricCard label="Reduction" value={`${item.reduction_pct}%`} />
              <MetricCard label="Confidence" value={`${Math.round(item.confidence * 100)}%`} />
              <div className="col-span-2">
                <MetricCard label="Signal N/S/E/W" value={`${item.new_green_n}/${item.new_green_s}/${item.new_green_e}/${item.new_green_w}`} />
              </div>
            </div>
            {/* Mobile: full-width stacked buttons for easy tapping */}
            <div className="mt-3 flex gap-2 lg:flex-wrap">
              <button type="button" onClick={() => previewRecommendation(item.junctionId)}
                className="flex-1 rounded-[6px] border border-[var(--border)] px-3 py-2.5 text-[12px] font-medium lg:flex-none lg:py-2">
                Preview
              </button>
              <button type="button" onClick={() => approveRecommendation(item.junctionId)}
                className="flex-1 rounded-[6px] border border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-2.5 text-[12px] font-medium text-[var(--accent)] lg:flex-none lg:py-2">
                Approve
              </button>
              <button type="button" onClick={() => rejectRecommendation(item.junctionId)}
                className="flex-1 rounded-[6px] border border-[var(--danger)] bg-[color:color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2.5 text-[12px] font-medium text-[var(--danger)] lg:flex-none lg:py-2">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP: right-side panel over map ── */}
      <div className="absolute inset-0 hidden lg:flex">
        <div className="w-[58%] min-w-0" />
        <div className="pointer-events-none w-[42%] p-3">
          <Panel title="Measures" subtitle="Decision support" className="pointer-events-auto h-[calc(100vh-96px)] overflow-y-auto">
            {cardList}
          </Panel>
        </div>
      </div>

      {/* ── MOBILE: full-screen scrollable ── */}
      <div className="pointer-events-auto absolute inset-0 flex flex-col bg-[var(--surface)] lg:hidden">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <div className="text-[14px] font-semibold">Measures</div>
          <div className="text-[12px] text-[var(--muted)]">Decision support</div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24">
          {cardList}
        </div>
      </div>
    </>
  );
}
