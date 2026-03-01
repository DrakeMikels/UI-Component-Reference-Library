import { motion, useReducedMotion } from 'framer-motion';
import { DesignSystemEntry } from '../types';

interface DesignSystemCardProps {
  system: DesignSystemEntry;
}

export const DesignSystemCard = ({ system }: DesignSystemCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      className="border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl leading-tight tracking-tight text-ink-900 dark:text-ink-50">{system.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">{system.owner}</p>
        </div>
        <span
          className={[
            'border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
            system.openSource
              ? 'border-ink-900 bg-ink-900 text-ink-50 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900'
              : 'border-ink-300 bg-ink-100 text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200'
          ].join(' ')}
        >
          {system.openSource ? 'Open source' : 'Closed source'}
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
    </motion.article>
  );
};
