import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { ComponentEntry } from '../types';

type ExampleScenario = 'dashboard' | 'onboarding' | 'commerce';

type DemoKind =
  | 'action'
  | 'text'
  | 'choice'
  | 'range'
  | 'picker'
  | 'upload'
  | 'data'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'workflow'
  | 'chart'
  | 'geo'
  | 'search'
  | 'filter'
  | 'theme'
  | 'content'
  | 'generic';

interface ScenarioDefinition {
  key: ExampleScenario;
  title: string;
  description: string;
  actionLabel: string;
  placeholder: string;
  options: [string, string, string];
  stages: [string, string, string];
}

interface LiveComponentExamplesProps {
  component: ComponentEntry;
}

interface DemoProps {
  component: ComponentEntry;
  scenario: ScenarioDefinition;
}

const scenarioDefinitions: ScenarioDefinition[] = [
  {
    key: 'dashboard',
    title: 'Admin dashboard',
    description: 'Run a quick operational change as if this component is embedded in a reporting console.',
    actionLabel: 'Apply dashboard update',
    placeholder: 'Type a dashboard update note',
    options: ['All teams', 'Platform', 'Support'],
    stages: ['Overview', 'Incidents', 'Settings']
  },
  {
    key: 'onboarding',
    title: 'Onboarding',
    description: 'Simulate a first-run setup interaction where users need guidance and clear feedback.',
    actionLabel: 'Continue onboarding',
    placeholder: 'Type onboarding details',
    options: ['Beginner', 'Guided', 'Self-serve'],
    stages: ['Account', 'Preferences', 'Confirmation']
  },
  {
    key: 'commerce',
    title: 'E-commerce flow',
    description: 'Exercise this component in a conversion path where speed and clarity matter.',
    actionLabel: 'Continue checkout',
    placeholder: 'Type order instructions',
    options: ['Standard', 'Express', 'Priority'],
    stages: ['Cart', 'Shipping', 'Payment']
  }
];

const demoKindById: Partial<Record<string, DemoKind>> = {
  button: 'action',
  'icon-button': 'action',
  'split-button': 'action',
  'input-text': 'text',
  textarea: 'text',
  'rich-text-editor': 'text',
  'form-field': 'text',
  checkbox: 'choice',
  'radio-group': 'choice',
  select: 'choice',
  chip: 'choice',
  'segmented-control': 'choice',
  switch: 'choice',
  slider: 'range',
  'range-slider': 'range',
  'date-picker': 'picker',
  'time-picker': 'picker',
  'color-picker': 'picker',
  'file-upload': 'upload',
  table: 'data',
  'data-grid': 'data',
  stat: 'data',
  'comparison-table': 'data',
  pagination: 'navigation',
  tabs: 'navigation',
  accordion: 'navigation',
  breadcrumb: 'navigation',
  navbar: 'navigation',
  sidebar: 'navigation',
  footer: 'navigation',
  'mega-menu': 'navigation',
  'tree-view': 'navigation',
  'data-list-detail': 'navigation',
  'dropdown-menu': 'overlay',
  tooltip: 'overlay',
  popover: 'overlay',
  modal: 'overlay',
  drawer: 'overlay',
  toast: 'feedback',
  'alert-banner': 'feedback',
  badge: 'feedback',
  skeleton: 'feedback',
  spinner: 'feedback',
  'progress-bar': 'workflow',
  stepper: 'workflow',
  timeline: 'workflow',
  'kanban-board': 'workflow',
  calendar: 'workflow',
  'activity-feed': 'workflow',
  'chart-line': 'chart',
  'chart-bar': 'chart',
  'chart-pie': 'chart',
  map: 'geo',
  'command-menu': 'search',
  'spotlight-search': 'search',
  combobox: 'search',
  'filter-builder': 'filter',
  'theme-toggle': 'theme',
  card: 'content',
  list: 'content',
  avatar: 'content',
  'empty-state': 'content'
};

