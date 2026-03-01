interface StatTileProps {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
}

export const StatTile = ({ label, value, tone = 'default' }: StatTileProps) => (
  <article
    className={[
      'border p-4',
      tone === 'accent'
        ? 'border-ink-900 bg-ink-900 text-ink-50 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900'
        : 'border-ink-300 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50'
    ].join(' ')}
  >
    <p className="text-[11px] uppercase tracking-[0.22em] text-ink-500 dark:text-ink-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
  </article>
);
