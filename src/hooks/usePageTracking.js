// hooks/usePageTracking.js - Analytics y tracking
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Eventos personalizados para análisis interno
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('Page Viewed', {
        path: location.pathname,
        search: location.search,
        title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [location]);
};
