// components/common/Footer.js - Footer mejorado
import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  FavoriteRounded as HeartIcon,
} from '@mui/icons-material';

const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  color: 'white',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(2),
  marginTop: 'auto',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: '#16A085',
  fontSize: '1.1rem',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#bdc3c7',
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#16A085',
    transform: 'translateX(4px)',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#34495e',
  color: 'white',
  width: 45,
  height: 45,
  marginRight: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: '#16A085',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 4px 12px rgba(22, 160, 133, 0.3)',
  },
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sección de marca */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#16A085',
                    '&::before': { content: '"🌱"', mr: 1, fontSize: '1.8rem' },
                  }}
                >
                  CirculApp
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ 
                  mb: 3, 
                  opacity: 0.8, 
                  lineHeight: 1.6,
                  color: '#bdc3c7',
                }}
              >
                Conectando comunidades para crear un futuro más sostenible a través de la economía
                circular.
              </Typography>
              <Box>
                <SocialButton aria-label="Facebook">
                  <Facebook />
                </SocialButton>
                <SocialButton aria-label="Twitter">
                  <Twitter />
                </SocialButton>
                <SocialButton aria-label="Instagram">
                  <Instagram />
                </SocialButton>
                <SocialButton aria-label="LinkedIn">
                  <LinkedIn />
                </SocialButton>
              </Box>
            </FooterSection>
          </Grid>

          {/* Navegación */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle>Navegación</FooterTitle>
              <Box>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/products">Explorar Productos</FooterLink>
                <FooterLink href="/create-product">Publicar Producto</FooterLink>
                <FooterLink href="/chat">Mensajes</FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          {/* Soporte */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle>Soporte</FooterTitle>
              <Box>
                <FooterLink href="/help">Centro de Ayuda</FooterLink>
                <FooterLink href="/contact">Contacto</FooterLink>
                <FooterLink href="/faq">Preguntas Frecuentes</FooterLink>
                <FooterLink href="/report">Reportar Problema</FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <FooterTitle>Legal</FooterTitle>
              <Box>
                <FooterLink href="/terms">Términos de Uso</FooterLink>
                <FooterLink href="/privacy">Política de Privacidad</FooterLink>
                <FooterLink href="/cookies">Política de Cookies</FooterLink>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        {/* Línea divisoria */}
        <Divider 
          sx={{ 
            my: 4, 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }} 
        />

        {/* Footer bottom */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.7,
              color: '#95a5a6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            © 2024 CirculApp. Todos los derechos reservados. Hecho con{' '}
            <HeartIcon sx={{ fontSize: 16, color: '#e74c3c', mx: 0.5 }} />
            para un mundo mejor.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
