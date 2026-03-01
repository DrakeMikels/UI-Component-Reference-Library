import { classNames } from '../../utils/classNames';

interface TagChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const TagChip = ({ label, active = false, onClick }: TagChipProps) => {
  const sharedClassName = classNames(
    'inline-flex items-center border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-ink-50 dark:focus-visible:ring-offset-ink-900'
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          sharedClassName,
          active
            ? 'border-ink-900 bg-ink-900 text-ink-50 dark:border-ink-100 dark:bg-ink-100 dark:text-ink-900'
            : 'border-ink-300 bg-white text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800'
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <span
      className={classNames(
        sharedClassName,
        'cursor-default border-ink-300 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200'
      )}
    >
      {label}
    </span>
  );
};
