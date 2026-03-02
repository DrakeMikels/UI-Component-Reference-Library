import { useMemo, useState } from 'react';
import { DemoProps } from './types';
import { regionOptions } from './scenarios';

export const DataDemo = ({ component, scenario }: DemoProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'value'>('value');
  const [descending, setDescending] = useState(true);
  const [metric, setMetric] = useState(72);

  const rows = useMemo(
    () => [
      { name: scenario.options[0], value: 42 },
      { name: scenario.options[1], value: 58 },
      { name: scenario.options[2], value: 36 }
    ],
    [scenario.options]
  );

  if (component.id === 'stat') {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-ink-200 bg-white p-3 dark:border-ink-700 dark:bg-ink-900">
          <p className="text-xs uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">{scenario.title}</p>
          <p className="mt-1 text-2xl font-display font-semibold text-ink-900 dark:text-ink-50">{metric}%</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMetric((current) => Math.min(current + 5, 100))}
            className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
          >
            Increase
          </button>
          <button
            type="button"
            onClick={() => setMetric((current) => Math.max(current - 5, 0))}
            className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          >
            Decrease
          </button>
        </div>
      </div>
    );
  }

  const sortedRows = rows.slice().sort((left, right) => {
    const compareResult = sortBy === 'name' ? left.name.localeCompare(right.name) : left.value - right.value;
    return descending ? compareResult * -1 : compareResult;
  });

  const btnClass = 'rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setSortBy('name')} className={btnClass}>Sort by name</button>
        <button type="button" onClick={() => setSortBy('value')} className={btnClass}>Sort by value</button>
        <button type="button" onClick={() => setDescending((current) => !current)} className={btnClass}>
          {descending ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-ink-200 dark:border-ink-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            <tr>
              <th className="px-3 py-2 font-semibold">Segment</th>
              <th className="px-3 py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.name} className="border-t border-ink-200 dark:border-ink-700">
                <td className="px-3 py-2 text-ink-800 dark:text-ink-100">{row.name}</td>
                <td className="px-3 py-2 text-ink-700 dark:text-ink-200">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ChartDemo = ({ component, scenario }: DemoProps) => {
  const [scale, setScale] = useState(100);

  const points = scenario.options.map((label, index) => ({
    label,
    value: Math.max(10, Math.round((70 - index * 15) * (scale / 100)))
  }));

  return (
    <div className="space-y-3">
      <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-scale`}>
        Scale data: {scale}%
      </label>
      <input
        id={`${component.id}-${scenario.key}-scale`}
        type="range" min={50} max={140} value={scale}
        onChange={(event) => setScale(Number(event.target.value))}
        className="w-full"
      />
      <div className="space-y-2">
        {points.map((point) => (
          <div key={point.label} className="flex items-center gap-2">
            <span className="w-24 text-xs text-ink-600 dark:text-ink-300">{point.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
              <div className="h-full bg-pine-500" style={{ width: `${point.value}%` }} />
            </div>
            <span className="w-10 text-right text-xs text-ink-600 dark:text-ink-300">{point.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GeoDemo = ({ scenario }: DemoProps) => {
  const [region, setRegion] = useState(regionOptions[0]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {regionOptions.map((item) => {
          const active = item === region;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setRegion(item)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 ${
                active
                  ? 'border-pine-600 bg-pine-100 text-pine-800 dark:border-pine-500 dark:bg-pine-900/50 dark:text-pine-100'
                  : 'border-ink-300 bg-white text-ink-700 hover:border-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-200">
        Showing {scenario.title.toLowerCase()} map focus for <span className="font-semibold">{region}</span> region.
      </p>
      <div className="grid grid-cols-3 gap-2" aria-hidden="true">
        {regionOptions.map((item) => (
          <div
            key={item}
            className={`h-12 rounded-lg border ${item === region ? 'border-pine-500 bg-pine-100 dark:bg-pine-900/50' : 'border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900'}`}
          />
        ))}
      </div>
    </div>
  );
};
