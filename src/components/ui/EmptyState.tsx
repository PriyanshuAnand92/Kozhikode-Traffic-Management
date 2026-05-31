interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center text-slate-600">
      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">No data available</div>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}
