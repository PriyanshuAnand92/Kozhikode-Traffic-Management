export function MetricCard({
  label, value, detail, tone = 'default',
}: {
  label: string; value: string; detail?: string;
  tone?: 'default' | 'success' | 'warn' | 'warning' | 'danger';
}) {
  const toneClass =
    tone === 'success' ? 'text-[var(--success)]' :
    tone === 'warn' || tone === 'warning' ? 'text-[var(--warn)]' :
    tone === 'danger' ? 'text-[var(--danger)]' :
    'text-[var(--accent)]';

  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] leading-tight">{label}</div>
      {/* Value: clamp so long strings like 42/40/18/18 never overflow */}
      <div className={`mt-1.5 text-[clamp(14px,4vw,22px)] font-semibold tabular-nums break-all leading-tight ${toneClass}`}>
        {value}
      </div>
      {detail ? <div className="mt-1 text-[11px] leading-4 text-[var(--muted)]">{detail}</div> : null}
    </div>
  );
}
