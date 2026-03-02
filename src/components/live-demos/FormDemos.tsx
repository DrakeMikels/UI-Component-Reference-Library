import { ChangeEvent, FormEvent, useState } from 'react';
import { DemoProps } from './types';

export const ActionDemo = ({ component, scenario }: DemoProps) => {
  const [presses, setPresses] = useState(0);
  const [queued, setQueued] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setPresses((current) => current + 1);
            setQueued(true);
          }}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          {component.name}: {scenario.actionLabel}
        </button>
        <button
          type="button"
          onClick={() => setQueued((current) => !current)}
          aria-pressed={queued}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          {queued ? 'Queued' : 'Mark queued'}
        </button>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-200">
        Trigger count: <span className="font-semibold">{presses}</span>
      </p>
    </div>
  );
};

export const TextDemo = ({ component, scenario }: DemoProps) => {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState('');
  const isLongForm = component.id === 'textarea' || component.id === 'rich-text-editor';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(value.trim());
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-text`}>
        {component.name} input
      </label>
      {isLongForm ? (
        <textarea
          id={`${component.id}-${scenario.key}-text`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={3}
          placeholder={scenario.placeholder}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
      ) : (
        <input
          id={`${component.id}-${scenario.key}-text`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={scenario.placeholder}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => { setValue(''); setSaved(''); }}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Clear
        </button>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-200">
        {saved ? `Saved value: ${saved}` : 'No saved value yet'}
      </p>
    </form>
  );
};

export const ChoiceDemo = ({ component, scenario }: DemoProps) => {
  const [singleValue, setSingleValue] = useState(scenario.options[0]);
  const [multiValues, setMultiValues] = useState<string[]>([scenario.options[0]]);

  const toggleOption = (option: string) => {
    setMultiValues((current) => (current.includes(option) ? current.filter((entry) => entry !== option) : [...current, option]));
  };

  if (component.id === 'switch') {
    return (
      <div className="space-y-3">
        <label className="inline-flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200">
          <input
            type="checkbox"
            checked={multiValues.length > 0}
            onChange={(event) => setMultiValues(event.target.checked ? [scenario.options[0]] : [])}
            className="h-4 w-4 rounded border-ink-400 text-pine-600 focus:ring-pine-500"
          />
          Enable {scenario.title.toLowerCase()} mode
        </label>
        <p className="text-sm text-ink-700 dark:text-ink-200">
          State: <span className="font-semibold">{multiValues.length > 0 ? 'On' : 'Off'}</span>
        </p>
      </div>
    );
  }

  if (component.id === 'select') {
    return (
      <div className="space-y-3">
        <label className="text-sm font-medium text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-select`}>
          Choose an option
        </label>
        <select
          id={`${component.id}-${scenario.key}-select`}
          value={singleValue}
          onChange={(event) => setSingleValue(event.target.value)}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          {scenario.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <p className="text-sm text-ink-700 dark:text-ink-200">Selected: {singleValue}</p>
      </div>
    );
  }

  if (component.id === 'checkbox' || component.id === 'chip') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {scenario.options.map((option) => {
            const active = multiValues.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleOption(option)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 ${
                  active
                    ? 'border-pine-600 bg-pine-100 text-pine-800 dark:border-pine-500 dark:bg-pine-900/60 dark:text-pine-100'
                    : 'border-ink-300 bg-white text-ink-700 hover:border-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-700 dark:text-ink-200">
          Active: {multiValues.length > 0 ? multiValues.join(', ') : 'None'}
        </p>
      </div>
    );
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink-700 dark:text-ink-200">Select one option</legend>
      {scenario.options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
          <input
            type="radio"
            name={`${component.id}-${scenario.key}-choice`}
            checked={singleValue === option}
            onChange={() => setSingleValue(option)}
            className="h-4 w-4 border-ink-400 text-pine-600 focus:ring-pine-500"
          />
          {option}
        </label>
      ))}
      <p className="pt-1 text-sm text-ink-700 dark:text-ink-200">Selected: {singleValue}</p>
    </fieldset>
  );
};

