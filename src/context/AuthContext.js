// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un token almacenado al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verificar que el token sigue siendo válido
          const response = await authService.getProfile();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token,
              user: response.data.user,
            },
          });
        } catch (error) {
          // Token inválido o expirado
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async credentials => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(credentials);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data.token,
          user: response.data.user,
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error en el inicio de sesión';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async userData => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.register(userData);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data.token,
          user: response.data.user,
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error en el registro';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = userData => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Función para verificar permisos
  const hasPermission = permission => {
    if (!state.user) return false;

    switch (permission) {
      case 'admin':
        return state.user.userType === 'comuna';
      case 'producer':
        return ['producer', 'comuna'].includes(state.user.userType);
      case 'individual':
        return true; // Todos los usuarios autenticados
      default:
        return false;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
