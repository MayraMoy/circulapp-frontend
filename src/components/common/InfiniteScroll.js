// components/common/InfiniteScroll.js - Scroll infinito
import React from 'react';
import { Box, CircularProgress, Button } from '@mui/material';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const InfiniteScroll = ({
  children,
  hasMore,
  loading,
  onLoadMore,
  loadingComponent,
  endMessage = 'No hay más elementos',
}) => {
  useInfiniteScroll(onLoadMore, hasMore && !loading);

  return (
    <>
      {children}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          {loadingComponent || <CircularProgress />}
        </Box>
      )}

      {!loading && hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button onClick={onLoadMore} variant="outlined">
            Cargar más
          </Button>
        </Box>
      )}

      {!hasMore && (
        <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>{endMessage}</Box>
      )}
    </>
  );
};

export default InfiniteScroll;
