export function SkeletonRect({ className = '' }: { className?: string }) {
  return <div className={`animate-[shimmer_1.5s_infinite] rounded-[6px] bg-[color:color-mix(in_srgb,var(--border)_82%,var(--surface))] ${className}`} />;
}
export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-panel">
      <div className="h-3 w-28 rounded-full bg-slate-200" />
      <div className="mt-4 h-7 w-1/2 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />
    </div>
  );
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return <div className="h-4 rounded-full bg-slate-200" style={{ width }} />;
}
