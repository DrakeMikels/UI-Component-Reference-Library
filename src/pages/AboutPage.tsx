import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-label="About this project" className="space-y-8">
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="swiss-grid-panel overflow-hidden border-2 border-ink-300 bg-white p-6 dark:border-ink-700 dark:bg-ink-900 md:p-10"
      >
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">Open Source</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 dark:text-ink-50 md:text-6xl">
          Built for developers, by developers.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 dark:text-ink-200 md:text-base">
          Component Atlas is a free, open source reference for UI components and design systems. No accounts, no
          paywalls — just a fast, searchable catalog to help you build better products.
        </p>
        <div className="mt-6 h-px bg-ink-300 dark:bg-ink-700" />
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Components</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            55+ UI components with live previews, usage notes, and cross-library references. Search and filter by
            stack, tag, or keyword.
          </p>
        </article>
        <article className="border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Design Systems</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            A curated directory of open source design systems. Compare by stack, component count, and coverage.
            Click any card to go straight to the docs.
          </p>
        </article>
        <article className="border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Contribute</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            Found something missing? PRs are welcome. Add components, fix data, or improve the catalog. This is a
            community resource.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pine-700 underline decoration-amberline decoration-2 underline-offset-4 transition hover:text-pine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-pine-300 dark:hover:text-pine-200"
          >
            View on GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>
      </section>
    </section>
  );
};
