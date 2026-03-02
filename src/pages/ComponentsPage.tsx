import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComponentCard } from '../components/ComponentCard';
import { ComponentDetailModal } from '../components/ComponentDetailModal';
import { TagChip } from '../components/ui/TagChip';
import { StatTile } from '../components/ui/StatTile';
import { componentEntries, componentTags } from '../data/components';
import { designSystemEntries } from '../data/designSystems';
import { ComponentEntry } from '../types';
import { COMPONENT_QUERY_KEY, getScopedQuery, parseList, serializeList, toComponentSort } from '../utils/query';

const featuredFilterTags = componentTags.filter((tag) =>
  [
    'Accessibility',
    'Action',
    'Data',
    'Filters',
    'Forms',
    'Navigation',
    'Search',
    'Workflow',
    'React',
    'Tailwind',
    'ARIA',
    'Framer Motion'
  ].includes(tag)
);

export const ComponentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  const query = getScopedQuery(searchParams, COMPONENT_QUERY_KEY).toLowerCase();
  const selectedTags = parseList(searchParams.get('tags'));
  const sort = toComponentSort(searchParams.get('sort'));
  const focusId = searchParams.get('focus');

  useEffect(() => {
    if (focusId && componentEntries.some((entry) => entry.id === focusId)) {
      setActiveId(focusId);
    }
  }, [focusId]);

  const filteredComponents = useMemo(() => {
    const matchesQuery = (component: ComponentEntry): boolean => {
      if (!query.trim()) {
        return true;
      }

      const haystack = [
        component.name,
        component.description,
        component.aliases.join(' '),
        component.tags.join(' '),
        component.technologies.join(' ')
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query.trim());
    };

    const matchesTags = (component: ComponentEntry): boolean => {
      if (selectedTags.length === 0) {
        return true;
      }

      const bag = new Set([...component.tags, ...component.technologies]);
      return selectedTags.every((tag) => bag.has(tag));
    };

    const result = componentEntries.filter((component) => matchesQuery(component) && matchesTags(component));

    return result.slice().sort((left, right) => {
      if (sort === 'name') {
        return left.name.localeCompare(right.name);
      }

      if (sort === 'examples') {
        return right.exampleCount - left.exampleCount;
      }

      return right.popularity - left.popularity;
    });
  }, [query, selectedTags, sort]);

  const stats = useMemo(
    () => ({
      components: componentEntries.length,
      designSystems: designSystemEntries.length,
      examples: componentEntries.reduce((total, component) => total + component.exampleCount, 0)
    }),
    []
  );

  const selectedComponent = useMemo(
    () => componentEntries.find((component) => component.id === activeId) ?? null,
    [activeId]
  );

  const relatedComponents = useMemo(() => {
    if (!selectedComponent) {
      return [];
    }

    return selectedComponent.relatedIds
      .map((id) => componentEntries.find((component) => component.id === id))
      .filter((component): component is ComponentEntry => Boolean(component));
  }, [selectedComponent]);

  const toggleTag = (tag: string) => {
    const next = new URLSearchParams(searchParams);
    const current = new Set(selectedTags);

    if (current.has(tag)) {
      current.delete(tag);
    } else {
      current.add(tag);
    }

    const list = Array.from(current);

    if (list.length > 0) {
      next.set('tags', serializeList(list));
    } else {
      next.delete('tags');
    }

    setSearchParams(next, { replace: true });
  };

  const openComponent = (id: string) => {
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

  return (
    <section aria-label="Components catalog" className="space-y-8">
      <motion.section
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="relative overflow-hidden border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900 md:p-10"
      >
        <div className="relative z-10 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">Interactive Catalog</p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink-900 dark:text-ink-50 md:text-6xl">
            Explore components through practical metadata, not screenshots alone.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-200 md:text-base">
            Compare naming conventions, discover implementation clues, and reference usage patterns across modern UI stacks. Search, filter, and share a specific state via URL parameters.
          </p>
        </div>
        <div className="mt-6 h-px bg-ink-300 dark:bg-ink-700" />
        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
          <StatTile label="Components" value={String(stats.components)} tone="accent" />
          <StatTile label="Design Systems" value={String(stats.designSystems)} />
          <StatTile label="Examples Indexed" value={String(stats.examples)} />
        </div>
      </motion.section>

      <section className="space-y-4 border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-display text-2xl tracking-tight text-ink-900 dark:text-ink-50">Component Index</h3>
            <p className="text-sm text-ink-600 dark:text-ink-300">{filteredComponents.length} results in current view</p>
          </div>
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
              aria-label="Sort component results"
            >
              <option value="popularity">Popularity</option>
              <option value="name">Name</option>
              <option value="examples">Examples Count</option>
            </select>
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Filter chips</p>
          <div className="flex flex-wrap gap-2">
            {featuredFilterTags.map((tag) => (
              <TagChip key={tag} label={tag} active={selectedTags.includes(tag)} onClick={() => toggleTag(tag)} />
            ))}
            {selectedTags.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('tags');
                  setSearchParams(next, { replace: true });
                }}
                className="border border-ink-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <motion.section
        layout
        className="flex flex-col [&>article+article]:-mt-px"
        aria-live="polite"
        aria-label="Component result cards"
      >
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component) => <ComponentCard key={component.id} component={component} onSelect={openComponent} />)
        ) : (
          <article className="border border-dashed border-ink-200 bg-white p-8 text-center text-sm text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300">
            No components match the current search and filter set. Try removing a tag or broadening your search query.
          </article>
        )}
      </motion.section>

      <ComponentDetailModal
        component={selectedComponent}
        relatedComponents={relatedComponents}
        onClose={closeModal}
        onSelectRelated={openComponent}
      />
    </section>
  );
};
