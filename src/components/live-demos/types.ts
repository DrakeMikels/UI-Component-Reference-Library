import { ComponentEntry } from '../../types';

export type ExampleScenario = 'dashboard' | 'onboarding' | 'commerce';

export type DemoKind =
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

export interface ScenarioDefinition {
  key: ExampleScenario;
  title: string;
  description: string;
  actionLabel: string;
  placeholder: string;
  options: [string, string, string];
  stages: [string, string, string];
}

export interface DemoProps {
  component: ComponentEntry;
  scenario: ScenarioDefinition;
}
