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
    <div className="min-h-full bg-ink-50 dark:bg-ink-900">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur-sm dark:border-ink-800 dark:bg-ink-950/95">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 md:gap-4 md:px-6">
          <h1 className="shrink-0 font-display text-xl tracking-tight text-ink-900 dark:text-ink-50">
            Component Atlas
          </h1>

          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 sm:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'rounded px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500',
                    isActive
                      ? 'bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-ink-50'
                      : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <label
            htmlFor="global-search"
            className="ml-auto flex min-w-0 flex-1 items-center gap-2 border border-ink-200 bg-ink-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 sm:max-w-xs md:max-w-sm"
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-ink-400 dark:text-ink-500" aria-hidden="true" />
            <span className="sr-only">{searchPlaceholder}</span>
            <input
              id="global-search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-100 dark:placeholder:text-ink-500"
            />
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-ink-200 px-1.5 py-0.5 text-[10px] text-ink-400 dark:border-ink-700 dark:text-ink-500 sm:inline-flex">
              ⌘K
            </kbd>
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
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