export const RangeDemo = ({ component, scenario }: DemoProps) => {
  const [singleValue, setSingleValue] = useState(40);
  const [minValue, setMinValue] = useState(20);
  const [maxValue, setMaxValue] = useState(80);

  if (component.id === 'range-slider') {
    return (
      <div className="space-y-3">
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-min`}>
          Min value: {minValue}
        </label>
        <input
          id={`${component.id}-${scenario.key}-min`}
          type="range" min={0} max={95} value={minValue}
          onChange={(event) => setMinValue(Math.min(Number(event.target.value), maxValue - 5))}
          className="w-full"
        />
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-max`}>
          Max value: {maxValue}
        </label>
        <input
          id={`${component.id}-${scenario.key}-max`}
          type="range" min={5} max={100} value={maxValue}
          onChange={(event) => setMaxValue(Math.max(Number(event.target.value), minValue + 5))}
          className="w-full"
        />
        <p className="text-sm text-ink-700 dark:text-ink-200">
          {scenario.title} range: {minValue} - {maxValue}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-single`}>
        Value: {singleValue}
      </label>
      <input
        id={`${component.id}-${scenario.key}-single`}
        type="range" min={0} max={100} value={singleValue}
        onChange={(event) => setSingleValue(Number(event.target.value))}
        className="w-full"
      />
      <p className="text-sm text-ink-700 dark:text-ink-200">Adjusted for {scenario.title.toLowerCase()}.</p>
    </div>
  );
};

export const PickerDemo = ({ component, scenario }: DemoProps) => {
  const [date, setDate] = useState('2026-03-01');
  const [time, setTime] = useState('09:30');
  const [color, setColor] = useState('#3e8361');

  if (component.id === 'date-picker') {
    return (
      <div className="space-y-3">
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-date`}>
          Pick a date
        </label>
        <input
          id={`${component.id}-${scenario.key}-date`}
          type="date" value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
        <p className="text-sm text-ink-700 dark:text-ink-200">Scheduled date: {date}</p>
      </div>
    );
  }

  if (component.id === 'time-picker') {
    return (
      <div className="space-y-3">
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-time`}>
          Pick a time
        </label>
        <input
          id={`${component.id}-${scenario.key}-time`}
          type="time" value={time}
          onChange={(event) => setTime(event.target.value)}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        />
        <p className="text-sm text-ink-700 dark:text-ink-200">Scheduled time: {time}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-color`}>
        Choose an accent color
      </label>
      <div className="flex items-center gap-3">
        <input
          id={`${component.id}-${scenario.key}-color`}
          type="color" value={color}
          onChange={(event) => setColor(event.target.value)}
          className="h-10 w-12 rounded-md border border-ink-300 bg-white p-1 dark:border-ink-700 dark:bg-ink-900"
        />
        <span className="text-sm text-ink-700 dark:text-ink-200">{color.toUpperCase()}</span>
      </div>
      <div className="h-8 rounded-lg border border-ink-200 dark:border-ink-700" style={{ backgroundColor: color }} aria-hidden="true" />
      <p className="text-sm text-ink-700 dark:text-ink-200">Previewing for {scenario.title.toLowerCase()}.</p>
    </div>
  );
};

export const UploadDemo = ({ component, scenario }: DemoProps) => {
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setProgress(15);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-file`}>
        Select a file
      </label>
      <input
        id={`${component.id}-${scenario.key}-file`}
        type="file" onChange={onFileChange}
        className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border-0 file:bg-pine-600 file:px-3 file:py-2 file:font-semibold file:text-white hover:file:bg-pine-700 dark:text-ink-200"
      />
      <div className="h-3 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800" aria-hidden="true">
        <div className="h-full bg-pine-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!fileName || progress >= 100}
          onClick={() => setProgress((current) => Math.min(current + 25, 100))}
          className="rounded-lg bg-pine-600 px-3 py-2 text-sm font-semibold text-white transition enabled:hover:bg-pine-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
        >
          Upload chunk
        </button>
        <button
          type="button"
          onClick={() => { setFileName(''); setProgress(0); }}
          className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-200">
        {fileName ? `${fileName} • ${progress}% complete (${scenario.title.toLowerCase()})` : 'No file selected yet'}
      </p>
    </div>
  );
};
