import type { ReactNode } from 'react';

export function Badge({ children, tone = 'default', className = '' }: { children: ReactNode; tone?: 'default' | 'success' | 'warn' | 'danger' | 'accent'; className?: string }) {
  const classes =
    tone === 'success'
      ? 'bg-[color:color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] border-[color:color-mix(in_srgb,var(--success)_28%,var(--border))]'
      : tone === 'warn'
        ? 'bg-[color:color-mix(in_srgb,var(--warn)_12%,transparent)] text-[var(--warn)] border-[color:color-mix(in_srgb,var(--warn)_28%,var(--border))]'
        : tone === 'danger'
          ? 'bg-[color:color-mix(in_srgb,var(--danger)_12%,transparent)] text-[var(--danger)] border-[color:color-mix(in_srgb,var(--danger)_28%,var(--border))]'
          : tone === 'accent'
            ? 'bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color:color-mix(in_srgb,var(--accent)_28%,var(--border))]'
            : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums ${classes} ${className}`}>{children}</span>;
}
