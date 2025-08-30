// services/api.js
import axios from 'axios';

// Crear instancia base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  response => {
    // Log para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Si el token expiró (401), intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
            refreshToken,
          });

          const newToken = response.data.token;
          localStorage.setItem('authToken', newToken);

          // Reintentar la petición original
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Manejo de errores comunes
    const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response error:', {
        status: error.response?.status,
        message: errorMessage,
        url: error.config?.url,
      });
    }

    // Crear objeto de error normalizado
    const normalizedError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response,
    };

    return Promise.reject(normalizedError);
  }
);

// Servicios de autenticación
export const authService = {
  login: credentials => api.post('/auth/login', credentials),
  register: userData => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: refreshToken => api.post('/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: data => api.put('/auth/profile', data),
  forgotPassword: email => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: token => api.post('/auth/verify-email', { token }),
};

// Servicios de productos
export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: id => api.get(`/products/${id}`),
  createProduct: productData => api.post('/products', productData),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: id => api.delete(`/products/${id}`),
  uploadImages: (id, formData) =>
    api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  removeImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  getNearbyProducts: (lat, lng, radius = 10) =>
    api.get('/products/nearby', {
      params: { lat, lng, radius },
    }),
  searchProducts: (query, filters = {}) =>
    api.get('/products/search', {
      params: { q: query, ...filters },
    }),
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  getFeaturedProducts: () => api.get('/products/featured'),
  reportProduct: (id, reportData) => api.post(`/products/${id}/report`, reportData),
  favoriteProduct: id => api.post(`/products/${id}/favorite`),
  unfavoriteProduct: id => api.delete(`/products/${id}/favorite`),
  getFavorites: () => api.get('/products/favorites'),
  incrementViews: id => api.put(`/products/${id}/views`),
};

// Servicios de transacciones
export const transactionService = {
  createTransaction: data => api.post('/transactions', data),
  getUserTransactions: status =>
    api.get('/transactions/my', {
      params: status ? { status } : {},
    }),
  getTransaction: id => api.get(`/transactions/${id}`),
  updateTransactionStatus: (id, status, notes) =>
    api.put(`/transactions/${id}/status`, {
      status,
      notes,
    }),
  completeTransaction: (id, rating, review) =>
    api.put(`/transactions/${id}/complete`, {
      rating,
      review,
    }),
  cancelTransaction: (id, reason) => api.put(`/transactions/${id}/cancel`, { reason }),
  requestTransaction: (productId, message) =>
    api.post('/transactions/request', {
      productId,
      message,
    }),
  acceptTransaction: id => api.put(`/transactions/${id}/accept`),
  rejectTransaction: (id, reason) => api.put(`/transactions/${id}/reject`, { reason }),
};

