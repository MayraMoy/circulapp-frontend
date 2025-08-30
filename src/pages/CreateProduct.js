// src/pages/CreateProduct.js
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
  Chip,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  ArrowBack,
  Save,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/api';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    material: '',
    dimensions: '',
    location: {
      address: user?.location?.address || '',
      city: user?.location?.city || '',
      province: user?.location?.province || '',
      coordinates: user?.location?.coordinates || { lat: null, lng: null }
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    'Electrónicos', 'Muebles', 'Ropa', 'Libros', 'Deportes',
    'Juguetes', 'Hogar', 'Jardín', 'Herramientas', 'Otros'
  ];

  const conditions = ['Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Regular'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
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
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.condition) newErrors.condition = 'La condición es requerida';
    if (!formData.location.city.trim()) newErrors['location.city'] = 'La ciudad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      // Crear producto
      const productResponse = await productService.createProduct(formData);
      const productId = productResponse.data._id;

      // Subir imágenes si existen
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('images', image);
        });

        await productService.uploadImages(productId, imageFormData);
      }

      navigate(`/products/${productId}`, {
        state: { message: 'Producto creado exitosamente' }
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el producto');
      console.error('Error creating product:', err);
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
                helperText={errors.title}
                required
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
                helperText={errors.description}
                placeholder="Describe tu producto, su estado, uso, etc."
                required
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
                    <MenuItem key={category} value={category}>
                      {category}
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
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
                {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="material"
                label="Material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="Ej: Madera, Plástico, Metal..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="dimensions"
                label="Dimensiones"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="Ej: 50x30x20 cm"
              />
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
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="location.city"
                label="Ciudad"
                value={formData.location.city}
                onChange={handleInputChange}
                error={!!errors['location.city']}
                helperText={errors['location.city']}
                required
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

            {/* Imágenes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Imágenes
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
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
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
                
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
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