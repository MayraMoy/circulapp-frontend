// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
  Avatar,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn,
  Favorite,
  FavoriteBorder,
  Visibility,
  CalendarToday,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtros
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const categories = [
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
  ];

  const conditions = ['Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Regular'];

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery, category, condition, sortBy, location]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        search: searchQuery,
        category,
        condition,
        sort: sortBy,
        location,
      };

      const response = await productService.getProducts(params);
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / 12));
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    setCurrentPage(1);
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category) params.set('category', category);
    if (condition) params.set('condition', condition);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (location) params.set('location', location);
    setSearchParams(params);
  };

  const toggleFavorite = async productId => {
    try {
      // Implementar lógica de favoritos
      console.log('Toggle favorite:', productId);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const ProductCard = ({ product }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.images?.[0]?.url || '/placeholder-image.jpg'}
        alt={product.title}
        onClick={() => navigate(`/products/${product._id}`)}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}
        >
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>
            {product.title}
          </Typography>
          <Tooltip title={product.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(product._id);
              }}
            >
              {product.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1 }}>
          {product.description?.substring(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={product.category} size="small" variant="outlined" />
          <Chip
            label={product.condition}
            size="small"
            color={product.condition === 'Nuevo' ? 'success' : 'default'}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 24, height: 24 }}>{product.owner?.name?.charAt(0)}</Avatar>
          <Typography variant="caption" color="text.secondary">
            {product.owner?.name}
          </Typography>
          {product.owner?.rating && <Rating value={product.owner.rating} size="small" readOnly />}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', align: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {product.location?.city}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', align: 'center', gap: 1 }}>
            <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {product.views || 0}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate(`/products/${product._id}`)}
        >
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header y búsqueda */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Explorar Productos
        </Typography>

        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 250 }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={category}
                label="Categoría"
                onChange={e => setCategory(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Condición</InputLabel>
              <Select
                value={condition}
                label="Condición"
                onChange={e => setCondition(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {conditions.map(cond => (
                  <MenuItem key={cond} value={cond}>
                    {cond}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar</InputLabel>
              <Select value={sortBy} label="Ordenar" onChange={e => setSortBy(e.target.value)}>
                <MenuItem value="newest">Más recientes</MenuItem>
                <MenuItem value="oldest">Más antiguos</MenuItem>
                <MenuItem value="views">Más vistos</MenuItem>
                <MenuItem value="title">Alfabético</MenuItem>
                <MenuItem value="location">Cercanía</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </form>
      </Box>

      {/* Resultados */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="rectangular" width={60} height={24} />
                    <Skeleton variant="rectangular" width={80} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : products.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Alert severity="info">
          No se encontraron productos que coincidan con tu búsqueda.
          <Button
            onClick={() => {
              setSearchQuery('');
              setCategory('');
              setCondition('');
              setSortBy('newest');
              setLocation('');
              setCurrentPage(1);
            }}
            sx={{ ml: 2 }}
          >
            Limpiar filtros
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default Products;