const resolveDemoKind = (component: ComponentEntry): DemoKind => {
  const fromId = demoKindById[component.id];
  if (fromId) {
    return fromId;
  }

  if (component.tags.includes('Search')) {
    return 'search';
  }

  if (component.tags.includes('Filters')) {
    return 'filter';
  }

  if (component.tags.includes('Input')) {
    return 'text';
  }

  if (component.tags.includes('Charts') || component.tags.includes('Analytics')) {
    return 'chart';
  }

  if (component.tags.includes('Geo')) {
    return 'geo';
  }

  if (component.tags.includes('Workflow')) {
    return 'workflow';
  }

  if (
    component.tags.includes('Feedback') ||
    component.tags.includes('Status') ||
    component.tags.includes('Loading') ||
    component.tags.includes('Notifications')
  ) {
    return 'feedback';
  }

  if (component.tags.includes('Navigation') || component.tags.includes('Menu')) {
    return 'navigation';
  }

  if (component.tags.includes('Data')) {
    return 'data';
  }

  if (component.tags.includes('Layout') || component.tags.includes('Content') || component.tags.includes('Identity')) {
    return 'content';
  }

  return 'generic';
};

const regionOptions: [string, string, string] = ['North', 'Central', 'South'];

export const LiveComponentExamples = ({ component }: LiveComponentExamplesProps) => {
  const demoKind = useMemo(() => resolveDemoKind(component), [component]);

  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Live Examples</h3>
      <p className="mt-2 text-sm text-ink-700 dark:text-ink-200">
        Try realistic interactions for <span className="font-semibold">{component.name}</span> across three common product scenarios.
      </p>

      <div className="mt-4 space-y-4">
        {scenarioDefinitions.map((scenario) => (
          <ScenarioExampleBlock key={`${component.id}-${scenario.key}`} component={component} scenario={scenario} demoKind={demoKind} />
        ))}
      </div>
    </section>
  );
};

interface ScenarioExampleBlockProps {
  component: ComponentEntry;
  scenario: ScenarioDefinition;
  demoKind: DemoKind;
}

