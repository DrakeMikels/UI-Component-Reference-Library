import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'component-atlas-theme';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
