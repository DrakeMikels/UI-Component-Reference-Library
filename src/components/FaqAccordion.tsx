import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-ink-200/80 bg-white/80 dark:border-ink-800 dark:bg-ink-900/70"
          >
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900"
                aria-expanded={isOpen}
                onClick={() => setOpenId((previous) => (previous === item.id ? null : item.id))}
              >
                <span className="font-semibold text-ink-900 dark:text-ink-50">{item.question}</span>
                <ChevronDown
                  className={[
                    'h-4 w-4 text-ink-500 transition-transform dark:text-ink-400',
                    isOpen ? 'rotate-180' : ''
                  ].join(' ')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="px-4 pb-4 text-sm leading-relaxed text-ink-700 dark:text-ink-200">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
};
