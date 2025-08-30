// pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';
import {
  ArrowForward
} from '@mui/icons-material';

// Componentes para iconos emoji - Simple y sin problemas
const EcoIcon = ({ fontSize }) => (
  <span style={{ 
    fontSize: fontSize === 32 ? '32px' : fontSize === 80 ? '80px' : '24px',
    lineHeight: 1,
    marginRight: fontSize === 32 ? '8px' : '0'
  }}>
    🌱
  </span>
);

const RecycleIcon = () => <span style={{ fontSize: '40px' }}>♻️</span>;
const PeopleIcon = () => <span style={{ fontSize: '40px' }}>👥</span>;
const LocationIcon = () => <span style={{ fontSize: '40px' }}>📍</span>;
const SecurityIcon = () => <span style={{ fontSize: '40px' }}>🔒</span>;
const StarIcon = () => <span style={{ fontSize: '24px' }}>⭐</span>;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RecycleIcon />,
      title: 'Economía Circular',
      description: 'Da una segunda vida a tus objetos y encuentra lo que necesitas de manera sostenible.'
    },
    {
      icon: <PeopleIcon />,
      title: 'Comunidad Local',
      description: 'Conecta con personas de tu zona y fortalece los lazos comunitarios.'
    },
    {
      icon: <LocationIcon />,
      title: 'Cerca de Ti',
      description: 'Encuentra productos y servicios en tu área local para reducir la huella de carbono.'
    },
    {
      icon: <SecurityIcon />,
      title: 'Seguro y Confiable',
      description: 'Sistema de reputación y verificación para transacciones seguras.'
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Productos Donados', icon: <RecycleIcon /> },
    { number: '1,200+', label: 'Usuarios Activos', icon: <PeopleIcon /> },
    { number: '850kg', label: 'CO₂ Ahorrado', icon: <EcoIcon /> },
    { number: '98%', label: 'Satisfacción', icon: <StarIcon /> }
  ];

  const testimonials = [
    {
      name: 'María González',
      location: 'Córdoba Capital',
      avatar: 'MG',
      text: 'CirculApp me ayudó a encontrar muebles perfectos para mi nuevo hogar. ¡Es increíble lo que la gente dona!'
    },
    {
      name: 'Juan Pérez',
      location: 'Villa Carlos Paz',
      avatar: 'JP',
      text: 'Logré darle nueva vida a electrodomésticos que ya no usaba. La plataforma es muy fácil de usar.'
    },
    {
      name: 'Ana Rodríguez',
      location: 'Río Cuarto',
      avatar: 'AR',
      text: 'Como productora, CirculApp me permite conectar con personas que valoran la sostenibilidad.'
    }
  ];

  return (
    <Box>
      {/* Header/Navigation */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'primary.main' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EcoIcon fontSize={32} />
            <Typography variant="h6" component="div" fontWeight="bold">
              CirculApp
            </Typography>
          </Box>
          <Box sx={{ gap: 2, display: 'flex' }}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Conecta, Comparte, 
                <span style={{ color: '#81C784' }}> Cuida</span>
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                La plataforma que une a tu comunidad para crear un futuro más sostenible 
                a través del intercambio responsable
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5
                  }}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                >
                  Comenzar Ahora
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { 
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    px: 4,
                    py: 1.5
                  }}
                  onClick={() => navigate('/login')}
                >
                  Explorar
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                {/* Iconos flotantes simulando la app */}
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    position: 'relative'
                  }}
                >
                  <EcoIcon fontSize={80} />
                  
                  {/* Iconos orbitando */}
                  <Box sx={{ position: 'absolute', top: -20, right: -20 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <RecycleIcon />
                    </Avatar>
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: -20, left: -20 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <PeopleIcon />
                    </Avatar>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 50, left: -30 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <LocationIcon />
                    </Avatar>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Impacto Real
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Números que reflejan nuestro compromiso con la sostenibilidad
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                <CardContent>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 60, 
                      height: 60, 
                      mx: 'auto', 
                      mb: 2 
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
            ¿Cómo Funciona?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Simple, seguro y efectivo
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'primary.main',
                      width: 80, 
                      height: 80, 
                      mr: 3 
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Lo Que Dicen Nuestros Usuarios
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Historias reales de impacto positivo
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ p: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Chip 
                        label={testimonial.location} 
                        size="small" 
                        variant="outlined"
                        icon={<LocationIcon />}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    "{testimonial.text}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            ¿Listo Para Hacer la Diferencia?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            Únete a nuestra comunidad y comienza a contribuir a un futuro más sostenible hoy mismo
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5
              }}
              endIcon={<ArrowForward />}
              onClick={() => navigate('/register')}
            >
              Crear Cuenta Gratis
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { 
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                },
                px: 4,
                py: 1.5
              }}
              onClick={() => navigate('/login')}
            >
              Ya Tengo Cuenta
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
            Gratis para siempre • Sin comisiones • 100% seguro
          </Typography>
        </Container>
      </Box>

      {/* Footer integrado */}
      <Box
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EcoIcon fontSize={32} />
                <Typography variant="h6" fontWeight="bold">
                  CirculApp
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                La plataforma que conecta comunidades para crear un futuro más sostenible 
                a través de la economía circular.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Enlaces Útiles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  ¿Cómo funciona?
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Preguntas Frecuentes
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Centro de Ayuda
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Contacto
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Términos de Uso
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Política de Privacidad
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start' }}>
                  Cookies
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              mt: 4,
              pt: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 CirculApp. Todos los derechos reservados. Hecho con 💚 para un mundo mejor.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;