// components/common/Navbar.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  EcoOutlined as EcoIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Datos simulados de notificaciones
  const notifications = [
    { id: 1, message: 'Nueva solicitud para tu producto', time: '5 min' },
    { id: 2, message: 'Mensaje nuevo en el chat', time: '10 min' },
    { id: 3, message: 'Tu transacción fue completada', time: '1 hora' }
  ];

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo y título */}
        <Box 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          <EcoIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h6" component="div" fontWeight="bold">
            CirculApp
          </Typography>
        </Box>

        {/* Navegación central */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            variant={isActive('/dashboard') ? 'outlined' : 'text'}
            sx={{ 
              color: 'white',
              '&.MuiButton-outlined': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/products')}
            variant={isActive('/products') ? 'outlined' : 'text'}
            sx={{ 
              color: 'white',
              '&.MuiButton-outlined': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Explorar
          </Button>

          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-product')}
            variant={isActive('/create-product') ? 'outlined' : 'text'}
            sx={{ 
              color: 'white',
              '&.MuiButton-outlined': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Publicar
          </Button>

          <Button
            color="inherit"
            startIcon={<ChatIcon />}
            onClick={() => navigate('/chat')}
            variant={isActive('/chat') ? 'outlined' : 'text'}
            sx={{ 
              color: 'white',
              '&.MuiButton-outlined': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Mensajes
          </Button>

          {hasPermission('admin') && (
            <Button
              color="inherit"
              startIcon={<AdminIcon />}
              onClick={() => navigate('/admin')}
              variant={isActive('/admin') ? 'outlined' : 'text'}
              sx={{ 
                color: 'white',
                '&.MuiButton-outlined': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Acciones del usuario */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notificaciones */}
          <Tooltip title="Notificaciones">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              sx={{ color: 'white' }}
            >
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Menú de usuario */}
          <Tooltip title="Cuenta">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
              <Avatar 
                src={user?.avatar} 
                alt={user?.name}
                sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Menú de notificaciones */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: { width: 300, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Notificaciones</Typography>
          </Box>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotificationsClose}>
                <Box>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No hay notificaciones nuevas
              </Typography>
            </MenuItem>
          )}
        </Menu>

        {/* Menú de usuario */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1.5, minWidth: 200 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <MenuItem onClick={() => handleNavigation('/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mi Perfil</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleNavigation('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => handleNavigation('/profile?tab=settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Configuración</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar Sesión</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;