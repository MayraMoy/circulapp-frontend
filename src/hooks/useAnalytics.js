// hooks/useAnalytics.js - Hook para analytics
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  const track = useCallback(
    (event, properties = {}) => {
      const eventData = {
        ...properties,
        userId: user?._id,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Google Analytics
      if (window.gtag) {
        window.gtag('event', event, eventData);
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', event, eventData);
      }

      // Analytics personalizado
      if (window.analytics) {
        window.analytics.track(event, eventData);
      }

      // Console en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event, eventData);
      }
    },
    [user]
  );

  const trackPageView = useCallback(
    page => {
      track('Page View', { page });
    },
    [track]
  );

  const trackProductView = useCallback(
    (productId, productTitle) => {
      track('Product Viewed', {
        productId,
        productTitle,
        category: 'Product',
      });
    },
    [track]
  );

  const trackSearch = useCallback(
    (query, results) => {
      track('Search Performed', {
        query,
        resultsCount: results,
        category: 'Search',
      });
    },
    [track]
  );

  const trackProductRequest = useCallback(
    (productId, ownerId) => {
      track('Product Requested', {
        productId,
        ownerId,
        category: 'Transaction',
      });
    },
    [track]
  );

  return {
    track,
    trackPageView,
    trackProductView,
    trackSearch,
    trackProductRequest,
  };
};
