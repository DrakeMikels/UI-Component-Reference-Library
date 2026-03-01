import { motion, useReducedMotion } from 'framer-motion';
import { ComponentEntry } from '../types';
import { classNames } from '../utils/classNames';
import { TagChip } from './ui/TagChip';

interface ComponentCardProps {
  component: ComponentEntry;
  onSelect: (id: string) => void;
}

type PreviewFamily =
  | 'actionButtons'
  | 'textFormInputs'
  | 'searchDiscovery'
  | 'selectionControls'
  | 'navigation'
  | 'dataTable'
  | 'overlayDialog'
  | 'feedbackLoading'
  | 'chartVisual'
  | 'workflow'
  | 'contentIdentity'
  | 'fallbackGeneric';

interface PreviewSignalSet {
  id: string[];
  tags: string[];
  useCases: string[];
}

interface PreviewContext {
  component: ComponentEntry;
  primaryLabel: string;
  secondaryLabel: string;
  tagLabel: string;
}

const previewFamilyOrder: PreviewFamily[] = [
  'actionButtons',
  'textFormInputs',
  'searchDiscovery',
  'selectionControls',
  'navigation',
  'dataTable',
  'overlayDialog',
  'feedbackLoading',
  'chartVisual',
  'workflow',
  'contentIdentity',
  'fallbackGeneric'
];

const previewSignals: Record<PreviewFamily, PreviewSignalSet> = {
  actionButtons: {
    id: ['button'],
    tags: ['action'],
    useCases: ['submit', 'trigger', 'toolbar', 'confirm', 'export', 'shortcut']
  },
  textFormInputs: {
    id: ['input', 'textarea', 'editor', 'picker', 'upload', 'form-field', 'combobox'],
    tags: ['input', 'forms', 'calendar'],
    useCases: ['capture', 'search', 'notes', 'description', 'message', 'settings']
  },
  searchDiscovery: {
    id: ['command-menu', 'spotlight-search', 'combobox', 'search', 'command', 'spotlight'],
    tags: ['search', 'keyboard', 'navigation'],
    useCases: ['search', 'discovery', 'jump', 'open', 'command', 'picker', 'lookup']
  },
  selectionControls: {
    id: ['checkbox', 'radio', 'switch', 'select', 'segmented', 'slider', 'chip', 'toggle'],
    tags: ['selection', 'filters', 'settings'],
    useCases: ['choice', 'selection', 'toggle', 'preference', 'assignment', 'boundaries']
  },
  navigation: {
    id: ['nav', 'menu', 'tabs', 'pagination', 'breadcrumb', 'sidebar', 'footer', 'accordion', 'tree-view'],
    tags: ['navigation', 'menu', 'layout', 'keyboard', 'search'],
    useCases: ['navigation', 'jump', 'paths', 'workspace', 'browsing', 'results']
  },
  dataTable: {
    id: ['table', 'grid', 'stat', 'comparison', 'filter-builder', 'list-detail'],
    tags: ['data', 'enterprise', 'analytics', 'dashboard'],
    useCases: ['reports', 'inventory', 'metrics', 'audit', 'analysis', 'matrix']
  },
  overlayDialog: {
    id: ['modal', 'drawer', 'popover', 'tooltip', 'dropdown', 'dialog'],
    tags: ['overlay', 'interactive'],
    useCases: ['confirmation', 'details', 'quick cards', 'settings', 'menus']
  },
  feedbackLoading: {
    id: ['toast', 'alert', 'badge', 'skeleton', 'spinner', 'progress'],
    tags: ['feedback', 'loading', 'status', 'notifications'],
    useCases: ['loading', 'confirmations', 'notices', 'retry', 'alerts', 'maintenance']
  },
  chartVisual: {
    id: ['chart', 'map'],
    tags: ['charts', 'analytics', 'geo'],
    useCases: ['trend', 'monitoring', 'allocation', 'channels', 'coverage']
  },
  workflow: {
    id: ['stepper', 'timeline', 'kanban', 'calendar', 'activity-feed', 'progress'],
    tags: ['workflow'],
    useCases: ['checkout', 'process', 'stages', 'pipelines', 'planning', 'milestones', 'queues']
  },
  contentIdentity: {
    id: ['card', 'avatar', 'list', 'empty-state', 'rich-text'],
    tags: ['content', 'identity', 'media', 'onboarding'],
    useCases: ['profile', 'comments', 'stream', 'guidance', 'writing', 'preview']
  },
  fallbackGeneric: {
    id: [],
    tags: [],
    useCases: []
  }
};

