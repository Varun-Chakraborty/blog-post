import { CiDark, CiDesktop, CiLight } from 'react-icons/ci';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const themes = {
  light: { icon: CiLight, name: 'Light' },
  dark: { icon: CiDark, name: 'Dark' },
  system: { icon: CiDesktop, name: 'System' }
};

export function Theme({ className }: Readonly<{ className?: string }>) {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('light');
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    if ('theme' in localStorage) {
      const theme = localStorage.getItem('theme') as 'dark' | 'light';
      setTheme(theme);
    } else {
      setTheme('system');
    }
    setLoadingTheme(false);
  }, []);

  useEffect(() => {
    if (!loadingTheme) {
      if (theme === 'system') {
        const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        document.documentElement.classList.toggle(
          'dark',
          preferredTheme === 'dark'
        );
        if ('theme' in localStorage) localStorage.removeItem('theme');
      } else {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
      }
    }
  }, [theme]);

  return (
    <button
      onClick={() =>
        setTheme(theme => {
          if (theme === 'light') return 'dark';
          else if (theme === 'dark') return 'system';
          else return 'light';
        })
      }
      className={cn(
        'p-3 rounded-lg flex items-center gap-3 hover:bg-primary/15 dark:hover:bg-primary/30 w-full',
        className
      )}
    >
      {themes[theme].icon({ className: 'w-6 h-6' })}
      {themes[theme].name}
    </button>
  );
}
