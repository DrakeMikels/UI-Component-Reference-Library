import { useState } from 'react';
import { DemoProps } from './types';

export const FeedbackDemo = ({ component, scenario }: DemoProps) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(2);

  if (component.id === 'badge') {
    return (
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-3 py-1 dark:border-ink-700 dark:bg-ink-900">
          <span className="text-sm text-ink-700 dark:text-ink-200">New events</span>
          <span className="rounded-full bg-pine-600 px-2 py-0.5 text-xs font-semibold text-white">{count}</span>
        </div>
        <button
          type="button"
          onClick={() => setCount((current) => current + 1)}
          className="block rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Add notification
        </button>
      </div>
    );
  }

  if (component.id === 'skeleton' || component.id === 'spinner') {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLoading((current) => !current)}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          {loading ? 'Stop loading' : 'Start loading'}
        </button>
        {loading ? (
          component.id === 'spinner' ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-300 border-t-pine-600" aria-label="Loading" />
          ) : (
            <div className="space-y-2" aria-label="Loading placeholder">
              <div className="h-3 w-full animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
            </div>
          )
        ) : (
          <p className="text-sm text-ink-700 dark:text-ink-200">Content loaded for {scenario.title.toLowerCase()}.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
      >
        {visible ? 'Hide message' : 'Show message'}
      </button>
      {visible ? (
        <p className="rounded-lg border border-amberline/50 bg-amberline/20 px-3 py-2 text-sm text-ink-800 dark:text-ink-100">
          {scenario.title} update: your changes were saved successfully.
        </p>
      ) : (
        <p className="text-sm text-ink-600 dark:text-ink-300">No active message.</p>
      )}
    </div>
  );
};

export const WorkflowDemo = ({ component, scenario }: DemoProps) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(34);
  const [selectedDate, setSelectedDate] = useState('2026-03-05');
  const [status, setStatus] = useState<'Backlog' | 'In Progress' | 'Done'>('Backlog');

  if (component.id === 'calendar') {
    return (
      <div className="space-y-3">
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-calendar`}>
          Pick event date
        </label>
        <input
          id={`${component.id}-${scenario.key}-calendar`}
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
        <p className="text-sm text-ink-700 dark:text-ink-200">Selected date: {selectedDate}</p>
      </div>
    );
  }

  if (component.id === 'kanban-board') {
    return (
      <div className="space-y-3">
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-status`}>
          Move task status
        </label>
        <select
          id={`${component.id}-${scenario.key}-status`}
          value={status}
          onChange={(event) => setStatus(event.target.value as 'Backlog' | 'In Progress' | 'Done')}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          <option value="Backlog">Backlog</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <p className="text-sm text-ink-700 dark:text-ink-200">Current lane: {status}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-3 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800" aria-hidden="true">
        <div className="h-full bg-pine-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStep((current) => Math.max(current - 1, 0));
            setProgress((current) => Math.max(current - 20, 0));
          }}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            setStep((current) => Math.min(current + 1, scenario.stages.length - 1));
            setProgress((current) => Math.min(current + 20, 100));
          }}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          Next
        </button>
      </div>

      <p className="text-sm text-ink-700 dark:text-ink-200">
        Step: {scenario.stages[step]} ({progress}%)
      </p>
    </div>
  );
};
