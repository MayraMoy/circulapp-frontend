// utils/performance.js - Utilidades de rendimiento
export const performance = {
  // Prefetch de rutas
  prefetchRoute: routePath => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  },

  // Preload de imágenes críticas
  preloadImage: src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Lazy loading de scripts
  loadScript: (src, async = true) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  // Throttle para eventos de scroll
  throttle: (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(
          () => {
            func.apply(this, args);
            lastExecTime = Date.now();
          },
          delay - (currentTime - lastExecTime)
        );
      }
    };
  },

  // Intersection Observer para lazy loading
  createIntersectionObserver: (callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
  },

  // Web Vitals tracking
  trackWebVitals: callback => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(callback);
        getFID(callback);
        getFCP(callback);
        getLCP(callback);
        getTTFB(callback);
      });
    }
  },
};
