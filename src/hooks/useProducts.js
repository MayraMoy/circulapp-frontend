// hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: true,
  });
  const [filters, setFilters] = useState(initialFilters);

  const loadProducts = useCallback(
    async (resetProducts = true) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          ...filters,
          page: resetProducts ? 1 : pagination.page,
          limit: 12,
        };

        const response = await productService.getProducts(params);
        const newProducts = response.data.products || [];

        setProducts(prev => (resetProducts ? newProducts : [...prev, ...newProducts]));

        setPagination({
          page: response.data.page || 1,
          totalPages: Math.ceil(response.data.total / 12),
          total: response.data.total || 0,
          hasMore: newProducts.length === 12,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar productos');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page]
  );

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      await loadProducts(false);
    }
  }, [pagination.hasMore, loading, loadProducts]);

  const updateFilters = useCallback(newFilters => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const toggleFavorite = useCallback(
    async productId => {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      // Actualización optimista
      setProducts(prev =>
        prev.map(p => (p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p))
      );

      try {
        if (product.isFavorite) {
          await productService.unfavoriteProduct(productId);
        } else {
          await productService.favoriteProduct(productId);
        }
      } catch (err) {
        // Revertir cambio si falla
        setProducts(prev =>
          prev.map(p => (p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p))
        );
        console.error('Error toggling favorite:', err);
      }
    },
    [products]
  );

  const refetch = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadProducts(true);
  }, [loadProducts]);

  useEffect(() => {
    loadProducts(true);
  }, [filters]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    toggleFavorite,
    loadMore,
    refetch,
  };
};
