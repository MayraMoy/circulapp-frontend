// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  Star,
  Verified,
  Settings,
  Notifications,
  Security,
  Help,
  PhotoCamera,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userService, productService, reviewService } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [editMode, setEditMode] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  // Estados del perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: {
      address: user?.location?.address || '',
      city: user?.location?.city || '',
      province: user?.location?.province || '',
    },
  });

  const [userStats, setUserStats] = useState({
    productsOffered: 0,
    transactionsCompleted: 0,
    rating: 0,
    reviewCount: 0,
  });

  const [userProducts, setUserProducts] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    chat: true,
    transactions: true,
    marketing: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas
      const statsResponse = await userService.getUserStats();
      setUserStats(statsResponse.data);

      // Cargar productos del usuario
      const productsResponse = await productService.getProducts({ owner: user._id });
      setUserProducts(productsResponse.data.products || []);

      // Cargar reseñas
      const reviewsResponse = await reviewService.getUserReviews(user._id);
      setUserReviews(reviewsResponse.data.reviews || []);

      // Cargar configuración de notificaciones
      const notificationsResponse = await userService.getNotificationSettings();
      setNotificationSettings(notificationsResponse.data);
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(profileData);
      updateUser(response.data.user);
      setEditMode(false);
      alert('Perfil actualizado correctamente');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await userService.uploadAvatar(formData);
      updateUser({ avatar: response.data.avatar });
      setAvatarDialogOpen(false);
      alert('Avatar actualizado correctamente');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Error al subir la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (setting, value) => {
    try {
      const newSettings = { ...notificationSettings, [setting]: value };
      await userService.updateNotifications(newSettings);
      setNotificationSettings(newSettings);
    } catch (err) {
      console.error('Error updating notifications:', err);
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Información básica del usuario */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar src={user?.avatar} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: -8,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  onClick={() => setAvatarDialogOpen(true)}
                >
                  <PhotoCamera />
                </IconButton>
              </Box>

              <Typography variant="h5" gutterBottom>
                {user?.name}
                {user?.verified && <Verified sx={{ ml: 1, color: 'primary.main' }} />}
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph>
                {user?.bio || 'Sin biografía'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Rating value={userStats.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({userStats.reviewCount} reseñas)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justify: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {userStats.productsOffered}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Productos
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {userStats.transactionsCompleted}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Transacciones
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'left', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {user?.location?.city}, {user?.location?.province}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Miembro desde {new Date(user?.createdAt).getFullYear()}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={user?.userType === 'comuna' ? 'Comuna' : 'Usuario Individual'}
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Contenido principal con tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Perfil" value="profile" />
              <Tab label="Mis Productos" value="products" />
              <Tab label="Reseñas" value="reviews" />
              <Tab label="Configuración" value="settings" />
            </Tabs>
          </Paper>

          {/* Tab: Perfil */}
          <TabPanel value={activeTab} index="profile">
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Información Personal</Typography>
                  <Button
                    startIcon={editMode ? <Cancel /> : <EditIcon />}
                    onClick={() => {
                      if (editMode) {
                        setProfileData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          bio: user?.bio || '',
                          location: {
                            address: user?.location?.address || '',
                            city: user?.location?.city || '',
                            province: user?.location?.province || '',
                          },
                        });
                      }
                      setEditMode(!editMode);
                    }}
                  >
                    {editMode ? 'Cancelar' : 'Editar'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value={profileData.name}
                      onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={profileData.phone}
                      onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Biografía"
                      value={profileData.bio}
                      onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!editMode}
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Ubicación
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={profileData.location.address}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          location: { ...prev.location, address: e.target.value },
                        }))
                      }
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ciudad"
                      value={profileData.location.city}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value },
                        }))
                      }
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Provincia"
                      value={profileData.location.province}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          location: { ...prev.location, province: e.target.value },
                        }))
                      }
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', justify: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Tab: Mis Productos */}
          <TabPanel value={activeTab} index="products">
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h6">Mis Productos ({userProducts.length})</Typography>
              <Button variant="contained" onClick={() => navigate('/create-product')}>
                Nuevo Producto
              </Button>
            </Box>

            {userProducts.length > 0 ? (
              <Grid container spacing={2}>
                {userProducts.map(product => (
                  <Grid item xs={12} sm={6} key={product._id}>
                    <Card
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      <Box sx={{ display: 'flex' }}>
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'grey.200',
                            backgroundImage: product.images?.[0]
                              ? `url(${product.images[0].url})`
                              : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" noWrap>
                            {product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.description?.substring(0, 60)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={
                                product.status === 'available' ? 'Disponible' : 'No disponible'
                              }
                              size="small"
                              color={product.status === 'available' ? 'success' : 'default'}
                            />
                            <Chip label={product.category} size="small" variant="outlined" />
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No tienes productos publicados aún.
                <Button onClick={() => navigate('/create-product')} sx={{ ml: 2 }}>
                  Crear tu primer producto
                </Button>
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Reseñas */}
          <TabPanel value={activeTab} index="reviews">
            <Typography variant="h6" gutterBottom>
              Reseñas Recibidas ({userReviews.length})
            </Typography>

            {userReviews.length > 0 ? (
              <List>
                {userReviews.map((review, index) => (
                  <React.Fragment key={review._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={review.reviewer?.avatar}>
                          {review.reviewer?.name?.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">{review.reviewer?.name}</Typography>
                            <Rating value={review.rating} size="small" readOnly />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary" paragraph>
                              {review.comment}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < userReviews.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Alert severity="info">Aún no tienes reseñas.</Alert>
            )}
          </TabPanel>

          {/* Tab: Configuración */}
          <TabPanel value={activeTab} index="settings">
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuración de Notificaciones
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.email}
                        onChange={e => handleNotificationChange('email', e.target.checked)}
                      />
                    }
                    label="Notificaciones por email"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Recibe notificaciones importantes por correo electrónico
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.push}
                        onChange={e => handleNotificationChange('push', e.target.checked)}
                      />
                    }
                    label="Notificaciones push"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Recibe notificaciones en tu dispositivo
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.chat}
                        onChange={e => handleNotificationChange('chat', e.target.checked)}
                      />
                    }
                    label="Mensajes de chat"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Notificaciones cuando recibas nuevos mensajes
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.transactions}
                        onChange={e => handleNotificationChange('transactions', e.target.checked)}
                      />
                    }
                    label="Transacciones"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Actualizaciones sobre el estado de tus transacciones
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.marketing}
                        onChange={e => handleNotificationChange('marketing', e.target.checked)}
                      />
                    }
                    label="Noticias y promociones"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Recibe información sobre nuevas funciones y promociones
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Security />}
                    onClick={() => navigate('/change-password')}
                  >
                    Cambiar Contraseña
                  </Button>

                  <Button variant="outlined" startIcon={<Help />} onClick={() => navigate('/help')}>
                    Centro de Ayuda
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta?')) {
                        // Implementar eliminación de cuenta
                      }
                    }}
                  >
                    Eliminar Cuenta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Grid>
      </Grid>

      {/* Diálogo para cambiar avatar */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)}>
        <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ width: '100%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
