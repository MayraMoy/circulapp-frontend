// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Flag,
  LocationOn,
  CalendarToday,
  Visibility,
  Chat,
  Favorite,
  FavoriteBorder,
  Phone,
  Email,
  Person,
  Star,
  NavigateNext,
  NavigateBefore,
  Close,
} from '@mui/icons-material';
import { productService, transactionService, chatService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Diálogos
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // Estados de formularios
  const [requestMessage, setRequestMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data);
      setIsFavorite(response.data.isFavorite || false);

      // Incrementar vistas
      await productService.incrementViews(id);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestProduct = async () => {
    try {
      await transactionService.requestTransaction(id, requestMessage);
      setRequestDialogOpen(false);
      setRequestMessage('');
      alert('Solicitud enviada correctamente');
    } catch (err) {
      console.error('Error requesting product:', err);
      alert('Error al enviar la solicitud');
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await chatService.createChat(
        product.owner._id,
        id,
        `Hola, estoy interesado en tu producto: ${product.title}`
      );
      navigate(`/chat/${response.data._id}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Error al iniciar el chat');
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await productService.unfavoriteProduct(id);
      } else {
        await productService.favoriteProduct(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleReport = async () => {
    try {
      await productService.reportProduct(id, { reason: reportReason });
      setReportDialogOpen(false);
      setReportReason('');
      alert('Reporte enviado correctamente');
    } catch (err) {
      console.error('Error reporting product:', err);
      alert('Error al enviar el reporte');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={100} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Producto no encontrado'}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  const isOwner = user?._id === product.owner._id;
  const images = product.images || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/products')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ ml: 2, flexGrow: 1 }}>
          {product.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={toggleFavorite}>
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
          <IconButton onClick={() => setReportDialogOpen(true)}>
            <Flag />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Imágenes */}
        <Grid item xs={12} md={8}>
          <Card>
            {images.length > 0 ? (
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={images[currentImageIndex]?.url}
                  alt={product.title}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => setImageDialogOpen(true)}
                />

                {images.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                      }}
                      onClick={() =>
                        setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
                      }
                    >
                      <NavigateBefore sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                      }}
                      onClick={() =>
                        setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
                      }
                    >
                      <NavigateNext sx={{ color: 'white' }} />
                    </IconButton>
                  </>
                )}

                {images.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <ImageList cols={Math.min(images.length, 5)} gap={8} sx={{ width: 'auto' }}>
                      {images.map((img, index) => (
                        <ImageListItem key={index}>
                          <Box
                            component="img"
                            src={img.url}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1,
                              cursor: 'pointer',
                              border: currentImageIndex === index ? 2 : 0,
                              borderColor: 'primary.main',
                            }}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                }}
              >
                <Typography color="text.secondary">Sin imágenes</Typography>
              </Box>
            )}
          </Card>

          {/* Descripción */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={product.category} color="primary" />
                <Chip label={product.condition} color="secondary" />
                <Chip
                  label={product.status === 'available' ? 'Disponible' : 'No disponible'}
                  color={product.status === 'available' ? 'success' : 'error'}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', align: 'center', gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {product.location?.address}, {product.location?.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', align: 'center', gap: 1, mb: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', align: 'center', gap: 1 }}>
                    <Visibility fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {product.views || 0} visualizaciones
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del propietario y acciones */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Propietario
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={product.owner.avatar} sx={{ width: 60, height: 60, mr: 2 }}>
                  {product.owner.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {product.owner.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={product.owner.rating || 0} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary">
                      ({product.owner.reviewCount || 0} reseñas)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Miembro desde {new Date(product.owner.createdAt).getFullYear()}
                  </Typography>
                </Box>
              </Box>

              {!isOwner && product.status === 'available' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Chat />}
                    onClick={handleStartChat}
                  >
                    Enviar Mensaje
                  </Button>

                  <Button variant="outlined" fullWidth onClick={() => setRequestDialogOpen(true)}>
                    Solicitar Producto
                  </Button>
                </Box>
              )}

              {isOwner && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/products/${id}/edit`)}
                  >
                    Editar Producto
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                        // Implementar eliminación
                      }
                    }}
                  >
                    Eliminar Producto
                  </Button>
                </Box>
              )}

              {product.status !== 'available' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Este producto ya no está disponible
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Adicional
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemText primary="Categoría" secondary={product.category} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Condición" secondary={product.condition} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Material"
                    secondary={product.material || 'No especificado'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Dimensiones"
                    secondary={product.dimensions || 'No especificado'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo de solicitud */}
      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Solicitar Producto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Envía un mensaje al propietario explicando por qué te interesa este producto.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escribe tu mensaje aquí..."
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleRequestProduct}
            variant="contained"
            disabled={!requestMessage.trim()}
          >
            Enviar Solicitud
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de imágenes */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setImageDialogOpen(false)}
          >
            <Close sx={{ color: 'white' }} />
          </IconButton>

          {images.length > 0 && (
            <Box
              component="img"
              src={images[currentImageIndex]?.url}
              alt={product.title}
              sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </Box>
      </Dialog>

      {/* Diálogo de reporte */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Reportar Producto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Describe el motivo del reporte..."
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleReport} color="error" disabled={!reportReason.trim()}>
            Enviar Reporte
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetail;
