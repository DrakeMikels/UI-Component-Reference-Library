import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Search, Sun } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { componentEntries, componentTags, featuredComponentIds } from '../data/components';
import { useHotkeys } from '../hooks/useHotkeys';
import { useTheme } from '../hooks/useTheme';
import { PaletteAction } from '../types';
import { classNames } from '../utils/classNames';
import { DESIGN_SYSTEM_QUERY_KEY, getRouteQueryKey, getScopedQuery, LEGACY_QUERY_KEY } from '../utils/query';

import { CommandPalette } from './CommandPalette';

const navItems = [
  { label: 'Components', to: '/components' },
  { label: 'Design Systems', to: '/design-systems' },
  { label: 'About', to: '/about' }
];

const paletteFilterTags = componentTags.filter((tag) =>
  ['Accessibility', 'Forms', 'Data', 'Navigation', 'React', 'Tailwind', 'Search', 'Workflow'].includes(tag)
);

export const AppShell = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const animationKey = location.pathname === '/' ? '/components' : location.pathname;

  const routeQueryKey = useMemo(() => getRouteQueryKey(location.pathname), [location.pathname]);
  const query = getScopedQuery(searchParams, routeQueryKey);
  const searchPlaceholder =
    routeQueryKey === DESIGN_SYSTEM_QUERY_KEY ? 'Search design systems' : routeQueryKey === LEGACY_QUERY_KEY ? 'Search' : 'Search components';

  const onPaletteShortcut = useCallback((event: KeyboardEvent) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k', []);
  const openPalette = useCallback(() => setIsPaletteOpen(true), []);

  useHotkeys(onPaletteShortcut, openPalette);

  const updateQuery = (value: string) => {
    const next = new URLSearchParams(searchParams);
    const trimmed = value.trim();

    if (trimmed) {
      next.set(routeQueryKey, trimmed);
    } else {
      next.delete(routeQueryKey);
    }

    if (routeQueryKey !== LEGACY_QUERY_KEY) {
      next.delete(LEGACY_QUERY_KEY);
    }

    setSearchParams(next, { replace: true });
  };

  const featuredActions = useMemo(() => {
    const featured = featuredComponentIds
      .map((id) => componentEntries.find((entry) => entry.id === id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    return featured.map<PaletteAction>((component) => ({
      id: `component-${component.id}`,
      label: component.name,
      subtitle: `Open component profile • ${component.exampleCount} examples`,
      type: 'component',
      run: () => navigate(`/components?focus=${component.id}`)
    }));
  }, [navigate]);

  const routeActions = useMemo<PaletteAction[]>(
    () => [
      {
        id: 'route-components',
        label: 'Go to Components',
        subtitle: 'Browse the interactive component catalog',
        type: 'route',
        run: () => navigate('/components')
      },
      {
        id: 'route-design-systems',
        label: 'Go to Design Systems',
        subtitle: 'Explore system-level metadata and coverage',
        type: 'route',
        run: () => navigate('/design-systems')
      },
      {
        id: 'route-about',
        label: 'Go to About',
        subtitle: 'See methodology, scope, and contribution guide',
        type: 'route',
        run: () => navigate('/about')
      }
    ],
    [navigate]
  );

  const filterActions = useMemo(
    () =>
      paletteFilterTags.map<PaletteAction>((tag) => ({
        id: `filter-${tag.toLowerCase()}`,
        label: `Filter components by ${tag}`,
        subtitle: 'Apply a catalog filter and jump to the Components tab',
        type: 'filter',
        run: () => navigate(`/components?tags=${encodeURIComponent(tag)}`)
      })),
    [navigate]
  );

  const actions = useMemo(() => [...routeActions, ...filterActions, ...featuredActions], [featuredActions, filterActions, routeActions]);

  return (
    <div className="min-h-full swiss-page-bg">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b-2 border-ink-300 bg-ink-50/95 backdrop-blur-sm dark:border-ink-700 dark:bg-ink-900/95">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-0 px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-3 py-4 md:gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-ink-500 dark:text-ink-400">Reference Index</p>
              <h1 className="font-display text-3xl tracking-tight text-ink-900 dark:text-ink-50">Component Atlas</h1>
            </div>

            <label
              htmlFor="global-search"
              className="ml-auto flex min-w-[240px] flex-1 items-center gap-2 border border-ink-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-pine-500 dark:border-ink-700 dark:bg-ink-950 md:max-w-md"
            >
              <Search className="h-4 w-4 text-ink-500 dark:text-ink-400" aria-hidden="true" />
              <span className="sr-only">{searchPlaceholder}</span>
              <input
                id="global-search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500 dark:text-ink-100 dark:placeholder:text-ink-400"
              />
              <kbd className="hidden items-center gap-1 border border-ink-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:border-ink-700 dark:text-ink-400 sm:inline-flex">
                Ctrl/Cmd+K
              </kbd>
            </label>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="inline-flex h-10 w-10 items-center justify-center border border-ink-300 bg-white text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-wrap gap-0 border-t border-ink-300 dark:border-ink-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'border-r border-ink-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700',
                    isActive
                      ? 'bg-ink-900 text-ink-50 dark:bg-ink-100 dark:text-ink-900'
                      : 'bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="content" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 md:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <CommandPalette actions={actions} open={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
};
