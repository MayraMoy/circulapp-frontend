// context/NotificationContext.js - Context específico para notificaciones
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', options = {}) => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      duration: options.duration || (type === 'error' ? 6000 : 4000),
      action: options.action,
      persistent: options.persistent || false,
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
  }, []);

  const removeNotification = useCallback(id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Shortcuts para diferentes tipos
  const showSuccess = useCallback(
    (message, options = {}) => {
      showNotification(message, 'success', options);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message, options = {}) => {
      showNotification(message, 'error', options);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      showNotification(message, 'warning', options);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      showNotification(message, 'info', options);
    },
    [showNotification]
  );

  const value = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Renderizar las notificaciones */}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: `${80 + index * 80}px` }}
          onClose={() => removeNotification(notification.id)}
        >
          <Alert
            severity={notification.type}
            onClose={() => removeNotification(notification.id)}
            action={notification.action}
            sx={{ minWidth: 300 }}
          >
            {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  return context;
};
