// context/AppContext.js - Context principal de la aplicación
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext();

const initialState = {
  theme: 'light',
  language: 'es',
  notifications: [],
  favorites: [],
  recentSearches: [],
  userPreferences: {
    showTutorial: true,
    emailNotifications: true,
    pushNotifications: true,
    locationSharing: true,
  },
  ui: {
    sidebarOpen: false,
    loading: false,
    error: null,
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)], // Max 10
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };

    case 'ADD_RECENT_SEARCH':
      const newSearches = [
        action.payload,
        ...state.recentSearches.filter(s => s !== action.payload),
      ].slice(0, 5); // Max 5 búsquedas recientes
      return { ...state, recentSearches: newSearches };

    case 'CLEAR_RECENT_SEARCHES':
      return { ...state, recentSearches: [] };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };

    case 'SET_UI_STATE':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };

    case 'RESET_STATE':
      return { ...initialState, ...action.payload };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const savedState = storage.local.get('appState');
    if (savedState) {
      dispatch({ type: 'RESET_STATE', payload: savedState });
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    storage.local.set('appState', {
      theme: state.theme,
      language: state.language,
      favorites: state.favorites,
      recentSearches: state.recentSearches,
      userPreferences: state.userPreferences,
    });
  }, [state.theme, state.language, state.favorites, state.recentSearches, state.userPreferences]);

  // Actions
  const actions = {
    setTheme: theme => dispatch({ type: 'SET_THEME', payload: theme }),

    setLanguage: language => dispatch({ type: 'SET_LANGUAGE', payload: language }),

    showNotification: notification => {
      const id = Date.now().toString();
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id, ...notification, timestamp: new Date() },
      });

      // Auto-remove después de 5 segundos si es success
      if (notification.type === 'success') {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
        }, 5000);
      }
    },

    removeNotification: id => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),

    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),

    addFavorite: productId => dispatch({ type: 'ADD_FAVORITE', payload: productId }),

    removeFavorite: productId => dispatch({ type: 'REMOVE_FAVORITE', payload: productId }),

    addRecentSearch: search => dispatch({ type: 'ADD_RECENT_SEARCH', payload: search }),

    clearRecentSearches: () => dispatch({ type: 'CLEAR_RECENT_SEARCHES' }),

    updatePreferences: preferences =>
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences }),

    setLoading: loading => dispatch({ type: 'SET_UI_STATE', payload: { loading } }),

    setError: error => dispatch({ type: 'SET_UI_STATE', payload: { error } }),

    toggleSidebar: () =>
      dispatch({
        type: 'SET_UI_STATE',
        payload: { sidebarOpen: !state.ui.sidebarOpen },
      }),
  };

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
