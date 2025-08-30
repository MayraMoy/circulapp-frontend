// src/pages/admin/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Inventory as ProductsIcon,
  Report as ReportsIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Category as MaterialsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: DashboardIcon, text: 'Dashboard', path: '/admin' },
    { icon: UsersIcon, text: 'Usuarios', path: '/admin/users' },
    { icon: ProductsIcon, text: 'Productos', path: '/admin/products' },
    { icon: ReportsIcon, text: 'Reportes', path: '/admin/reports' },
    { icon: AnalyticsIcon, text: 'Estadísticas', path: '/admin/analytics' },
    { icon: MaterialsIcon, text: 'Materiales', path: '/admin/materials' },
    { icon: ScheduleIcon, text: 'Horarios', path: '/admin/schedules' },
    { icon: SettingsIcon, text: 'Configuración', path: '/admin/settings' },
  ];

  useEffect(() => {
    if (!hasPermission('admin')) {
      navigate('/dashboard');
      return;
    }
    loadStats();
  }, [hasPermission, navigate]);

  const loadStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('admin')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">No tienes permisos para acceder al panel administrativo</Alert>
      </Container>
    );
  }

  const AdminDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {stats.totalProducts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Productos Publicados
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {stats.totalTransactions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transacciones Completadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {stats.pendingReports}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reportes Pendientes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Utiliza el menú lateral para navegar por las diferentes secciones del panel
                  administrativo.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <React.Fragment key={item.path}>
                    <ListItem
                      button
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Icon color={isActive ? 'inherit' : 'action'} />
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          </Card>
        </Grid>

        {/* Contenido principal */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPlaceholder />} />
                <Route path="products" element={<AdminProductsPlaceholder />} />
                <Route path="reports" element={<AdminReportsPlaceholder />} />
                <Route path="analytics" element={<AdminAnalyticsPlaceholder />} />
                <Route path="materials" element={<AdminMaterialsPlaceholder />} />
                <Route path="schedules" element={<AdminSchedulesPlaceholder />} />
                <Route path="settings" element={<AdminSettingsPlaceholder />} />
              </Routes>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

// Componentes placeholder para las diferentes secciones
const AdminUsersPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Gestión de Usuarios
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminProductsPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Gestión de Productos
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminReportsPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Gestión de Reportes
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminAnalyticsPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Estadísticas y Analytics
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminMaterialsPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Gestión de Materiales
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminSchedulesPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Horarios de Recolección
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

const AdminSettingsPlaceholder = () => (
  <Box>
    <Typography variant="h5" gutterBottom>
      Configuración del Sistema
    </Typography>
    <Alert severity="info">Esta sección está en desarrollo</Alert>
  </Box>
);

export default AdminPanel;
