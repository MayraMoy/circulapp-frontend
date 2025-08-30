// utils/constants.js
export const CONSTANTS = {
  PRODUCT_CATEGORIES: [
    'Electrónicos',
    'Muebles',
    'Ropa',
    'Libros',
    'Deportes',
    'Juguetes',
    'Hogar',
    'Jardín',
    'Herramientas',
    'Otros',
  ],

  PRODUCT_CONDITIONS: ['Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Regular'],

  PRODUCT_STATUS: {
    AVAILABLE: 'available',
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },

  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },

  PAGINATION: {
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
  },

  IMAGE_LIMITS: {
    MAX_SIZE_MB: 5,
    MAX_COUNT: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },

  API_ENDPOINTS: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    PRODUCTS: '/products',
    USERS: '/users',
    AUTH: '/auth',
    CHAT: '/chat',
    TRANSACTIONS: '/transactions',
  },
};
