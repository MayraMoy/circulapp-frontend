// pages/auth/Register.js
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
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Visibility,
  VisibilityOff,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Componente para el icono emoji
const EcoIcon = () => (
  <span
    style={{
      fontSize: '24px',
      lineHeight: 1,
    }}
  >
    🌱
  </span>
);

const steps = ['Información Personal', 'Ubicación', 'Confirmación'];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'individual',
    location: {
      address: '',
      city: '',
      province: '',
      coordinates: { lat: null, lng: null },
    },
  });

  const [formErrors, setFormErrors] = useState({});

  // ✅ Validaciones básicas
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /\S+@\S+\.\S+/.test(value) ? '' : 'Correo inválido';
      case 'password':
        return value.length < 6 ? 'Mínimo 6 caracteres' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Las contraseñas no coinciden' : '';
      case 'phone':
        return /^\d{8,15}$/.test(value) ? '' : 'Teléfono inválido';
      case 'name':
        return value.trim() === '' ? 'El nombre es requerido' : '';
      default:
        return '';
    }
  };

  const handleChange = e => {
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

    // Validación en tiempo real
    setFormErrors(prev => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword, phone } = formData;

    // Validación final antes de enviar
    const errors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
      phone: validateField('phone', phone),
    };

    setFormErrors(errors);

    if (Object.values(errors).some(err => err)) return;

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Renderizado de pasos
  const renderStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirmar contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Ciudad"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Provincia"
                name="location.province"
                value={formData.location.province}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmar datos
            </Typography>
            <Typography>Nombre: {formData.name}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Teléfono: {formData.phone}</Typography>
            <Typography>
              Ubicación: {formData.location.city}, {formData.location.province}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro <EcoIcon />
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{renderStepContent(activeStep)}</Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          {activeStep > 0 && (
            <Button startIcon={<ArrowBack />} variant="outlined" onClick={handleBack}>
              Atrás
            </Button>
          )}

          <Button
            variant="contained"
            endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Confirmar'
            ) : (
              'Siguiente'
            )}
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login">
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
