// utils/formatters.js
export const formatters = {
  // Formatear fechas
  date: (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
  },

  // Tiempo relativo (hace X tiempo)
  timeAgo: date => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: 'años', seconds: 31536000 },
      { label: 'meses', seconds: 2592000 },
      { label: 'días', seconds: 86400 },
      { label: 'horas', seconds: 3600 },
      { label: 'minutos', seconds: 60 },
      { label: 'segundos', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `hace ${count} ${interval.label}`;
      }
    }

    return 'ahora mismo';
  },

  // Formatear números
  number: (num, options = {}) => {
    return new Intl.NumberFormat('es-ES', options).format(num);
  },

  // Truncar texto
  truncate: (text, length = 100, suffix = '...') => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },

  // Formatear distancia
  distance: distanceInKm => {
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)} metros`;
    }
    return `${distanceInKm.toFixed(1)} km`;
  },
};
