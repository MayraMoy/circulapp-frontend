// hooks/useGeolocation.js - Hook para geolocalización
import { useState, useEffect, useCallback } from 'react';
import { locationUtils } from '../utils/location';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await locationUtils.getCurrentPosition();

      // Opcional: obtener dirección
      if (options.includeAddress) {
        const address = await locationUtils.reverseGeocode(position.lat, position.lng);
        setLocation({ ...position, address });
      } else {
        setLocation(position);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [options.includeAddress]);

  useEffect(() => {
    if (options.immediate) {
      getCurrentLocation();
    }
  }, [options.immediate, getCurrentLocation]);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearError: () => setError(null),
  };
};
