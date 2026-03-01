import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PaletteAction } from '../types';

interface CommandPaletteProps {
  actions: PaletteAction[];
  open: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ actions, open, onClose }: CommandPaletteProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }

    inputRef.current?.focus();
  }, [open]);

  const filteredActions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return actions.slice(0, 14);
    }

    return actions
      .filter((action) => `${action.label} ${action.subtitle}`.toLowerCase().includes(normalized))
      .slice(0, 14);
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((previous) => (filteredActions.length === 0 ? 0 : (previous + 1) % filteredActions.length));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((previous) =>
          filteredActions.length === 0 ? 0 : (previous - 1 + filteredActions.length) % filteredActions.length
        );
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const selected = filteredActions[activeIndex];
        if (selected) {
          selected.run();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, filteredActions, onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink-900/55 p-4 pt-24 backdrop-blur-sm"
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            aria-label="Command palette"
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-300/70 bg-ink-50 shadow-2xl dark:border-ink-700 dark:bg-ink-900"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.985 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.995 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-ink-200/80 px-4 py-3 dark:border-ink-800">
              <Search className="h-4 w-4 text-ink-500 dark:text-ink-400" />
              <label htmlFor="command-palette-input" className="sr-only">
                Search commands
              </label>
              <input
                id="command-palette-input"
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Jump to routes, filters, and featured components"
                className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-500 dark:text-ink-100 dark:placeholder:text-ink-400"
              />
              <span className="rounded border border-ink-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:border-ink-700 dark:text-ink-400">
                esc
              </span>
            </div>
            <ul className="max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label="Command results">
              {filteredActions.length > 0 ? (
                filteredActions.map((action, index) => (
                  <li key={action.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => {
                        action.run();
                        onClose();
                      }}
                      className={[
                        'w-full rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500',
                        index === activeIndex
                          ? 'border-pine-600/60 bg-pine-100/80 dark:border-pine-500/50 dark:bg-pine-900/30'
                          : 'border-transparent hover:border-ink-300 hover:bg-white/80 dark:hover:border-ink-700 dark:hover:bg-ink-800/80'
                      ].join(' ')}
                    >
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{action.label}</p>
                      <p className="text-xs text-ink-600 dark:text-ink-300">{action.subtitle}</p>
                    </button>
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-ink-200/70 bg-white/70 px-3 py-6 text-center text-sm text-ink-600 dark:border-ink-800 dark:bg-ink-800/40 dark:text-ink-300">
                  No actions match your query.
                </li>
              )}
            </ul>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
