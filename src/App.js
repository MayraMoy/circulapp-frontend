// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componentes de páginas
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AdminPanel from './pages/admin/AdminPanel';

// Componentes comunes
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Tema personalizado de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde principal
      light: '#60AD5E',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6F00', // Naranja secundario
      light: '#FF8F00',
      dark: '#E65100',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: '0.9rem',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Componente para rutas públicas (solo para no autenticados)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout principal de la aplicación
const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Navbar />}
      <Box component="main" sx={{ flex: 1, paddingTop: isAuthenticated ? '64px' : 0 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

// Componente principal con todas las rutas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/products/:id" 
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/create-product" 
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } 
      />

      {/* Rutas administrativas */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredPermission="admin">
            <AdminPanel />
          </ProtectedRoute>
        } 
      />

      {/* Ruta 404 */}
      <Route 
        path="*" 
        element={
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <h1>404 - Página no encontrada</h1>
            <p>La página que buscas no existe.</p>
          </Box>
        } 
      />
    </Routes>
  );
};

// Componente principal
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
