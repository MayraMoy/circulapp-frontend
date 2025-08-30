// services/index.js
import api from './api';

// Servicios de autenticación
export const authService = {
  login: credentials => api.post('/auth/login', credentials),
  register: userData => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: data => api.put('/auth/profile', data),
};

// Servicios de reciclaje
export const recyclingService = {
  // Obtener todos los puntos de reciclaje
  getRecyclingPoints: () => api.get('/recycling/points'),

  // Obtener punto específico
  getRecyclingPoint: id => api.get(`/recycling/points/${id}`),

  // Crear nuevo punto de reciclaje
  createRecyclingPoint: data => api.post('/recycling/points', data),

  // Actualizar punto de reciclaje
  updateRecyclingPoint: (id, data) => api.put(`/recycling/points/${id}`, data),

  // Eliminar punto de reciclaje
  deleteRecyclingPoint: id => api.delete(`/recycling/points/${id}`),

  // Obtener tipos de materiales
  getMaterials: () => api.get('/recycling/materials'),

  // Registrar actividad de reciclaje
  recordRecyclingActivity: data => api.post('/recycling/activities', data),

  // Obtener historial de reciclaje del usuario
  getRecyclingHistory: userId => api.get(`/recycling/history/${userId}`),
};

// Servicios de productos
export const productService = {
  // Obtener productos con filtros
  getProducts: params => api.get('/products', { params }),

  // Obtener producto específico
  getProduct: id => api.get(`/products/${id}`),

  // Crear nuevo producto
  createProduct: productData => api.post('/products', productData),

  // Actualizar producto
  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  // Eliminar producto
  deleteProduct: id => api.delete(`/products/${id}`),

  // Subir imágenes
  uploadImages: (id, formData) =>
    api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Buscar productos cercanos
  getNearbyProducts: (lat, lng, radius) =>
    api.get('/products/nearby', {
      params: { lat, lng, radius },
    }),

  // Obtener productos por categoría
  getByCategory: category => api.get(`/products/category/${category}`),

  // Reportar producto
  reportProduct: (id, reportData) => api.post(`/products/${id}/report`, reportData),
};

// Servicios de transacciones
export const transactionService = {
  // Crear nueva transacción
  createTransaction: data => api.post('/transactions', data),

  // Obtener transacciones del usuario
  getUserTransactions: () => api.get('/transactions/my'),

  // Actualizar estado de transacción
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),

  // Obtener transacción específica
  getTransaction: id => api.get(`/transactions/${id}`),

  // Completar transacción
  completeTransaction: id => api.put(`/transactions/${id}/complete`),

  // Cancelar transacción
  cancelTransaction: (id, reason) => api.put(`/transactions/${id}/cancel`, { reason }),
};

// Servicios de chat
export const chatService = {
  // Obtener chats del usuario
  getUserChats: () => api.get('/chat'),

  // Crear nuevo chat
  createChat: data => api.post('/chat', data),

  // Obtener mensajes de un chat
  getChatMessages: chatId => api.get(`/chat/${chatId}/messages`),

  // Enviar mensaje
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/messages`, { message }),

  // Marcar mensajes como leídos
  markAsRead: chatId => api.put(`/chat/${chatId}/read`),
};

// Servicios de reseñas
export const reviewService = {
  // Crear reseña
  createReview: data => api.post('/reviews', data),

  // Obtener reseñas de usuario
  getUserReviews: userId => api.get(`/reviews/user/${userId}`),

  // Actualizar reseña
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),

  // Eliminar reseña
  deleteReview: id => api.delete(`/reviews/${id}`),
};

// Servicios de usuarios
export const userService = {
  // Obtener perfil de usuario
  getUserProfile: id => api.get(`/users/${id}`),

  // Actualizar perfil
  updateProfile: data => api.put('/users/profile', data),

  // Subir avatar
  uploadAvatar: formData =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Obtener estadísticas del usuario
  getUserStats: () => api.get('/users/stats'),

  // Actualizar configuración de notificaciones
  updateNotifications: settings => api.put('/users/notifications', settings),
};

// Servicios administrativos
export const adminService = {
  // Obtener reportes
  getReports: params => api.get('/admin/reports', { params }),

  // Resolver reporte
  resolveReport: (id, resolution) => api.put(`/admin/reports/${id}/resolve`, resolution),

  // Obtener estadísticas del sistema
  getSystemStats: () => api.get('/admin/stats'),

  // Gestión de usuarios
  getUsers: params => api.get('/admin/users', { params }),
  moderateUser: (id, action) => api.put(`/admin/users/${id}/moderate`, { action }),

  // Gestión de materiales
  getMaterials: () => api.get('/admin/materials'),
  createMaterial: data => api.post('/admin/materials', data),
  updateMaterial: (id, data) => api.put(`/admin/materials/${id}`, data),

  // Horarios de recolección
  getSchedules: params => api.get('/admin/schedules', { params }),
  createSchedule: data => api.post('/admin/schedules', data),
  updateSchedule: (id, data) => api.put(`/admin/schedules/${id}`, data),
};
