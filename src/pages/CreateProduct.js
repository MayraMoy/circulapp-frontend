// src/pages/CreateProduct.js - CORREGIDO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Card,
  CardMedia,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Delete, ArrowBack, Save } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { productService, createFormData } from '../services/api';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: {
      address: user?.location?.address || '',
      city: user?.location?.city || '',
      province: user?.location?.province || '',
      coordinates: {
        lat: user?.location?.coordinates?.lat || -34.6037, // Buenos Aires por defecto
        lng: user?.location?.coordinates?.lng || -58.3816
      },
    },
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // CATEGORÍAS CORREGIDAS (coinciden con el modelo backend)
  const categories = [
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'furniture', label: 'Muebles' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'books', label: 'Libros' },
    { value: 'tools', label: 'Herramientas' },
    { value: 'appliances', label: 'Electrodomésticos' },
    { value: 'sports', label: 'Deportes' },
    { value: 'toys', label: 'Juguetes' },
    { value: 'kitchen', label: 'Cocina' },
    { value: 'garden', label: 'Jardín' },
    { value: 'other', label: 'Otros' },
  ];

  // CONDICIONES CORREGIDAS (coinciden con el modelo backend)
  const conditions = [
    { value: 'excellent', label: 'Excelente' },
    { value: 'good', label: 'Bueno' },
    { value: 'fair', label: 'Regular' },
    { value: 'poor', label: 'Malo' },
  ];

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setError('Máximo 5 imágenes permitidas');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Cada imagen debe ser menor a 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (formData.title.length < 5 || formData.title.length > 100) {
      newErrors.title = 'El título debe tener entre 5 y 100 caracteres';
    }
    
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (formData.description.length < 10 || formData.description.length > 1000) {
      newErrors.description = 'La descripción debe tener entre 10 y 1000 caracteres';
    }
    
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.condition) newErrors.condition = 'La condición es requerida';
    if (!formData.location.address.trim()) newErrors.address = 'La dirección es requerida';
    
    // Validar coordenadas
    if (!formData.location.coordinates.lat || !formData.location.coordinates.lng) {
      newErrors.coordinates = 'Las coordenadas son requeridas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Crear FormData para enviar todo junto (producto + imágenes)
      const submitFormData = new FormData();
      
      // Agregar datos del producto
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('condition', formData.condition);
      submitFormData.append('location[address]', formData.location.address);
      submitFormData.append('location[city]', formData.location.city);
      submitFormData.append('location[province]', formData.location.province);
      submitFormData.append('location[coordinates][lat]', formData.location.coordinates.lat);
      submitFormData.append('location[coordinates][lng]', formData.location.coordinates.lng);

      // Agregar imágenes
      images.forEach((image, index) => {
        submitFormData.append('images', image);
      });

      // Crear producto con imágenes en una sola petición
      const response = await productService.createProduct(submitFormData);

      navigate(`/products/${response.data.product._id}`, {
        state: { message: 'Producto creado exitosamente' },
      });
    } catch (err) {
      console.error('Error creating product:', err);
      
      // Mostrar errores de validación si existen
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.path] = error.msg;
        });
        setErrors(backendErrors);
      } else {
        setError(err.response?.data?.message || 'Error al crear el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ ml: 2 }}>
          Publicar Producto
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información Básica
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Título del producto"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title || 'Entre 5 y 100 caracteres'}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Descripción"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description || 'Entre 10 y 1000 caracteres'}
                placeholder="Describe tu producto, su estado, uso, etc."
                required
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Categoría"
                  onChange={handleInputChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.condition}>
                <InputLabel>Condición</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  label="Condición"
                  onChange={handleInputChange}
                >
                  {conditions.map(condition => (
                    <MenuItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Ubicación
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="location.address"
                label="Dirección"
                value={formData.location.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="location.city"
                label="Ciudad"
                value={formData.location.city}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="location.province"
                label="Provincia"
                value={formData.location.province}
                onChange={handleInputChange}
              />
            </Grid>

            {errors.coordinates && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  {errors.coordinates}. Usando coordenadas de Buenos Aires por defecto.
                </Alert>
              </Grid>
            )}

            {/* Imágenes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Imágenes (Opcional)
              </Typography>

              <Box sx={{ mb: 2 }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={images.length >= 5}
                  >
                    Subir Imágenes ({images.length}/5)
                  </Button>
                </label>
              </Box>

              {imagePreviews.length > 0 && (
                <Grid container spacing={2}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={preview}
                          alt={`Preview ${index + 1}`}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                          }}
                          size="small"
                          onClick={() => removeImage(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12}>
              {loading && <LinearProgress sx={{ mb: 2 }} />}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </Button>

                <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar Producto'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProduct;
