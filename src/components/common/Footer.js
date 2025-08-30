// components/common/Footer.js
import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { 
  EcoOutlined as EcoIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EcoIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                CirculApp
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Conectando comunidades para crear un futuro más sostenible 
              a través de la economía circular.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Navegación
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/dashboard" color="inherit" underline="hover">
                Dashboard
              </Link>
              <Link href="/products" color="inherit" underline="hover">
                Explorar Productos
              </Link>
              <Link href="/create-product" color="inherit" underline="hover">
                Publicar Producto
              </Link>
              <Link href="/chat" color="inherit" underline="hover">
                Mensajes
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Soporte
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/help" color="inherit" underline="hover">
                Centro de Ayuda
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contacto
              </Link>
              <Link href="/faq" color="inherit" underline="hover">
                Preguntas Frecuentes
              </Link>
              <Link href="/report" color="inherit" underline="hover">
                Reportar Problema
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/terms" color="inherit" underline="hover">
                Términos de Uso
              </Link>
              <Link href="/privacy" color="inherit" underline="hover">
                Política de Privacidad
              </Link>
              <Link href="/cookies" color="inherit" underline="hover">
                Política de Cookies
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            mt: 4,
            pt: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 CirculApp. Todos los derechos reservados. 
            Contribuyendo a un mundo más sostenible.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// components/common/LoadingSpinner.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Cargando...', 
  fullScreen = false 
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3
      }}
    >
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

// components/common/ErrorBoundary.js
import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <ErrorIcon 
              sx={{ 
                fontSize: 80, 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            
            <Typography variant="h4" gutterBottom color="error">
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              Ha ocurrido un error inesperado. Por favor, recarga la página 
              o contacta con soporte si el problema persiste.
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
              >
                Recargar Página
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
              >
                Volver Atrás
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Detalles del Error (Solo en Desarrollo):
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    overflow: 'auto',
                    fontSize: '0.75rem',
                    border: 1,
                    borderColor: 'error.main'
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export { Footer, LoadingSpinner, ErrorBoundary };