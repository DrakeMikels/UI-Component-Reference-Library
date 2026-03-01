import { useEffect } from 'react';

export const useHotkeys = (matcher: (event: KeyboardEvent) => boolean, onMatch: () => void) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!matcher(event)) {
        return;
      }

      event.preventDefault();
      onMatch();
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [matcher, onMatch]);
};
