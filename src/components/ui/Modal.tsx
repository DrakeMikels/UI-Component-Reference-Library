import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, open, onClose, children }: ModalProps) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-4 backdrop-blur-sm md:items-center"
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-ink-200/80 bg-ink-50 p-6 shadow-2xl dark:border-ink-700 dark:bg-ink-900 md:p-8"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-ink-300 p-2 text-ink-700 transition hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close dialog</span>
            </button>
            {children}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
