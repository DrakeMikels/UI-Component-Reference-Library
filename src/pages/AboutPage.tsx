import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FaqAccordion } from '../components/FaqAccordion';

const faqItems = [
  {
    id: 'faq-1',
    question: 'How is this catalog structured?',
    answer:
      'Entries are modeled as typed records with aliases, use-case notes, and relationship links. This makes search, filtering, and command navigation deterministic and shareable by URL.'
  },
  {
    id: 'faq-2',
    question: 'Is the dataset production data?',
    answer:
      'The current dataset is high-fidelity mock content designed to feel real and support evaluation workflows. It can be swapped with API-backed data without changing the core UI architecture.'
  },
  {
    id: 'faq-3',
    question: 'How can a team contribute?',
    answer:
      'Contributions should include metadata quality checks, accessibility notes, and at least one practical example for each new component or design system entry.'
  },
  {
    id: 'faq-4',
    question: 'What was the visual direction?',
    answer:
      'The interface uses an editorial grid, restrained contrast, serif headline accents, and subtle motion to feel premium while preserving readability and scanning speed.'
  }
];

export const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-label="About this project" className="space-y-8">
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="rounded-3xl border border-ink-200/80 bg-white/80 p-6 shadow-card dark:border-ink-800 dark:bg-ink-900/75 md:p-10"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Purpose</p>
        <h2 className="mt-2 max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink-900 dark:text-ink-50 md:text-5xl">
          A reference-grade interface for evaluating components and design systems with context.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-700 dark:text-ink-200 md:text-base">
          The goal is practical decision support: quickly inspect naming, implementation signals, and coverage clues before committing to patterns across a product suite.
        </p>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-ink-200/80 bg-white/80 p-5 dark:border-ink-800 dark:bg-ink-900/70">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Methodology</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            We normalize metadata across each entry: aliases, tags, usage scenarios, and relational links. This creates consistent faceting and predictable command actions.
          </p>
        </article>
        <article className="rounded-2xl border border-ink-200/80 bg-white/80 p-5 dark:border-ink-800 dark:bg-ink-900/70">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Quality Bar</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            Every interaction aims for keyboard support, visible focus, semantic landmarks, and tasteful motion with reduced-motion preferences respected globally.
          </p>
        </article>
        <article className="rounded-2xl border border-ink-200/80 bg-white/80 p-5 dark:border-ink-800 dark:bg-ink-900/70">
          <h3 className="font-display text-2xl text-ink-900 dark:text-ink-50">Contribution</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-200">
            Add entries with concise metadata and a strong use-case signal. Keep naming stable, add related links, and preserve taxonomy consistency.
          </p>
          <a
            href="#contribute"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pine-700 underline decoration-amberline decoration-2 underline-offset-4 transition hover:text-pine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-pine-300 dark:hover:text-pine-200"
          >
            Open contribution guide <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>
      </section>

      <section
        id="contribute"
        aria-label="Contribution guide"
        className="scroll-mt-32 rounded-3xl border border-ink-200/80 bg-white/80 p-6 shadow-card dark:border-ink-800 dark:bg-ink-900/75 md:scroll-mt-36 md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Contribute</p>
        <h3 className="mt-2 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">Contribution Guide</h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700 dark:text-ink-200">
          Additions should improve decision quality, not just increase volume. Keep metadata consistent, attach realistic use-cases, and include enough context for search, filters, and related links to stay useful.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border border-ink-200/80 bg-white/85 p-4 dark:border-ink-700 dark:bg-ink-900/70">
            <h4 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Minimum entry quality</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-700 dark:text-ink-200">
              <li>Stable name, aliases, and tags aligned with existing taxonomy.</li>
              <li>Three practical use-cases written as task outcomes.</li>
              <li>Relevant related components that reflect real navigation paths.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-ink-200/80 bg-white/85 p-4 dark:border-ink-700 dark:bg-ink-900/70">
            <h4 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Before opening a PR</h4>
            <ul className="mt-2 space-y-1 text-sm text-ink-700 dark:text-ink-200">
              <li>Verify keyboard behavior and visible focus in interactive demos.</li>
              <li>Check card preview readability in both light/dark themes and mobile widths.</li>
              <li>Run the production build and confirm no route or URL-state regressions.</li>
            </ul>
          </article>
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">FAQ</h3>
        <FaqAccordion items={faqItems} />
      </section>
    </section>
  );
};
