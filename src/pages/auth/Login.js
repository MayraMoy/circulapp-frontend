// pages/auth/Login.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  EcoOutlined as EcoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo y título */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EcoIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" component="h1" color="primary.main" fontWeight="bold">
            CirculApp
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Conecta con tu comunidad y contribuye a la economía circular
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 2,
                height: 48,
                fontSize: '1.1rem'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{' '}
              <Link 
                component={RouterLink} 
                to="/register" 
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Regístrate aquí
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link 
              href="#" 
              color="primary" 
              variant="body2"
              sx={{ fontWeight: 500 }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>
        </Paper>

        {/* Información adicional */}
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="body2" color="text.secondary">
            CirculApp es una plataforma que conecta a personas que quieren dar una segunda vida 
            a sus objetos con quienes pueden aprovecharlos, promoviendo la economía circular 
            y el cuidado del medio ambiente.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;