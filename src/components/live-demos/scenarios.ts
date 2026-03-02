import { ComponentEntry } from '../../types';
import { DemoKind, ScenarioDefinition } from './types';

export const scenarioDefinitions: ScenarioDefinition[] = [
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

export const regionOptions: [string, string, string] = ['North', 'Central', 'South'];

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

export const resolveDemoKind = (component: ComponentEntry): DemoKind => {
  const fromId = demoKindById[component.id];
  if (fromId) {
    return fromId;
  }

  if (component.tags.includes('Search')) return 'search';
  if (component.tags.includes('Filters')) return 'filter';
  if (component.tags.includes('Input')) return 'text';
  if (component.tags.includes('Charts') || component.tags.includes('Analytics')) return 'chart';
  if (component.tags.includes('Geo')) return 'geo';
  if (component.tags.includes('Workflow')) return 'workflow';
  if (
    component.tags.includes('Feedback') ||
    component.tags.includes('Status') ||
    component.tags.includes('Loading') ||
    component.tags.includes('Notifications')
  ) {
    return 'feedback';
  }
  if (component.tags.includes('Navigation') || component.tags.includes('Menu')) return 'navigation';
  if (component.tags.includes('Data')) return 'data';
  if (component.tags.includes('Layout') || component.tags.includes('Content') || component.tags.includes('Identity')) return 'content';

  return 'generic';
};
