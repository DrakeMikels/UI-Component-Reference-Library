import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DesignSystemCard } from '../components/DesignSystemCard';
import { DesignSystemDetailModal } from '../components/DesignSystemDetailModal';
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
  [
    'React',
    'Tailwind',
    'TypeScript',
    'Design Tokens',
    'Web Components',
    'Vue',
    'Storybook',
    'Sass',
    'CSS Variables'
  ].includes(technology)
);

export const DesignSystemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const focusId = searchParams.get('focus');

  useEffect(() => {
    if (focusId && designSystemEntries.some((s) => s.id === focusId)) {
      setActiveId(focusId);
    }
  }, [focusId]);

  const openSystem = (id: string) => {
    setActiveId(id);
    const next = new URLSearchParams(searchParams);
    next.set('focus', id);
    setSearchParams(next, { replace: true });
  };

  const closeModal = () => {
    setActiveId(null);
    const next = new URLSearchParams(searchParams);
    next.delete('focus');
    setSearchParams(next, { replace: true });
  };

  const selectedSystem = useMemo(
    () => designSystemEntries.find((s) => s.id === activeId) ?? null,
    [activeId]
  );

  const query = getScopedQuery(searchParams, DESIGN_SYSTEM_QUERY_KEY).trim().toLowerCase();
  const sort = toDesignSystemSort(searchParams.get('sort'));
  const selectedTech = parseList(searchParams.get('stack'));
  const hasQuery = query.length > 0;
  const hasTechFilters = selectedTech.length > 0;

  const filteredSystems = useMemo(() => {
    const matchesSearch = (system: (typeof designSystemEntries)[number]): boolean => {
      if (!query) {
        return true;
      }

      const haystack = [system.name, system.owner, system.description, system.technologies.join(' '), system.highlights.join(' ')]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    };

    const matchesTech = (system: (typeof designSystemEntries)[number]): boolean => {
      if (selectedTech.length === 0) {
        return true;
      }

      const tech = new Set(system.technologies);
      return selectedTech.every((needle) => tech.has(needle));
    };

    return designSystemEntries
      .filter((system) => matchesSearch(system) && matchesTech(system))
      .slice()
      .sort((left, right) => {
        if (sort === 'name') {
          return left.name.localeCompare(right.name);
        }

        if (sort === 'components') {
          return right.componentCount - left.componentCount;
        }

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

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(DESIGN_SYSTEM_QUERY_KEY);
    next.delete(LEGACY_QUERY_KEY);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('stack');
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('stack');
    next.delete(DESIGN_SYSTEM_QUERY_KEY);
    next.delete(LEGACY_QUERY_KEY);
    setSearchParams(next, { replace: true });
  };

  return (
    <section aria-label="Design systems catalog" className="space-y-8">
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="swiss-grid-panel overflow-hidden border-2 border-ink-300 bg-white p-6 dark:border-ink-700 dark:bg-ink-900 md:p-10"
      >
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">System Mapping</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 dark:text-ink-50 md:text-6xl">
          Compare design systems by coverage, openness, and implementation stack.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-700 dark:text-ink-200 md:text-base">
          This index is tuned for product teams evaluating system fit. Sort by breadth, component inventory, and technology stack to shortlist systems aligned with your constraints.
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
            >
              <option value="coverage">Coverage Score</option>
              <option value="components">Component Count</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Tech filters</p>
          <div className="flex flex-wrap gap-2">
            {featuredTechFilters.map((technology) => (
              <TagChip
                key={technology}
                label={technology}
                active={selectedTech.includes(technology)}
                onClick={() => toggleTech(technology)}
              />
            ))}
            {selectedTech.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                }}
                className="border border-ink-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <motion.section layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {filteredSystems.length > 0 ? (
          filteredSystems.map((system) => <DesignSystemCard key={system.id} system={system} onSelect={openSystem} />)
        ) : (
          <article className="col-span-full border border-dashed border-ink-200 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">No Results</p>
            <h3 className="mt-2 font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">No design systems match this view.</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-700 dark:text-ink-300">
              Try clearing search and stack filters to restore the full catalog. This panel always appears when the result set is empty so the page never looks blank.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={clearSearch}
                disabled={!hasQuery}
                className="border border-ink-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                Clear search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasTechFilters}
                className="border border-ink-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                Clear filters
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="border border-ink-900 bg-ink-900 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-50 transition hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-ink-300"
              >
                Reset view
              </button>
            </div>
          </article>
        )}
      </motion.section>

      <DesignSystemDetailModal system={selectedSystem} onClose={closeModal} />
    </section>
  );
};
