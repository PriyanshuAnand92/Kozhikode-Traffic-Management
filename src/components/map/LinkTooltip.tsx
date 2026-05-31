type HoverMetric = { label: string; value: string };

export function LinkTooltip({
  title,
  body,
  metrics,
  x,
  y,
}: {
  title: string;
  body?: string;
  metrics?: HoverMetric[];
  x: number;
  y: number;
}) {
  return (
    <div style={{ left: x + 14, top: y + 14 }} className="pointer-events-none absolute z-30 min-w-[220px] max-w-[300px] rounded-[10px] border border-slate-800 bg-slate-950 px-3 py-2 text-[13px] text-slate-100 shadow-lg shadow-black/40">
      <div className="text-[14px] font-semibold leading-5 text-amber-300">{title}</div>
      {metrics && metrics.length > 0 ? (
        <div className="mt-2 space-y-1.5 text-[12px] leading-4 text-slate-300">
          {metrics.map((metric) => (
            <div key={metric.label} className="grid grid-cols-[1fr_auto] gap-3">
              <span>{metric.label}</span>
              <span className="font-medium text-slate-100">{metric.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-1 text-[12px] leading-5 text-slate-300">{body}</div>
      )}
    </div>
  );
}