// Servicios de chat
export const chatService = {
  getUserChats: () => api.get('/chat'),
  getChat: chatId => api.get(`/chat/${chatId}`),
  createChat: (participantId, productId, initialMessage) =>
    api.post('/chat', {
      participantId,
      productId,
      initialMessage,
    }),
  getChatMessages: (chatId, page = 1, limit = 50) =>
    api.get(`/chat/${chatId}/messages`, {
      params: { page, limit },
    }),
  sendMessage: (chatId, content, type = 'text') =>
    api.post(`/chat/${chatId}/messages`, {
      content,
      type,
    }),
  markAsRead: chatId => api.put(`/chat/${chatId}/read`),
  uploadFile: (chatId, formData) =>
    api.post(`/chat/${chatId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteMessage: (chatId, messageId) => api.delete(`/chat/${chatId}/messages/${messageId}`),
  editMessage: (chatId, messageId, content) =>
    api.put(`/chat/${chatId}/messages/${messageId}`, {
      content,
    }),
};

// Servicios de usuarios
export const userService = {
  getUserProfile: id => api.get(`/users/${id}`),
  updateProfile: data => api.put('/users/profile', data),
  uploadAvatar: formData =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAvatar: () => api.delete('/users/avatar'),
  getUserStats: id => api.get(`/users/${id || 'me'}/stats`),
  updateNotifications: settings => api.put('/users/notifications', settings),
  getNotificationSettings: () => api.get('/users/notifications'),
  updateLocation: locationData => api.put('/users/location', locationData),
  searchUsers: query => api.get('/users/search', { params: { q: query } }),
  followUser: id => api.post(`/users/${id}/follow`),
  unfollowUser: id => api.delete(`/users/${id}/follow`),
  getFollowers: id => api.get(`/users/${id}/followers`),
  getFollowing: id => api.get(`/users/${id}/following`),
  blockUser: id => api.post(`/users/${id}/block`),
  unblockUser: id => api.delete(`/users/${id}/block`),
  getBlockedUsers: () => api.get('/users/blocked'),
};

// Servicios de reseñas y calificaciones
export const reviewService = {
  createReview: data => api.post('/reviews', data),
  getUserReviews: (userId, params = {}) => api.get(`/reviews/user/${userId}`, { params }),
  getProductReviews: (productId, params = {}) =>
    api.get(`/reviews/product/${productId}`, { params }),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: id => api.delete(`/reviews/${id}`),
  reportReview: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
  likeReview: id => api.post(`/reviews/${id}/like`),
  unlikeReview: id => api.delete(`/reviews/${id}/like`),
};

// Servicios de notificaciones
export const notificationService = {
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  markAsRead: id => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: id => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  updatePushSubscription: subscription =>
    api.post('/notifications/push-subscription', subscription),
};

// Servicios de ubicación y geolocalización
export const locationService = {
  reverseGeocode: (lat, lng) => api.get('/location/reverse', { params: { lat, lng } }),
  searchLocations: query => api.get('/location/search', { params: { q: query } }),
  getNearbyUsers: (lat, lng, radius = 10) =>
    api.get('/location/nearby-users', {
      params: { lat, lng, radius },
    }),
  updateUserLocation: locationData => api.put('/location/update', locationData),
};

// Servicios administrativos
export const adminService = {
  // Dashboard y estadísticas
  getDashboardStats: () => api.get('/admin/dashboard'),
  getSystemStats: (period = '30d') => api.get('/admin/stats', { params: { period } }),

  // Gestión de usuarios
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  getUserDetails: id => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status, reason) =>
    api.put(`/admin/users/${id}/status`, { status, reason }),
  banUser: (id, reason, duration) => api.put(`/admin/users/${id}/ban`, { reason, duration }),
  unbanUser: id => api.put(`/admin/users/${id}/unban`),
  deleteUser: id => api.delete(`/admin/users/${id}`),

  // Gestión de productos
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  moderateProduct: (id, action, reason) =>
    api.put(`/admin/products/${id}/moderate`, { action, reason }),
  deleteProduct: (id, reason) => api.delete(`/admin/products/${id}`, { data: { reason } }),

  // Reportes y moderación
  getReports: (params = {}) => api.get('/admin/reports', { params }),
  getReport: id => api.get(`/admin/reports/${id}`),
  resolveReport: (id, resolution, notes) =>
    api.put(`/admin/reports/${id}/resolve`, { resolution, notes }),
  escalateReport: (id, notes) => api.put(`/admin/reports/${id}/escalate`, { notes }),

  // Configuración del sistema
  getSettings: () => api.get('/admin/settings'),
  updateSettings: settings => api.put('/admin/settings', settings),

  // Gestión de materiales y categorías
  getCategories: () => api.get('/admin/categories'),
  createCategory: data => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: id => api.delete(`/admin/categories/${id}`),

  getMaterials: () => api.get('/admin/materials'),
  createMaterial: data => api.post('/admin/materials', data),
  updateMaterial: (id, data) => api.put(`/admin/materials/${id}`, data),
  deleteMaterial: id => api.delete(`/admin/materials/${id}`),

  // Logs y auditoría
  getActivityLogs: (params = {}) => api.get('/admin/logs', { params }),
  getErrorLogs: (params = {}) => api.get('/admin/logs/errors', { params }),

  // Backup y mantenimiento
  createBackup: () => api.post('/admin/backup'),
  getBackups: () => api.get('/admin/backups'),
  restoreBackup: backupId => api.post(`/admin/backups/${backupId}/restore`),

  // Comunicaciones masivas
  sendBulkNotification: data => api.post('/admin/notifications/bulk', data),
  sendEmail: data => api.post('/admin/emails/send', data),

  // Analytics avanzados
  getAnalytics: (type, period = '30d') =>
    api.get('/admin/analytics', {
      params: { type, period },
    }),
  exportData: (type, format = 'csv') =>
    api.get('/admin/export', {
      params: { type, format },
      responseType: 'blob',
    }),
};

// Utilidades para manejo de errores
export const handleApiError = error => {
  if (error.isNetworkError) {
    return 'Error de conexión. Verifica tu internet.';
  }

  switch (error.status) {
    case 400:
      return error.data?.message || 'Datos inválidos';
    case 401:
      return 'Sesión expirada. Inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 429:
      return 'Demasiadas peticiones. Intenta más tarde.';
    case 500:
      return 'Error interno del servidor';
    default:
      return error.message || 'Error inesperado';
  }
};

// Función para crear FormData con archivos
export const createFormData = (data, fileFields = []) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (fileFields.includes(key) && value instanceof FileList) {
      Array.from(value).forEach(file => {
        formData.append(key, file);
      });
    } else if (fileFields.includes(key) && value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};

export default api;
