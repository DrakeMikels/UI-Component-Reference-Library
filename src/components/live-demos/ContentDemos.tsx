import { useState } from 'react';
import { DemoProps } from './types';

export const ThemeDemo = ({ scenario }: DemoProps) => {
  const [dark, setDark] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setDark((current) => !current)}
        aria-pressed={dark}
        className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
      >
        {dark ? 'Switch to light preview' : 'Switch to dark preview'}
      </button>

      <div
        className={`rounded-xl border p-3 text-sm ${
          dark ? 'border-ink-700 bg-ink-900 text-ink-100' : 'border-ink-200 bg-white text-ink-800'
        }`}
      >
        {scenario.title} preview in <span className="font-semibold">{dark ? 'dark' : 'light'}</span> mode.
      </div>
    </div>
  );
};

export const ContentDemo = ({ component, scenario }: DemoProps) => {
  const [items, setItems] = useState<string[]>(scenario.options.map((option) => `${option} item`));
  const [draft, setDraft] = useState('');
  const [selected, setSelected] = useState(items[0] ?? '');

  return (
    <div className="space-y-3">
      {component.id === 'empty-state' && items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-300 px-3 py-4 text-center text-sm text-ink-600 dark:border-ink-700 dark:text-ink-300">
          No items yet. Add your first entry.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() => setSelected(item)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 ${
                  selected === item
                    ? 'border-pine-500 bg-pine-50 text-pine-900 dark:border-pine-500 dark:bg-pine-900/40 dark:text-pine-100'
                    : 'border-ink-300 bg-white text-ink-700 hover:border-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Add ${scenario.title.toLowerCase()} item`}
          className="min-w-[220px] flex-1 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
        <button
          type="button"
          onClick={() => {
            const nextItem = draft.trim();
            if (!nextItem) {
              return;
            }

            setItems((current) => [...current, nextItem]);
            setDraft('');
            setSelected(nextItem);
          }}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setItems((current) => current.slice(0, -1))}
          disabled={items.length === 0}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition enabled:hover:border-ink-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Remove last
        </button>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-200">Selected item: {selected || 'None'}</p>
    </div>
  );
};

export const GenericDemo = ({ component, scenario }: DemoProps) => {
  const [enabled, setEnabled] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-3">
      <label className="inline-flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
          className="h-4 w-4 rounded border-ink-400 text-pine-600 focus:ring-pine-500"
        />
        Enable {component.name.toLowerCase()} preview
      </label>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={2}
        placeholder={scenario.placeholder}
        className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
      />
      <p className="text-sm text-ink-700 dark:text-ink-200">{enabled ? 'Preview enabled' : 'Preview disabled'}</p>
    </div>
  );
};
