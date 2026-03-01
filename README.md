# Component Atlas

A production-ready interactive catalog/reference app for UI components and design systems, inspired by the purpose of component galleries while using original code, structure, and styling.

## Stack

- Vite
- React + TypeScript
- TailwindCSS
- Framer Motion

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Feature Walkthrough

- **Responsive editorial UI** with serif display accents, restrained palette, thin borders, premium spacing, and gradient background treatment.
- **Header/Nav**
  - Brand/title
  - Global search input with `Cmd/Ctrl + K` command shortcut hint
  - Light/dark theme toggle with localStorage persistence
  - Tabs: Components, Design Systems, About
- **Components View**
  - Hero with catalog stats and guidance copy
  - URL-synced search, sort (`Popularity`, `Name`, `Examples Count`), and filter chips (tech + feature tags)
  - Rich interactive card grid
  - Detail modal with aliases, use cases, mock example links, related components
- **Design Systems View**
  - URL-synced search and sort (`Coverage`, `Component Count`, `Name`)
  - Stack filter chips
  - Metadata-rich cards (tech stack, open-source state, coverage score)
- **About View**
  - Purpose, methodology, contribution CTA
  - Accessible FAQ accordion
- **Global interactions**
  - Command palette (`Cmd/Ctrl + K`) for route jumps, quick filters, and highlighted component jumps
  - Page and modal transitions with reduced-motion support

## Data Model

- `src/data/components.ts`: 50+ realistic component entries with aliases, tags, technologies, popularity, examples count, use cases, and related links.
- `src/data/designSystems.ts`: 30+ design system entries with owner, stack, open-source status, coverage score, and highlights.
- Strong shared types in `src/types.ts`.

## Accessibility + Engineering Notes

- Semantic landmarks (`header`, `nav`, `main`, section labels)
- Labeled controls and keyboard navigability
- Visible focus states on interactive controls
- ARIA attributes for dialog and accordion states
- Reduced motion respected via `MotionConfig` + `useReducedMotion`
- Performance-aware filtering/sorting via `useMemo`

