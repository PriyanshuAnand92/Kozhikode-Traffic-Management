import type { ReactNode } from 'react';

export function Panel({ title, subtitle, eyebrow, action, children, className = '' }: { title?: string; subtitle?: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[10px] border border-[var(--border)] bg-[var(--surface)] ${className}`}>
      {(title || subtitle || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div>
            {eyebrow ? <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">{eyebrow}</div> : subtitle ? <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">{subtitle}</div> : null}
            {title ? <h2 className="mt-1 text-[14px] font-medium text-[var(--text)]">{title}</h2> : null}
          </div>
          {action}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
