// components/common/EmptyState.js - Estado vacío
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({ icon: Icon, title, description, action, actionText, onAction }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      {Icon && <Icon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />}

      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}

      {action && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText || 'Comenzar'}
        </Button>
      )}

      {action && !onAction && action}
    </Box>
  );
};

export default EmptyState;
