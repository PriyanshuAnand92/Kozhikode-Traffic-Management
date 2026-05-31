import { create } from 'zustand';
import type { ThemeName } from '../types/traffic';

const themeKey = 'kutis.theme';

const applyTheme = (theme: ThemeName) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
};

const initialTheme = (() => {
  if (typeof window === 'undefined') return 'light' as ThemeName;
  return (localStorage.getItem(themeKey) as ThemeName | null) ?? 'light';
})();

export const useThemeStore = create<{ theme: ThemeName; setTheme: (theme: ThemeName) => void }>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));

if (typeof window !== 'undefined') {
  applyTheme(initialTheme);
}
