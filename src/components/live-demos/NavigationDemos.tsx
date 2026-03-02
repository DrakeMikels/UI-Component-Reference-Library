import { useState } from 'react';
import { DemoProps } from './types';

export const NavigationDemo = ({ component, scenario }: DemoProps) => {
  const [activeStage, setActiveStage] = useState(0);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(true);

  if (component.id === 'pagination') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            Previous
          </button>
          <span className="text-sm text-ink-700 dark:text-ink-200">Page {page}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(current + 1, 9))}
            className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (component.id === 'accordion' || component.id === 'tree-view') {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          {scenario.stages[0]}
          <span>{expanded ? 'Hide' : 'Show'}</span>
        </button>
        {expanded ? (
          <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200">
            {scenario.stages.slice(1).join(' • ')}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <nav aria-label={`${component.name} demo`} className="flex flex-wrap gap-2">
        {scenario.stages.map((stage, index) => {
          const active = activeStage === index;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setActiveStage(index)}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 ${
                active
                  ? 'border-pine-600 bg-pine-100 text-pine-800 dark:border-pine-500 dark:bg-pine-900/50 dark:text-pine-100'
                  : 'border-ink-300 bg-white text-ink-700 hover:border-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'
              }`}
            >
              {stage}
            </button>
          );
        })}
      </nav>
      <p className="text-sm text-ink-700 dark:text-ink-200">
        Active section: <span className="font-semibold">{scenario.stages[activeStage]}</span>
      </p>
    </div>
  );
};

export const OverlayDemo = ({ component, scenario }: DemoProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
      >
        {open ? `Close ${component.name}` : `Open ${component.name}`}
      </button>

      {open ? (
        <div className="rounded-lg border border-ink-200 bg-white p-3 text-sm text-ink-700 shadow-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200">
          <p className="font-medium text-ink-800 dark:text-ink-100">{scenario.title} quick actions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {scenario.options.map((option) => (
              <button
                key={option}
                type="button"
                className="rounded-md border border-ink-300 px-2 py-1 text-xs font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-100"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-600 dark:text-ink-300">Panel is closed.</p>
      )}
    </div>
  );
};
