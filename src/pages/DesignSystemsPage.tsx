import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DesignSystemCard } from '../components/DesignSystemCard';
import { TagChip } from '../components/ui/TagChip';
import { designSystemEntries, designSystemTechnologies } from '../data/designSystems';
import {
  DESIGN_SYSTEM_QUERY_KEY,
  LEGACY_QUERY_KEY,
  getScopedQuery,
  parseList,
  serializeList,
  toDesignSystemSort
} from '../utils/query';

const featuredTechFilters = designSystemTechnologies.filter((technology) =>
  ['React', 'Vue', 'Tailwind', 'TypeScript', 'Web Components', 'Design Tokens', 'Storybook', 'Sass'].includes(technology)
);

export const DesignSystemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const query = getScopedQuery(searchParams, DESIGN_SYSTEM_QUERY_KEY).trim().toLowerCase();
  const sort = toDesignSystemSort(searchParams.get('sort'));
  const selectedTech = parseList(searchParams.get('stack'));
  const hasQuery = query.length > 0;
  const hasTechFilters = selectedTech.length > 0;

  const filteredSystems = useMemo(() => {
    const matchesSearch = (system: (typeof designSystemEntries)[number]): boolean => {
      if (!query) return true;
      const haystack = [system.name, system.owner, system.description, system.technologies.join(' '), system.highlights.join(' ')]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    };

    const matchesTech = (system: (typeof designSystemEntries)[number]): boolean => {
      if (selectedTech.length === 0) return true;
      const tech = new Set(system.technologies);
      return selectedTech.every((needle) => tech.has(needle));
    };

    return designSystemEntries
      .filter((system) => matchesSearch(system) && matchesTech(system))
      .slice()
      .sort((left, right) => {
        if (sort === 'name') return left.name.localeCompare(right.name);
        if (sort === 'components') return right.componentCount - left.componentCount;
        return right.coverageScore - left.coverageScore;
      });
  }, [query, selectedTech, sort]);

  const toggleTech = (technology: string) => {
    const next = new URLSearchParams(searchParams);
    const selected = new Set(selectedTech);
    if (selected.has(technology)) {
      selected.delete(technology);
    } else {
      selected.add(technology);
    }
    const list = Array.from(selected);
    if (list.length > 0) {
      next.set('stack', serializeList(list));
    } else {
      next.delete('stack');
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('stack');
    next.delete(DESIGN_SYSTEM_QUERY_KEY);
    next.delete(LEGACY_QUERY_KEY);
    setSearchParams(next, { replace: true });
  };

  return (
    <section aria-label="Design systems directory" className="space-y-8">
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="swiss-grid-panel overflow-hidden border-2 border-ink-300 bg-white p-6 dark:border-ink-700 dark:bg-ink-900 md:p-10"
      >
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">Open Source Directory</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 dark:text-ink-50 md:text-6xl">
          Open source design systems, indexed.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-700 dark:text-ink-200 md:text-base">
          Browse and compare component libraries by stack, component count, and coverage. Click any card to go directly to the docs.
        </p>
        <div className="mt-6 h-px bg-ink-300 dark:bg-ink-700" />
      </motion.section>

      <section className="space-y-4 border-2 border-ink-300 bg-white p-4 dark:border-ink-700 dark:bg-ink-900 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-ink-600 dark:text-ink-300">{filteredSystems.length} systems in current view</p>
          <label className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
            Sort by
            <select
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                next.set('sort', event.target.value);
                setSearchParams(next, { replace: true });
              }}
              className="border border-ink-300 bg-white px-2 py-1 text-sm text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100"
              aria-label="Sort design system results"
            >
              <option value="coverage">Coverage Score</option>
              <option value="components">Component Count</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Filter by stack</p>
          <div className="flex flex-wrap gap-2">
            {featuredTechFilters.map((technology) => (
              <TagChip
                key={technology}
                label={technology}
                active={selectedTech.includes(technology)}
                onClick={() => toggleTech(technology)}
              />
            ))}
            {(hasTechFilters || hasQuery) ? (
              <button
                type="button"
                onClick={clearFilters}
                className="border border-ink-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <motion.section layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite" aria-label="Design system cards">
        {filteredSystems.length > 0 ? (
          filteredSystems.map((system) => <DesignSystemCard key={system.id} system={system} />)
        ) : (
          <article className="col-span-full border border-dashed border-ink-200 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">No Results</p>
            <h3 className="mt-2 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">No systems match this view.</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink-700 dark:text-ink-300">Try clearing the stack filters or search term.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 border border-ink-900 bg-ink-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-50 transition hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900"
            >
              Reset view
            </button>
          </article>
        )}
      </motion.section>
    </section>
  );
};