const previewToneClassByFamily: Record<PreviewFamily, string> = {
  actionButtons:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900',
  textFormInputs:
    'border-ink-300 bg-white dark:border-ink-700 dark:bg-ink-900',
  searchDiscovery:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900',
  selectionControls:
    'border-ink-300 bg-white dark:border-ink-700 dark:bg-ink-900',
  navigation:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900',
  dataTable:
    'border-ink-300 bg-white dark:border-ink-700 dark:bg-ink-900',
  overlayDialog:
    'border-ink-300 bg-ink-100 dark:border-ink-700 dark:bg-ink-900',
  feedbackLoading:
    'border-ink-300 bg-white dark:border-ink-700 dark:bg-ink-900',
  chartVisual:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900',
  workflow:
    'border-ink-300 bg-white dark:border-ink-700 dark:bg-ink-900',
  contentIdentity:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900',
  fallbackGeneric:
    'border-ink-300 bg-ink-50 dark:border-ink-700 dark:bg-ink-900'
};

const countMatches = (source: string, keywords: string[]): number =>
  keywords.reduce((score, keyword) => (source.includes(keyword) ? score + 1 : score), 0);

const searchPreviewIds = new Set(['command-menu', 'spotlight-search', 'combobox']);

const resolvePreviewFamily = (component: ComponentEntry): PreviewFamily => {
  if (searchPreviewIds.has(component.id)) {
    return 'searchDiscovery';
  }

  const idText = component.id.toLowerCase();
  const tagText = component.tags.join(' ').toLowerCase();
  const useCaseText = component.useCases.join(' ').toLowerCase();

  let selected: PreviewFamily = 'fallbackGeneric';
  let selectedScore = 0;

  previewFamilyOrder.forEach((family) => {
    const signals = previewSignals[family];
    const score = countMatches(idText, signals.id) * 4 + countMatches(tagText, signals.tags) * 2 + countMatches(useCaseText, signals.useCases);

    if (score > selectedScore) {
      selected = family;
      selectedScore = score;
    }
  });

  return selected;
};

const toShortLabel = (value: string | undefined, fallback: string): string => {
  if (!value) {
    return fallback;
  }

  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return fallback;
  }

  return clean.split(' ').slice(0, 3).join(' ');
};

const buildPreviewContext = (component: ComponentEntry): PreviewContext => {
  const primaryLabel = toShortLabel(component.useCases[0], component.name);
  const secondaryLabel = toShortLabel(component.useCases[1], component.aliases[0] ?? 'Preview');
  const tagLabel = toShortLabel(component.tags[0], 'Core');

  return {
    component,
    primaryLabel,
    secondaryLabel,
    tagLabel
  };
};

