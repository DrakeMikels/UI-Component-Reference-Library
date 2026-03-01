export type RouteTab = 'components' | 'design-systems' | 'about';

export type ComponentSort = 'name' | 'popularity' | 'examples';
export type DesignSystemSort = 'name' | 'coverage' | 'components';

export interface ComponentEntry {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  tags: string[];
  technologies: string[];
  exampleCount: number;
  popularity: number;
  useCases: string[];
  relatedIds: string[];
}

export interface DesignSystemEntry {
  id: string;
  name: string;
  owner: string;
  description: string;
  technologies: string[];
  openSource: boolean;
  componentCount: number;
  coverageScore: number;
  highlights: string[];
}

export interface PaletteAction {
  id: string;
  label: string;
  subtitle: string;
  type: 'route' | 'filter' | 'component';
  run: () => void;
}
