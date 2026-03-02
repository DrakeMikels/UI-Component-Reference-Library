import { DSRadius, DesignSystemEntry } from '../types';
import { Modal } from './ui/Modal';

interface DesignSystemDetailModalProps {
  system: DesignSystemEntry | null;
  onClose: () => void;
}

const radiusPx: Record<DSRadius, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999
};

const DesignSystemFullPreview = ({ system }: { system: DesignSystemEntry }) => {
  const r = radiusPx[system.radius];
  const btnR = `${r}px`;
  const inputR = `${Math.min(r, 6)}px`;
  const navItemR = `${Math.min(r, 4)}px`;
  const badgeR = `${Math.min(r, 12)}px`;
  const containerR = `${Math.min(r, 8)}px`;

  const rows = [
    { label: system.technologies[0] ?? 'Core', status: 'Stable', meta: system.highlights[0]?.split(' ').slice(0, 2).join(' ') ?? 'Base' },
    { label: system.technologies[1] ?? 'Patterns', status: 'Beta', meta: system.highlights[1]?.split(' ').slice(0, 2).join(' ') ?? 'Pattern' },
    { label: system.technologies[2] ?? 'Tokens', status: 'Stable', meta: system.highlights[2]?.split(' ').slice(0, 2).join(' ') ?? 'Token' }
  ];

  return (
    <div
      className="overflow-hidden border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900"
      style={{ borderRadius: containerR }}
    >
      {/* App header */}
      <div style={{ background: system.accent }} className="flex h-10 items-center gap-3 px-4">
        <span className="h-4 w-4 rounded-full bg-white/30" />
        <span className="text-[11px] font-bold tracking-wide" style={{ color: system.accentFg }}>
          {system.name}
        </span>
        {['Components', 'Patterns', 'Tokens', 'Resources'].map((item) => (
          <span key={item} className="text-[10px]" style={{ color: system.accentFg, opacity: 0.75 }}>
            {item}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 border-b border-ink-200 bg-ink-50 px-4 py-1.5 text-[10px] dark:border-ink-700 dark:bg-ink-950">
        <span className="text-ink-500 dark:text-ink-400">Docs</span>
        <span className="text-ink-400">/</span>
        <span style={{ color: system.accent }}>Components</span>
        <span className="text-ink-400">/</span>
        <span className="font-medium text-ink-700 dark:text-ink-200">Overview</span>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-32 shrink-0 border-r border-ink-200 p-2 dark:border-ink-700">
          {['Overview', 'Usage', 'Props', 'Tokens', 'Examples', 'Changelog'].map((item, index) => (
            <div
              key={item}
              style={
                index === 0
                  ? { background: `${system.accent}18`, color: system.accent, borderRadius: navItemR }
                  : {}
              }
              className={`mb-0.5 px-2 py-1.5 text-[10px] ${index === 0 ? 'font-semibold' : 'text-ink-500 dark:text-ink-400'}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {/* Table header */}
          <div className="mb-2 grid grid-cols-3 border-b border-ink-200 pb-1.5 text-[9px] font-semibold uppercase tracking-wider text-ink-500 dark:border-ink-700 dark:text-ink-400">
            <span>Technology</span>
            <span>Status</span>
            <span>Category</span>
          </div>

          {/* Table rows */}
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 items-center border-b border-ink-100 py-2 text-[10px] dark:border-ink-800"
            >
              <span className="font-medium text-ink-700 dark:text-ink-200">{row.label}</span>
              <span>
                <span
                  style={{
                    background: `${system.accent}20`,
                    color: system.accent,
                    borderRadius: badgeR
                  }}
                  className="px-1.5 py-0.5 text-[9px] font-semibold"
                >
                  {row.status}
                </span>
              </span>
              <span className="text-ink-500 dark:text-ink-400">{row.meta}</span>
            </div>
          ))}

          {/* Form row */}
          <div className="mt-3 flex items-center gap-2">
            <div
              style={{ borderRadius: inputR }}
              className="flex h-7 flex-1 items-center border border-ink-300 bg-white px-2 dark:border-ink-600 dark:bg-ink-900"
            >
              <span className="text-[10px] text-ink-400 dark:text-ink-500">Filter components…</span>
            </div>
            <span
              style={{ background: system.accent, color: system.accentFg, borderRadius: btnR }}
              className="px-3 py-1 text-[10px] font-semibold"
            >
              Search
            </span>
            <span
              style={{ border: `1.5px solid ${system.accent}`, color: system.accent, borderRadius: btnR }}
              className="px-3 py-1 text-[10px] font-semibold"
            >
              Export
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DesignSystemDetailModal = ({ system, onClose }: DesignSystemDetailModalProps) => {
  if (!system) {
    return null;
  }

  return (
    <Modal title={system.name} open={Boolean(system)} onClose={onClose}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">{system.owner}</p>
            <h2 className="mt-1 font-display text-4xl tracking-tight text-ink-900 dark:text-ink-50">{system.name}</h2>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-200">{system.description}</p>
          </div>
          <span
            className={[
              'shrink-0 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
              system.openSource
                ? 'border-ink-900 bg-ink-900 text-ink-50 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900'
                : 'border-ink-300 bg-ink-100 text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200'
            ].join(' ')}
          >
            {system.openSource ? 'Open source' : 'Closed'}
          </span>
        </div>

        {/* Full-page mock preview */}
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Visual Preview</p>
          <DesignSystemFullPreview system={system} />
        </div>

        {/* Stats */}
        <dl className="grid grid-cols-3 gap-3">
          <div className="border border-ink-300 bg-ink-50 p-4 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Coverage Score</dt>
            <dd className="mt-1.5 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">{system.coverageScore}</dd>
          </div>
          <div className="border border-ink-300 bg-ink-50 p-4 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Components</dt>
            <dd className="mt-1.5 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">{system.componentCount}</dd>
          </div>
          <div className="border border-ink-300 bg-ink-50 p-4 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Stack</dt>
            <dd className="mt-1.5 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">{system.technologies.length}</dd>
          </div>
        </dl>

        {/* Highlights */}
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Highlights</p>
          <ul className="space-y-1.5">
            {system.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
              >
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: system.accent }}
                />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Technology Stack</p>
          <div className="flex flex-wrap gap-2">
            {system.technologies.map((technology) => (
              <span
                key={technology}
                className="border border-ink-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>

        {/* Docs link */}
        {system.docsUrl ? (
          <div className="border-t border-ink-300 pt-4 dark:border-ink-700">
            <a
              href={system.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-ink-900 bg-ink-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-50 transition hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-ink-300"
            >
              View Official Docs
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
