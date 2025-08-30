// components/common/ErrorRetry.js - Componente de error con reintentar
import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, Error as ErrorIcon } from '@mui/icons-material';

const ErrorRetry = ({
  error,
  onRetry,
  title = 'Algo salió mal',
  showDetails = process.env.NODE_ENV === 'development',
}) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        {error?.message || 'Ha ocurrido un error inesperado'}
      </Typography>

      {onRetry && (
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry} sx={{ mb: 2 }}>
          Intentar de nuevo
        </Button>
      )}

      {showDetails && error?.stack && (
        <Alert severity="error" sx={{ textAlign: 'left', mt: 2 }}>
          <Typography variant="caption" component="pre">
            {error.stack}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ErrorRetry;