const ActionButtonsPreview = ({ primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div className="flex items-center gap-2">
      <div className="flex h-8 flex-1 items-center rounded-lg bg-pine-600/90 px-2 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-pine-500/80">
        <span className="truncate">{primaryLabel}</span>
      </div>
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-ink-300/70 bg-white/90 text-sm font-bold text-ink-600 dark:border-ink-600 dark:bg-ink-900/70 dark:text-ink-200">
        +
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-flex rounded-full border border-pine-200 bg-pine-50 px-2 py-1 text-[10px] font-semibold text-pine-800 dark:border-pine-700 dark:bg-pine-900/40 dark:text-pine-100">
        {tagLabel}
      </span>
      <span className="truncate text-[10px] text-ink-600 dark:text-ink-300">{secondaryLabel}</span>
    </div>
  </div>
);

const TextFormInputsPreview = ({ primaryLabel, secondaryLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div>
      <div className="h-2 w-20 rounded bg-ink-300/90 dark:bg-ink-500/80" />
      <div className="mt-1.5 flex h-8 items-center rounded-lg border border-ink-300/70 bg-white/90 px-2 dark:border-ink-600 dark:bg-ink-900/70">
        <span className="truncate text-[10px] text-ink-500 dark:text-ink-400">{primaryLabel}</span>
      </div>
    </div>
    <div>
      <div className="h-2 w-24 rounded bg-ink-200/90 dark:bg-ink-600/70" />
      <div className="mt-1.5 flex h-6 items-center rounded-md border border-ink-200/80 bg-ink-50/80 px-2 dark:border-ink-700 dark:bg-ink-900/60">
        <span className="truncate text-[10px] text-ink-400 dark:text-ink-500">{secondaryLabel}</span>
      </div>
    </div>
  </div>
);

const SearchDiscoveryPreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div className="flex items-center gap-2 rounded-lg border border-pine-200/80 bg-white/90 px-2 py-1.5 dark:border-pine-700/70 dark:bg-ink-900/70">
      <span className="relative h-3.5 w-3.5 rounded-full border border-ink-400 dark:border-ink-500">
        <span className="absolute -bottom-0.5 right-[-2px] h-1.5 w-1 rounded-full bg-ink-400 rotate-45 dark:bg-ink-500" />
      </span>
      <span className="truncate text-[10px] text-ink-600 dark:text-ink-300">{primaryLabel}</span>
      <span className="rounded border border-ink-300/80 bg-white px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-ink-500 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-400">
        Ctrl+K
      </span>
    </div>
    <div className="space-y-1.5">
      {[primaryLabel, secondaryLabel].map((label, index) => (
        <div
          key={`${component.id}-search-result-${label}-${index}`}
          className="flex items-center justify-between rounded-md border border-ink-200/80 bg-white/85 px-2 py-1 dark:border-ink-700 dark:bg-ink-900/60"
        >
          <span className="truncate text-[10px] text-ink-700 dark:text-ink-200">{label}</span>
          <span className="text-[9px] text-ink-500 dark:text-ink-400">{index === 0 ? 'Open' : 'Jump'}</span>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between text-[9px]">
      <span className="rounded-full border border-pine-200 bg-pine-50 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-pine-700 dark:border-pine-700 dark:bg-pine-900/35 dark:text-pine-100">
        {tagLabel}
      </span>
      <span className="text-ink-500 dark:text-ink-400">{component.exampleCount} indexed</span>
    </div>
  </div>
);

const SelectionControlsPreview = ({ primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div className="space-y-1.5">
      {[primaryLabel, secondaryLabel].map((label, index) => (
        <div
          key={`${label}-${index}`}
          className="flex items-center gap-2 rounded-md border border-ink-200/80 bg-white/80 px-2 py-1 dark:border-ink-700 dark:bg-ink-900/60"
        >
          <span
            className={classNames(
              'h-3.5 w-3.5 rounded border',
              index === 0
                ? 'border-pine-600 bg-pine-500/80 dark:border-pine-500 dark:bg-pine-500/70'
                : 'border-ink-400 bg-white dark:border-ink-600 dark:bg-ink-900'
            )}
          />
          <span className="truncate text-[10px] text-ink-700 dark:text-ink-200">{label}</span>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between rounded-md border border-ink-200/80 bg-white/80 px-2 py-1 dark:border-ink-700 dark:bg-ink-900/60">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">{tagLabel}</span>
      <span className="relative h-4 w-7 rounded-full bg-pine-500/75 dark:bg-pine-500/70">
        <span className="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-white" />
      </span>
    </div>
  </div>
);

const NavigationPreview = ({ primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div className="flex items-center gap-1 rounded-lg border border-ink-200/80 bg-white/80 p-1 dark:border-ink-700 dark:bg-ink-900/60">
      {['Home', tagLabel, 'View'].map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={classNames(
            'min-w-0 flex-1 truncate rounded-md px-1 py-1 text-center text-[9px] font-semibold uppercase tracking-wide',
            index === 1
              ? 'bg-pine-600 text-white dark:bg-pine-500/80'
              : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
          )}
        >
          {item}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-1 text-[10px] text-ink-500 dark:text-ink-400">
      <span className="truncate">Root</span>
      <span>/</span>
      <span className="truncate">{primaryLabel}</span>
      <span>/</span>
      <span className="truncate">{secondaryLabel}</span>
    </div>
    <div className="grid grid-cols-3 gap-1">
      {[primaryLabel, secondaryLabel, tagLabel].map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="truncate rounded-md border border-ink-200/80 bg-white/80 px-1 py-1 text-center text-[9px] text-ink-600 dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-300"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const DataTablePreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="h-full overflow-hidden rounded-lg border border-ink-200/80 bg-white/85 dark:border-ink-700 dark:bg-ink-900/65">
    <div className="grid grid-cols-3 bg-ink-100/80 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-ink-600 dark:bg-ink-800 dark:text-ink-300">
      <span>Item</span>
      <span>Status</span>
      <span className="text-right">Value</span>
    </div>
    <div className="divide-y divide-ink-200/80 dark:divide-ink-700">
      {[primaryLabel, secondaryLabel, tagLabel].map((label, index) => (
        <div key={`${label}-${index}`} className="grid grid-cols-3 items-center px-1.5 py-1.5 text-[10px]">
          <span className="truncate text-ink-700 dark:text-ink-200">{label}</span>
          <span
            className={classNames(
              'w-fit rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
              index === 0
                ? 'bg-pine-100 text-pine-800 dark:bg-pine-900/40 dark:text-pine-100'
                : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
            )}
          >
            {index === 0 ? 'Live' : 'Ready'}
          </span>
          <span className="text-right text-ink-500 dark:text-ink-400">{component.exampleCount + index}</span>
        </div>
      ))}
    </div>
  </div>
);

const OverlayDialogPreview = ({ primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="relative h-full overflow-hidden rounded-lg border border-ink-300/70 bg-white/80 dark:border-ink-700 dark:bg-ink-900/65">
    <div className="absolute inset-0 bg-ink-900/20 dark:bg-ink-950/40" />
    <div className="absolute inset-x-3 top-3 rounded-md border border-ink-200/80 bg-white/95 p-2 dark:border-ink-700 dark:bg-ink-800/95">
      <div className="h-2 w-20 rounded bg-ink-300/90 dark:bg-ink-500/70" />
      <div className="mt-1.5 h-2 w-full rounded bg-ink-200/90 dark:bg-ink-700/80" />
      <div className="mt-1.5 h-2 w-4/5 rounded bg-ink-200/70 dark:bg-ink-700/60" />
      <div className="mt-2 flex justify-end gap-1">
        <span className="rounded-md border border-ink-300/80 px-1.5 py-0.5 text-[9px] text-ink-600 dark:border-ink-600 dark:text-ink-300">
          {primaryLabel}
        </span>
        <span className="rounded-md bg-pine-600 px-1.5 py-0.5 text-[9px] font-semibold text-white dark:bg-pine-500/80">{tagLabel}</span>
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] text-ink-100 dark:text-ink-300">{secondaryLabel}</div>
  </div>
);

const FeedbackLoadingPreview = ({ primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col justify-between">
    <div className="flex items-center gap-2 rounded-lg border border-pine-200 bg-white/90 px-2 py-1.5 dark:border-pine-700 dark:bg-ink-900/70">
      <span className="h-2 w-2 rounded-full bg-pine-500 animate-pulse" />
      <span className="truncate text-[10px] font-medium text-ink-700 dark:text-ink-200">{primaryLabel}</span>
    </div>
    <div className="space-y-1">
      <div className="h-2 w-full rounded bg-ink-200/90 animate-pulse dark:bg-ink-700/70" />
      <div className="h-2 w-3/4 rounded bg-ink-200/70 animate-pulse dark:bg-ink-700/50" />
    </div>
    <div className="flex items-center gap-2 text-[10px] text-ink-600 dark:text-ink-300">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-pine-500 border-t-transparent" />
      <span className="truncate">{secondaryLabel}</span>
      <span className="rounded-full border border-pine-200 bg-pine-50 px-1.5 py-0.5 text-[9px] font-semibold text-pine-700 dark:border-pine-700 dark:bg-pine-900/40 dark:text-pine-100">
        {tagLabel}
      </span>
    </div>
  </div>
);

const ChartVisualPreview = ({ component, primaryLabel, tagLabel }: PreviewContext) => {
  const base = component.popularity % 12;
  const barHeights = [28 + base, 45 + (component.exampleCount % 10), 36 + (base % 7), 58 - (base % 8), 42 + (component.exampleCount % 7)];

  return (
    <div className="relative h-full">
      <svg viewBox="0 0 100 44" className="absolute inset-x-0 top-1 h-12 w-full" aria-hidden="true">
        <path d="M4 35 L22 20 L40 24 L58 12 L76 18 L94 8" fill="none" stroke="currentColor" strokeWidth="2" className="text-pine-600/80 dark:text-pine-400/80" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex h-14 items-end gap-1">
        {barHeights.map((height, index) => (
          <span
            key={`${component.id}-${index}-${height}`}
            style={{ height: `${height}%` }}
            className={classNames(
              'flex-1 rounded-t-sm',
              index === 3 ? 'bg-pine-600/85 dark:bg-pine-500/80' : 'bg-amberline/70 dark:bg-amberline/60'
            )}
          />
        ))}
      </div>
      <div className="absolute left-0 top-0 rounded-full border border-pine-200 bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-pine-700 dark:border-pine-700 dark:bg-ink-900/80 dark:text-pine-100">
        {tagLabel}
      </div>
      <div className="absolute bottom-0 right-0 max-w-[60%] truncate text-[10px] text-ink-600 dark:text-ink-300">{primaryLabel}</div>
    </div>
  );
};

const WorkflowPreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => {
  const progressWidth = Math.max(30, Math.min(88, component.popularity - 8));

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative flex items-center justify-between px-1">
        <span className="absolute left-4 right-4 top-1.5 h-px bg-ink-300 dark:bg-ink-600" />
        {[primaryLabel, secondaryLabel, tagLabel].map((step, index) => (
          <div key={`${step}-${index}`} className="relative z-10 flex w-1/3 flex-col items-center gap-1">
            <span
              className={classNames(
                'grid h-3.5 w-3.5 place-items-center rounded-full text-[8px] font-bold',
                index === 2
                  ? 'border border-ink-300 bg-white text-ink-600 dark:border-ink-600 dark:bg-ink-900 dark:text-ink-300'
                  : 'bg-pine-600 text-white dark:bg-pine-500/80'
              )}
            >
              {index + 1}
            </span>
            <span className="w-full truncate text-center text-[9px] text-ink-600 dark:text-ink-300">{step}</span>
          </div>
        ))}
      </div>
      <div className="h-2 rounded-full bg-ink-200 dark:bg-ink-700">
        <div style={{ width: `${progressWidth}%` }} className="h-full rounded-full bg-pine-600 dark:bg-pine-500/85" />
      </div>
      <div className="grid grid-cols-3 gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={`${component.id}-lane-${index}`}
            className={classNames(
              'h-5 rounded-md border',
              index === 1
                ? 'border-pine-400 bg-pine-100 dark:border-pine-600 dark:bg-pine-900/35'
                : 'border-ink-200 bg-white/80 dark:border-ink-700 dark:bg-ink-900/60'
            )}
          />
        ))}
      </div>
    </div>
  );
};

const ContentIdentityCardPreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => {
  const aliasLabel = toShortLabel(component.aliases[0], component.name);

  return (
    <div className="h-full rounded-lg border border-ink-200/80 bg-white/90 p-2 dark:border-ink-700 dark:bg-ink-900/65">
      <div className="flex items-center justify-between rounded-md bg-gradient-to-r from-pine-200/80 via-pine-100/80 to-amberline/35 px-2 py-1 dark:from-pine-900/50 dark:via-pine-900/35 dark:to-amberline/20">
        <span className="truncate text-[8px] font-semibold uppercase tracking-wide text-pine-800 dark:text-pine-100">{tagLabel}</span>
        <span className="text-[8px] text-ink-600 dark:text-ink-300">{component.exampleCount} refs</span>
      </div>
      <p className="mt-2 truncate text-[10px] font-semibold text-ink-700 dark:text-ink-200">{primaryLabel}</p>
      <p className="mt-1 truncate text-[9px] text-ink-500 dark:text-ink-400">{secondaryLabel}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="truncate text-[9px] text-ink-600 dark:text-ink-300">{aliasLabel}</span>
        <span className="rounded-full border border-pine-200 bg-pine-50 px-1.5 py-0.5 text-[8px] font-semibold text-pine-700 dark:border-pine-700 dark:bg-pine-900/35 dark:text-pine-100">
          {component.popularity}% fit
        </span>
      </div>
    </div>
  );
};

const ContentIdentityListPreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => {
  const rows = [primaryLabel, secondaryLabel, toShortLabel(component.aliases[0], component.name)];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-1">
        {rows.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center gap-2 rounded-md border border-ink-200/80 bg-white/85 px-2 py-1 dark:border-ink-700 dark:bg-ink-900/60"
          >
            <span
              className={classNames(
                'h-4 w-4 rounded-full',
                index === 0
                  ? 'bg-gradient-to-br from-pine-300 to-pine-200 dark:from-pine-700 dark:to-pine-500'
                  : index === 1
                    ? 'bg-gradient-to-br from-amberline/70 to-pine-100 dark:from-amberline/50 dark:to-pine-700'
                    : 'bg-gradient-to-br from-ink-300 to-ink-200 dark:from-ink-600 dark:to-ink-500'
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium text-ink-700 dark:text-ink-200">{label}</p>
              <p className="truncate text-[9px] text-ink-500 dark:text-ink-400">
                {index === 2 ? tagLabel : toShortLabel(component.useCases[index + 1], component.tags[index] ?? 'Entry')}
              </p>
            </div>
            <span className="rounded-full border border-ink-200/80 bg-ink-50/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-ink-600 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300">
              {index === 0 ? 'New' : index === 1 ? 'Active' : 'Saved'}
            </span>
          </div>
        ))}
      </div>
      <span className="truncate text-[10px] text-ink-600 dark:text-ink-300">{component.exampleCount} list entries</span>
    </div>
  );
};

const ContentIdentityAvatarPreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => {
  const profileRows = [
    { title: primaryLabel, meta: secondaryLabel },
    { title: toShortLabel(component.useCases[2], component.aliases[0] ?? component.name), meta: tagLabel }
  ];
  const activeCount = Math.max(2, Math.min(8, Math.floor(component.exampleCount / 4)));

  return (
    <div className="h-full rounded-lg border border-ink-200/80 bg-white/85 p-2 dark:border-ink-700 dark:bg-ink-900/60">
      <div className="space-y-1.5">
        {profileRows.map((row, index) => (
          <div key={`${row.title}-${index}`} className="flex items-center gap-2">
            <span
              className={classNames(
                'relative h-6 w-6 rounded-full border border-ink-200/80 dark:border-ink-700',
                index === 0
                  ? 'bg-gradient-to-br from-pine-300 to-pine-200 dark:from-pine-700 dark:to-pine-600'
                  : 'bg-gradient-to-br from-amberline/70 to-pine-100 dark:from-amberline/50 dark:to-pine-800'
              )}
            >
              <span
                className={classNames(
                  'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-ink-900',
                  index === 0 ? 'bg-pine-500' : 'bg-amberline'
                )}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium text-ink-700 dark:text-ink-200">{row.title}</p>
              <p className="truncate text-[9px] text-ink-500 dark:text-ink-400">{row.meta}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] text-ink-500 dark:text-ink-400">
        <span className="truncate">{toShortLabel(component.aliases[0], 'Profile')}</span>
        <span className="rounded-full border border-pine-200 bg-pine-50 px-1.5 py-0.5 font-semibold text-pine-700 dark:border-pine-700 dark:bg-pine-900/35 dark:text-pine-100">
          +{activeCount} active
        </span>
      </div>
    </div>
  );
};

const ContentIdentityEmptyStatePreview = ({ component, primaryLabel, secondaryLabel, tagLabel }: PreviewContext) => (
  <div className="flex h-full flex-col items-center justify-between rounded-lg border border-dashed border-ink-300/80 bg-white/80 p-2 text-center dark:border-ink-600 dark:bg-ink-900/60">
    <span className="mt-1 grid h-8 w-8 place-items-center rounded-full border border-pine-200 bg-pine-50 dark:border-pine-700 dark:bg-pine-900/35">
      <span className="h-3 w-3 rounded-full bg-pine-500/85 dark:bg-pine-400/90" />
    </span>
    <div className="w-full space-y-1">
      <p className="truncate text-[10px] font-semibold text-ink-700 dark:text-ink-200">{primaryLabel}</p>
      <p className="truncate text-[9px] text-ink-500 dark:text-ink-400">{secondaryLabel}</p>
      <div className="mx-auto h-1.5 w-4/5 rounded bg-ink-200/80 dark:bg-ink-700/60" />
      <div className="mx-auto h-1.5 w-3/5 rounded bg-ink-200/60 dark:bg-ink-700/45" />
      <div className="flex items-center justify-between text-[9px] text-ink-500 dark:text-ink-400">
        <span className="truncate">{toShortLabel(component.useCases[2], component.tags[1] ?? 'Guided setup')}</span>
        <span>{component.exampleCount} refs</span>
      </div>
    </div>
    <span className="rounded-full bg-pine-600 px-2 py-0.5 text-[9px] font-semibold text-white dark:bg-pine-500/80">
      Create {tagLabel.toLowerCase()}
    </span>
  </div>
);

const ContentIdentityRichTextPreview = ({ primaryLabel, secondaryLabel }: PreviewContext) => (
  <div className="h-full rounded-lg border border-ink-200/80 bg-white/90 p-2 dark:border-ink-700 dark:bg-ink-900/60">
    <div className="flex items-center gap-1">
      {['B', 'I', 'T'].map((control, index) => (
        <span
          key={`rich-control-${control}-${index}`}
          className={classNames(
            'grid h-4 w-4 place-items-center rounded border text-[8px] font-semibold',
            index === 0
              ? 'border-pine-400 bg-pine-100 text-pine-700 dark:border-pine-600 dark:bg-pine-900/35 dark:text-pine-100'
              : 'border-ink-200 bg-white text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300'
          )}
        >
          {control}
        </span>
      ))}
      <span className="ml-auto h-1.5 w-10 rounded bg-ink-200/80 dark:bg-ink-700/60" />
    </div>
    <div className="mt-2 space-y-1">
      <div className="h-2 w-full rounded bg-ink-200/90 dark:bg-ink-700/70" />
      <div className="h-2 w-11/12 rounded bg-ink-200/80 dark:bg-ink-700/60" />
      <div className="h-2 w-4/5 rounded bg-ink-200/80 dark:bg-ink-700/60" />
    </div>
    <div className="mt-2 rounded-md border-l-2 border-pine-400 bg-pine-50/70 px-2 py-1 text-[9px] text-pine-700 dark:border-pine-600 dark:bg-pine-900/25 dark:text-pine-100">
      {primaryLabel}
    </div>
    <div className="mt-1 truncate text-[9px] text-ink-500 dark:text-ink-400">{secondaryLabel}</div>
  </div>
);

const ContentIdentityPreview = (context: PreviewContext) => {
  const { component } = context;

  if (component.id === 'card') {
    return <ContentIdentityCardPreview {...context} />;
  }

  if (component.id === 'list') {
    return <ContentIdentityListPreview {...context} />;
  }

  if (component.id === 'avatar') {
    return <ContentIdentityAvatarPreview {...context} />;
  }

  if (component.id === 'empty-state') {
    return <ContentIdentityEmptyStatePreview {...context} />;
  }

  if (component.id.includes('rich-text')) {
    return <ContentIdentityRichTextPreview {...context} />;
  }

  return <ContentIdentityCardPreview {...context} />;
};

const FallbackGenericPreview = ({ component, primaryLabel }: PreviewContext) => (
  <div className="grid h-full grid-cols-3 gap-1.5">
    <div className="col-span-2 rounded-lg border border-ink-200/80 bg-white/85 p-2 dark:border-ink-700 dark:bg-ink-900/65">
      <div className="h-2 w-16 rounded bg-ink-300/90 dark:bg-ink-500/80" />
      <div className="mt-1.5 h-2 w-full rounded bg-ink-200/90 dark:bg-ink-600/70" />
      <div className="mt-1.5 h-2 w-4/5 rounded bg-ink-200/70 dark:bg-ink-600/60" />
    </div>
    <div className="rounded-lg border border-ink-200/80 bg-white/85 p-2 dark:border-ink-700 dark:bg-ink-900/65">
      <div className="text-[10px] font-semibold text-ink-600 dark:text-ink-300">{component.exampleCount}</div>
      <div className="mt-1 text-[9px] text-ink-500 dark:text-ink-400">{primaryLabel}</div>
    </div>
    <div className="col-span-3 rounded-md border border-ink-200/80 bg-white/70 px-2 py-1 text-[9px] text-ink-500 dark:border-ink-700 dark:bg-ink-900/55 dark:text-ink-400">
      Metadata preview
    </div>
  </div>
);

const ComponentCardPreview = ({ component }: { component: ComponentEntry }) => {
  const family = resolvePreviewFamily(component);
  const context = buildPreviewContext(component);

  let preview: JSX.Element;

  switch (family) {
    case 'actionButtons':
      preview = <ActionButtonsPreview {...context} />;
      break;
    case 'textFormInputs':
      preview = <TextFormInputsPreview {...context} />;
      break;
    case 'searchDiscovery':
      preview = <SearchDiscoveryPreview {...context} />;
      break;
    case 'selectionControls':
      preview = <SelectionControlsPreview {...context} />;
      break;
    case 'navigation':
      preview = <NavigationPreview {...context} />;
      break;
    case 'dataTable':
      preview = <DataTablePreview {...context} />;
      break;
    case 'overlayDialog':
      preview = <OverlayDialogPreview {...context} />;
      break;
    case 'feedbackLoading':
      preview = <FeedbackLoadingPreview {...context} />;
      break;
    case 'chartVisual':
      preview = <ChartVisualPreview {...context} />;
      break;
    case 'workflow':
      preview = <WorkflowPreview {...context} />;
      break;
    case 'contentIdentity':
      preview = <ContentIdentityPreview {...context} />;
      break;
    default:
      preview = <FallbackGenericPreview {...context} />;
      break;
  }

  return (
    <div
      aria-hidden="true"
      className={classNames(
        'pointer-events-none mb-4 h-28 overflow-hidden border p-3 sm:h-32',
        previewToneClassByFamily[family]
      )}
    >
      {preview}
    </div>
  );
};

export const ComponentCard = ({ component, onSelect }: ComponentCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative overflow-hidden border-2 border-ink-300 bg-white p-5 dark:border-ink-700 dark:bg-ink-900"
    >
      <button
        type="button"
        onClick={() => onSelect(component.id)}
        className="absolute inset-0 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900"
        aria-label={`Open details for ${component.name}`}
      />
      <div className="pointer-events-none absolute right-4 top-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400">
        {component.exampleCount} examples
      </div>

      <ComponentCardPreview component={component} />

      <div className="pointer-events-none relative z-10">
        <h3 className="font-display text-3xl leading-tight tracking-tight text-ink-900 dark:text-ink-50">{component.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-500 dark:text-ink-400">{component.aliases.slice(0, 2).join(' • ')}</p>
        <p className="mt-3 line-clamp-2 text-sm text-ink-700 dark:text-ink-200">{component.description}</p>
        <div className="mt-4 h-px bg-ink-300 dark:bg-ink-700" />
        <div className="mt-4 flex flex-wrap gap-2">
          {component.tags.slice(0, 3).map((tag) => (
            <TagChip key={`${component.id}-${tag}`} label={tag} />
          ))}
        </div>
      </div>
    </motion.article>
  );
};
