// utils/storage.js
export const storage = {
  // LocalStorage con manejo de errores
  local: {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove: key => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  },

  // SessionStorage
  session: {
    get: (key, defaultValue = null) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove: key => {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  },
};
