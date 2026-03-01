import { ComponentSort, DesignSystemSort } from '../types';

export const COMPONENT_SORTS: ComponentSort[] = ['name', 'popularity', 'examples'];
export const DESIGN_SYSTEM_SORTS: DesignSystemSort[] = ['name', 'coverage', 'components'];
export const LEGACY_QUERY_KEY = 'q';
export const COMPONENT_QUERY_KEY = 'cq';
export const DESIGN_SYSTEM_QUERY_KEY = 'dq';

export type RouteQueryKey = typeof LEGACY_QUERY_KEY | typeof COMPONENT_QUERY_KEY | typeof DESIGN_SYSTEM_QUERY_KEY;

export const getRouteQueryKey = (pathname: string): RouteQueryKey => {
  if (pathname.startsWith('/design-systems')) {
    return DESIGN_SYSTEM_QUERY_KEY;
  }

  if (pathname.startsWith('/components')) {
    return COMPONENT_QUERY_KEY;
  }

  return LEGACY_QUERY_KEY;
};

export const getScopedQuery = (searchParams: URLSearchParams, key: RouteQueryKey): string => {
  const scopedValue = searchParams.get(key);
  if (scopedValue !== null) {
    return scopedValue;
  }

  if (key === LEGACY_QUERY_KEY) {
    return '';
  }

  return searchParams.get(LEGACY_QUERY_KEY) ?? '';
};

export const parseList = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const serializeList = (entries: string[]): string => entries.join(',');

export const toComponentSort = (value: string | null): ComponentSort => {
  if (value && COMPONENT_SORTS.includes(value as ComponentSort)) {
    return value as ComponentSort;
  }

  return 'popularity';
};

export const toDesignSystemSort = (value: string | null): DesignSystemSort => {
  if (value && DESIGN_SYSTEM_SORTS.includes(value as DesignSystemSort)) {
    return value as DesignSystemSort;
  }

  return 'coverage';
};
