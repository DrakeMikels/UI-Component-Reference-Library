import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { DSRadius, DesignSystemEntry } from '../types';

interface DesignSystemCardProps {
  system: DesignSystemEntry;
  onSelect: (id: string) => void;
}

const radiusPx: Record<DSRadius, number> = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999
};

const ScreenshotPreview = ({ system }: { system: DesignSystemEntry }) => {
  const [failed, setFailed] = useState(false);

  if (!system.docsUrl || failed) {
    return <GeneratedPreview system={system} />;
  }

  return (
    <div className="relative mb-4 h-36 overflow-hidden border border-ink-200 bg-ink-100 dark:border-ink-700 dark:bg-ink-800">
      <img
        src={`https://image.thum.io/get/width/600/crop/400/${system.docsUrl}`}
        alt={`${system.name} documentation`}
        className="h-full w-full object-cover object-top"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const GeneratedPreview = ({ system }: { system: DesignSystemEntry }) => {
  const r = radiusPx[system.radius];
  const btnR = `${r}px`;
  const inputR = `${Math.min(r, 6)}px`;

  return (
    <div className="mb-4 h-36 overflow-hidden border border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-950">
      {/* Nav bar */}
      <div style={{ background: system.accent }} className="flex h-8 shrink-0 items-center gap-2 px-3">
        <span className="h-3 w-3 rounded-full bg-white/30" />
        {['Home', 'Components', 'Docs'].map((item, index) => (
          <span
            key={item}
            style={{
              background: index === 1 ? 'rgba(255,255,255,0.22)' : 'transparent',
              borderRadius: `${Math.min(r, 4)}px`,
              color: system.accentFg
            }}
            className="px-2 py-0.5 text-[9px] font-semibold"
          >
            {item}
          </span>
        ))}
        <span className="ml-auto h-4 w-4 rounded-full bg-white/25" />
      </div>

      {/* Buttons row */}
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <span style={{ background: system.accent, color: system.accentFg, borderRadius: btnR }} className="px-2.5 py-1 text-[9px] font-semibold">
          Primary
        </span>
        <span style={{ border: `1.5px solid ${system.accent}`, color: system.accent, borderRadius: btnR }} className="px-2.5 py-1 text-[9px] font-semibold">
          Secondary
        </span>
        <span style={{ color: system.accent }} className="px-1 py-1 text-[9px] font-semibold">
          Link
        </span>
      </div>

      {/* Input row */}
      <div className="px-3 pt-2">
        <div style={{ borderRadius: inputR }} className="flex h-6 items-center gap-1.5 border border-ink-300 bg-white px-2 dark:border-ink-600 dark:bg-ink-900">
          <span className="h-2.5 w-2.5 rounded-full border border-ink-400 dark:border-ink-500" />
          <span className="flex-1 text-[9px] text-ink-400 dark:text-ink-500">Search…</span>
          <span
            style={{ background: system.accent, color: system.accentFg, borderRadius: `${Math.min(r, 3)}px` }}
            className="px-1.5 py-0.5 text-[8px] font-semibold"
          >
            Go
          </span>
        </div>
      </div>
    </div>
  );
};

export const DesignSystemCard = ({ system, onSelect }: DesignSystemCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900"
    >
      <button
        type="button"
        onClick={() => onSelect(system.id)}
        className="absolute inset-0 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900"
        aria-label={`Open details for ${system.name}`}
      />

      <ScreenshotPreview system={system} />

      <div className="pointer-events-none relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl leading-tight tracking-tight text-ink-900 dark:text-ink-50">{system.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">{system.owner}</p>
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
        <p className="mt-3 text-sm leading-relaxed text-ink-700 dark:text-ink-200">{system.description}</p>
        <div className="mt-4 h-px bg-ink-300 dark:bg-ink-700" />

        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="border border-ink-300 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Coverage</dt>
            <dd className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{system.coverageScore}</dd>
          </div>
          <div className="border border-ink-300 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Components</dt>
            <dd className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{system.componentCount}</dd>
          </div>
          <div className="border border-ink-300 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
            <dt className="text-[10px] uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Stack</dt>
            <dd className="mt-1 font-semibold text-ink-900 dark:text-ink-50">{system.technologies.length}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {system.technologies.map((technology) => (
            <span
              key={`${system.id}-${technology}`}
              className="border border-ink-300 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>

      {system.docsUrl && (
        <a
          href={system.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto relative z-40 mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500 transition hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-ink-400 dark:hover:text-ink-50"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          View Docs
        </a>
      )}
    </motion.article>
  );
};