const ScenarioExampleBlock = ({ component, scenario, demoKind }: ScenarioExampleBlockProps) => {
  const exampleId = `example-${component.id}-${scenario.key}`;

  return (
    <article
      id={exampleId}
      tabIndex={-1}
      className="scroll-mt-6 rounded-2xl border border-ink-200/80 bg-white/80 p-4 dark:border-ink-800 dark:bg-ink-800/40"
      aria-labelledby={`${exampleId}-title`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 id={`${exampleId}-title`} className="font-semibold text-ink-900 dark:text-ink-50">
            {scenario.title}
          </h4>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{scenario.description}</p>
        </div>
        <span className="rounded-full border border-pine-200 bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-800 dark:border-pine-700 dark:bg-pine-900/40 dark:text-pine-100">
          Interactive
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-ink-200/70 bg-ink-50/80 p-3 dark:border-ink-700 dark:bg-ink-900/70 sm:p-4">
        <LiveScenarioDemo component={component} scenario={scenario} demoKind={demoKind} />
      </div>
    </article>
  );
};

interface LiveScenarioDemoProps extends DemoProps {
  demoKind: DemoKind;
}

const LiveScenarioDemo = ({ component, scenario, demoKind }: LiveScenarioDemoProps) => {
  switch (demoKind) {
    case 'action':
      return <ActionDemo component={component} scenario={scenario} />;
    case 'text':
      return <TextDemo component={component} scenario={scenario} />;
    case 'choice':
      return <ChoiceDemo component={component} scenario={scenario} />;
    case 'range':
      return <RangeDemo component={component} scenario={scenario} />;
    case 'picker':
      return <PickerDemo component={component} scenario={scenario} />;
    case 'upload':
      return <UploadDemo component={component} scenario={scenario} />;
    case 'data':
      return <DataDemo component={component} scenario={scenario} />;
    case 'navigation':
      return <NavigationDemo component={component} scenario={scenario} />;
    case 'overlay':
      return <OverlayDemo component={component} scenario={scenario} />;
    case 'feedback':
      return <FeedbackDemo component={component} scenario={scenario} />;
    case 'workflow':
      return <WorkflowDemo component={component} scenario={scenario} />;
    case 'chart':
      return <ChartDemo component={component} scenario={scenario} />;
    case 'geo':
      return <GeoDemo component={component} scenario={scenario} />;
    case 'search':
      return <SearchDemo component={component} scenario={scenario} />;
    case 'filter':
      return <FilterDemo component={component} scenario={scenario} />;
    case 'theme':
      return <ThemeDemo component={component} scenario={scenario} />;
    case 'content':
      return <ContentDemo component={component} scenario={scenario} />;
    default:
      return <GenericDemo component={component} scenario={scenario} />;
  }
};

const ActionDemo = ({ component, scenario }: DemoProps) => {
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

const TextDemo = ({ component, scenario }: DemoProps) => {
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
          onClick={() => {
            setValue('');
            setSaved('');
          }}
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

const ChoiceDemo = ({ component, scenario }: DemoProps) => {
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
            <option key={option} value={option}>
              {option}
            </option>
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

const RangeDemo = ({ component, scenario }: DemoProps) => {
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
          type="range"
          min={0}
          max={95}
          value={minValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            setMinValue(Math.min(next, maxValue - 5));
          }}
          className="w-full"
        />
        <label className="text-sm text-ink-700 dark:text-ink-200" htmlFor={`${component.id}-${scenario.key}-max`}>
          Max value: {maxValue}
        </label>
        <input
          id={`${component.id}-${scenario.key}-max`}
          type="range"
          min={5}
          max={100}
          value={maxValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            setMaxValue(Math.max(next, minValue + 5));
          }}
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
        type="range"
        min={0}
        max={100}
        value={singleValue}
        onChange={(event) => setSingleValue(Number(event.target.value))}
        className="w-full"
      />
      <p className="text-sm text-ink-700 dark:text-ink-200">Adjusted for {scenario.title.toLowerCase()}.</p>
    </div>
  );
};

const PickerDemo = ({ component, scenario }: DemoProps) => {
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
          type="date"
          value={date}
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
          type="time"
          value={time}
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
          type="color"
          value={color}
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

const UploadDemo = ({ component, scenario }: DemoProps) => {
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

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
        type="file"
        onChange={onFileChange}
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
          onClick={() => {
            setFileName('');
            setProgress(0);
          }}
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

const DataDemo = ({ component, scenario }: DemoProps) => {
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSortBy('name')}
          className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Sort by name
        </button>
        <button
          type="button"
          onClick={() => setSortBy('value')}
          className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
          Sort by value
        </button>
        <button
          type="button"
          onClick={() => setDescending((current) => !current)}
          className="rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-sm text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
        >
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

const NavigationDemo = ({ component, scenario }: DemoProps) => {
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

const OverlayDemo = ({ component, scenario }: DemoProps) => {
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

const FeedbackDemo = ({ component, scenario }: DemoProps) => {
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

const WorkflowDemo = ({ component, scenario }: DemoProps) => {
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

const ChartDemo = ({ component, scenario }: DemoProps) => {
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
        type="range"
        min={50}
        max={140}
        value={scale}
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

const GeoDemo = ({ scenario }: DemoProps) => {
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

const SearchDemo = ({ component, scenario }: DemoProps) => {
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

const FilterDemo = ({ component, scenario }: DemoProps) => {
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

const ThemeDemo = ({ scenario }: DemoProps) => {
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

const ContentDemo = ({ component, scenario }: DemoProps) => {
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

const GenericDemo = ({ component, scenario }: DemoProps) => {
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
