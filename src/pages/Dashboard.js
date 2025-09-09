// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
  Fab,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp,
  LocalShipping,
  People,
  Star,
  Visibility,
  Chat,
  LocationOn,
  CalendarToday,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { productService, userService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Componente para el icono emoji
const EcoIcon = ({ sx }) => (
  <span
    style={{
      fontSize: '40px',
      lineHeight: 1,
      opacity: 0.7,
    }}
  >
    🌱
  </span>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productsOffered: 0,
    productsReceived: 0,
    transactionsCompleted: 0,
    carbonFootprintSaved: 0,
    reputation: { average: 0, count: 0 },
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas del usuario
      const userStats = await userService.getUserStats();
      setStats(userStats.data);

      // Cargar productos recientes del usuario
      const myProducts = await productService.getProducts({
        owner: user._id,
        limit: 3,
        sort: '-createdAt',
      });
      setRecentProducts(myProducts.data.products || []);

      // Cargar productos cercanos
      if (user.location?.coordinates) {
        const nearby = await productService.getNearbyProducts(
          user.location.coordinates.lat,
          user.location.coordinates.lng,
          10 // 10km radius
        );
        setNearbyProducts(nearby.data.products?.slice(0, 4) || []);
      }

      // Eliminar notificaciones predeterminadas
      setRecentActivity([]); // O cargar desde una fuente real si existe
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando tu dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Saludo y resumen */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          ¡Hola, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí tienes un resumen de tu actividad en CirculApp
        </Typography>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.productsOffered}
                  </Typography>
                  <Typography variant="body2">Productos Ofrecidos</Typography>
                </Box>
                <AddIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.transactionsCompleted}
                  </Typography>
                  <Typography variant="body2">Transacciones</Typography>
                </Box>
                <LocalShipping sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.carbonFootprintSaved}kg
                  </Typography>
                  <Typography variant="body2">CO₂ Ahorrado</Typography>
                </Box>
                <EcoIcon />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.reputation.average.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    Reputación ({stats.reputation.count} reseñas)
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={8}>
          {/* Mis productos recientes */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Mis Productos Recientes
                </Typography>
                <Button endIcon={<ArrowForward />} onClick={() => navigate('/products?filter=my')}>
                  Ver todos
                </Button>
              </Box>

              {recentProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {recentProducts.map(product => (
                    <Grid item xs={12} sm={4} key={product._id}>
                      <Card
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        <Box
                          sx={{
                            height: 120,
                            bgcolor: 'grey.200',
                            backgroundImage: product.images?.[0]?.url
                              ? `url(${product.images[0].url})`
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {!product.images?.[0]?.url && (
                            <Typography variant="body2" color="text.secondary">
                              Sin imagen
                            </Typography>
                          )}
                        </Box>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="subtitle2" noWrap>
                            {product.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip
                              label={product.status === 'available' ? 'Disponible' : product.status}
                              size="small"
                              color={product.status === 'available' ? 'success' : 'default'}
                            />
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 1,
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                              }}
                            >
                              <Visibility sx={{ fontSize: 12, mr: 0.5 }} />
                              {product.views || 0}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">
                  No tienes productos publicados aún.
                  <Button size="small" onClick={() => navigate('/create-product')} sx={{ ml: 1 }}>
                    Crear tu primer producto
                  </Button>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Productos cercanos */}
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Productos Cerca de Ti
                </Typography>
                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/products?filter=nearby')}
                >
                  Ver más
                </Button>
              </Box>

              {nearbyProducts.length > 0 ? (
                <Grid container spacing={2}>
                  {nearbyProducts.map(product => (
                    <Grid item xs={12} sm={6} key={product._id}>
                      <Card
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        <Box sx={{ display: 'flex' }}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: 'grey.200',
                              backgroundImage: product.images?.[0]?.url
                                ? `url(${product.images[0].url})`
                                : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              flexShrink: 0,
                            }}
                          />
                          <CardContent sx={{ p: 1.5, flex: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {product.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                              {product.location?.city}
                            </Typography>
                            <Chip
                              label={product.condition}
                              size="small"
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">No encontramos productos cerca de tu ubicación.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={4}>
          {/* Progreso del perfil */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Completar Perfil
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  75% completado
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Completa tu perfil para generar más confianza
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/profile')}>
                Completar perfil
              </Button>
            </CardContent>
          </Card>

          {/* Actividad reciente */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Actividad Reciente
              </Typography>
              {recentActivity.length === 0 ? (
                <Alert severity="info">No hay actividad reciente.</Alert>
              ) : (
                recentActivity.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2, width: 32, height: 32 }}>
                        <IconComponent sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{activity.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hace {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAB para crear producto */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => navigate('/create-product')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Dashboard;
