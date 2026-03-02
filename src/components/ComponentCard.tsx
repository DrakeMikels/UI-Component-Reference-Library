import { motion, useReducedMotion } from 'framer-motion';
import { ComponentEntry } from '../types';
import { TagChip } from './ui/TagChip';

interface ComponentCardProps {
  component: ComponentEntry;
  onSelect: (id: string) => void;
}

export const ComponentCard = ({ component, onSelect }: ComponentCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      whileHover={shouldReduceMotion ? undefined : { x: 4, y: -4 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative border-2 border-ink-300 bg-white px-5 py-4 dark:border-ink-700 dark:bg-ink-900"
    >
      <button
        type="button"
        onClick={() => onSelect(component.id)}
        className="absolute inset-0 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-inset"
        aria-label={`Open details for ${component.name}`}
      />

      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-3xl leading-tight tracking-tight text-ink-900 dark:text-ink-50">{component.name}</h3>
          {component.aliases.length > 0 && (
            <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">{component.aliases.slice(0, 3).join(', ')}</p>
          )}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{component.description}</p>
        </div>
        <div className="hidden shrink-0 flex-wrap justify-end gap-1.5 pt-0.5 sm:flex">
          {component.tags.slice(0, 3).map((tag) => (
            <TagChip key={`${component.id}-${tag}`} label={tag} />
          ))}
        </div>
      </div>
    </motion.article>
  );
};
