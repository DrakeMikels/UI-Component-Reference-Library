import { ComponentEntry } from '../types';
import { LiveComponentExamples } from './LiveComponentExamples';
import { Modal } from './ui/Modal';
import { TagChip } from './ui/TagChip';

interface ComponentDetailModalProps {
  component: ComponentEntry | null;
  relatedComponents: ComponentEntry[];
  onClose: () => void;
  onSelectRelated: (id: string) => void;
}

type ExampleScenario = 'dashboard' | 'onboarding' | 'commerce';

interface ExampleReference {
  label: string;
  href: string;
}

const scenarioContextByKey: Record<ExampleScenario, string> = {
  dashboard: 'admin dashboard',
  onboarding: 'product onboarding',
  commerce: 'commerce checkout flow'
};

const buildExampleQuery = (component: ComponentEntry, scenario: ExampleScenario): string =>
  [
    component.name,
    ...component.aliases.slice(0, 2),
    ...component.tags.slice(0, 3),
    ...component.useCases.slice(0, 2),
    scenarioContextByKey[scenario],
    'react',
    'ui component'
  ].join(' ');

const buildExampleLinks = (component: ComponentEntry): ExampleReference[] => {
  const dashboardQuery = buildExampleQuery(component, 'dashboard');
  const onboardingQuery = buildExampleQuery(component, 'onboarding');
  const commerceQuery = buildExampleQuery(component, 'commerce');

  return [
    {
      label: 'Dashboard examples (CodeSandbox)',
      href: `https://codesandbox.io/search?query=${encodeURIComponent(dashboardQuery)}`
    },
    {
      label: 'Onboarding flows (StackBlitz)',
      href: `https://stackblitz.com/search?query=${encodeURIComponent(onboardingQuery)}`
    },
    {
      label: 'Commerce implementations (GitHub Code)',
      href: `https://github.com/search?q=${encodeURIComponent(commerceQuery)}&type=code`
    }
  ];
};

export const ComponentDetailModal = ({
  component,
  relatedComponents,
  onClose,
  onSelectRelated
}: ComponentDetailModalProps) => {
  if (!component) {
    return <Modal title="Component details" open={false} onClose={onClose}>{null}</Modal>;
  }

  return (
    <Modal title={`${component.name} details`} open={Boolean(component)} onClose={onClose}>
      <div>
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500 dark:text-ink-400">Component Profile</p>
          <h2 className="mt-2 font-display text-4xl tracking-tight text-ink-900 dark:text-ink-50">{component.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700 dark:text-ink-200">{component.description}</p>
        </header>

        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Aliases</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {component.aliases.map((alias) => (
              <TagChip key={alias} label={alias} />
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-ink-200/80 bg-white/80 p-4 dark:border-ink-800 dark:bg-ink-800/40">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Common Use Cases</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-200">
              {component.useCases.map((useCase) => (
                <li key={useCase} className="rounded-lg border border-ink-200/80 bg-ink-50/80 px-3 py-2 dark:border-ink-700 dark:bg-ink-900/60">
                  {useCase}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-ink-200/80 bg-white/80 p-4 dark:border-ink-800 dark:bg-ink-800/40">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Example References</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-ink-200">
              {buildExampleLinks(component).map((example) => (
                <li key={example.href}>
                  <a
                    href={example.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex rounded-md border border-transparent px-1 py-0.5 underline decoration-amberline decoration-2 underline-offset-4 transition hover:text-pine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:hover:text-pine-300"
                  >
                    {example.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <LiveComponentExamples key={component.id} component={component} />

        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-500 dark:text-ink-400">Related Components</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedComponents.map((related) => (
              <button
                key={related.id}
                type="button"
                onClick={() => onSelectRelated(related.id)}
                className="rounded-full border border-ink-300/70 bg-white/80 px-3 py-1 text-xs font-semibold text-ink-700 transition hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:bg-ink-900/70 dark:text-ink-200"
              >
                {related.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};
