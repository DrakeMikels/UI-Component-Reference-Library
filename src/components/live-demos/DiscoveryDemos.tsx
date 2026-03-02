import { useMemo, useState } from 'react';
import { DemoProps } from './types';

export const SearchDemo = ({ component, scenario }: DemoProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const candidates = useMemo(
    () => [
      `${scenario.options[0]} workspace`,
      `${scenario.options[1]} workflow`,
      `${scenario.options[2]} summary`,
      `${scenario.title} quick action`
    ],
    [scenario.options, scenario.title]
  );

  const results = candidates.filter((candidate) => candidate.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-3">
      <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-search`}>
        Search items
      </label>
      <input
        id={`${component.id}-${scenario.key}-search`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${component.name.toLowerCase()} items`}
        className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
      />

      <ul className="space-y-2">
        {results.map((result) => (
          <li key={result}>
            <button
              type="button"
              onClick={() => setSelected(result)}
              className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-left text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
            >
              {result}
            </button>
          </li>
        ))}
      </ul>

      <p className="text-sm text-ink-700 dark:text-ink-200">
        {selected ? `Selected result: ${selected}` : 'Select a search result to continue'}
      </p>
    </div>
  );
};

interface FilterRule {
  field: string;
  operator: 'is' | 'contains' | 'not';
  value: string;
}

export const FilterDemo = ({ component, scenario }: DemoProps) => {
  const [field, setField] = useState(scenario.options[0]);
  const [operator, setOperator] = useState<FilterRule['operator']>('is');
  const [value, setValue] = useState('active');
  const [rules, setRules] = useState<FilterRule[]>([]);

  const addRule = () => {
    const nextValue = value.trim();
    if (!nextValue) {
      return;
    }

    setRules((current) => [...current, { field, operator, value: nextValue }]);
    setValue('');
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <select
          value={field}
          onChange={(event) => setField(event.target.value)}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          aria-label="Filter field"
        >
          {scenario.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={operator}
          onChange={(event) => setOperator(event.target.value as FilterRule['operator'])}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          aria-label="Filter operator"
        >
          <option value="is">is</option>
          <option value="contains">contains</option>
          <option value="not">is not</option>
        </select>

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Value"
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          aria-label="Filter value"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addRule}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          Add rule
        </button>
        <button
          type="button"
          onClick={() => setRules([])}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Clear rules
        </button>
      </div>

      <ul className="space-y-1 text-sm text-ink-700 dark:text-ink-200" aria-live="polite">
        {rules.length === 0 ? (
          <li className="text-ink-500 dark:text-ink-400">No rules yet</li>
        ) : (
          rules.map((rule, index) => (
            <li key={`${rule.field}-${rule.operator}-${rule.value}-${index}`} className="rounded-md border border-ink-200 bg-white px-2 py-1 dark:border-ink-700 dark:bg-ink-900">
              {rule.field} {rule.operator} {rule.value}
            </li>
          ))
        )}
      </ul>
      <p className="text-sm text-ink-700 dark:text-ink-200">{component.name} rule count: {rules.length}</p>
    </div>
  );
};
