// hooks/useInfiniteScroll.js
import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 && // Cargar 1000px antes del final
      hasMore &&
      !loading
    ) {
      setLoading(true);
      fetchMore().finally(() => setLoading(false));
    }
  }, [fetchMore, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { loading };
};
