// hooks/useTheme.js - Hook para manejo de tema
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useTheme = () => {
  const { state, actions } = useApp();
  const [systemPreference, setSystemPreference] = useState('light');

  useEffect(() => {
    // Detectar preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handler = e => setSystemPreference(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentTheme = state.theme === 'system' ? systemPreference : state.theme;

  const setTheme = theme => {
    actions.setTheme(theme);

    // Actualizar clase en documento
    document.documentElement.className = theme;

    // Actualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    }
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme: currentTheme,
    themePreference: state.theme,
    systemPreference,
    setTheme,
    toggleTheme,
    isDark: currentTheme === 'dark',
  };
};
