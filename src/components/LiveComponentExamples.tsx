import { useMemo } from 'react';
import { ComponentEntry } from '../types';
import { ActionDemo, ChoiceDemo, PickerDemo, RangeDemo, TextDemo, UploadDemo } from './live-demos/FormDemos';
import { ChartDemo, DataDemo, GeoDemo } from './live-demos/DataDemos';
import { NavigationDemo, OverlayDemo } from './live-demos/NavigationDemos';
import { FeedbackDemo, WorkflowDemo } from './live-demos/FeedbackDemos';
import { FilterDemo, SearchDemo } from './live-demos/DiscoveryDemos';
import { ContentDemo, GenericDemo, ThemeDemo } from './live-demos/ContentDemos';
import { DemoKind, ScenarioDefinition } from './live-demos/types';
import { resolveDemoKind, scenarioDefinitions } from './live-demos/scenarios';

interface LiveComponentExamplesProps {
  component: ComponentEntry;
}

interface ScenarioExampleBlockProps {
  component: ComponentEntry;
  scenario: ScenarioDefinition;
  demoKind: DemoKind;
}

const LiveScenarioDemo = ({ component, scenario, demoKind }: ScenarioExampleBlockProps) => {
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
