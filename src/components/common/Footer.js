// components/common/Footer.js
import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { 
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

// Componente para el icono emoji
const EcoIcon = ({ sx, fontSize }) => (
  <span style={{ 
    fontSize: fontSize === 32 ? '32px' : '24px', 
    lineHeight: 1,
    ...sx 
  }}>
    🌱
  </span>
);

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

export default Footer;