// components/common/LazyImage.js - Carga lazy de imágenes
import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

const LazyImage = ({ src, alt, width, height, placeholder, className, style, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        width: width || '100%',
        height: height || 'auto',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {loading && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height || 200}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {inView && (
        <img
          src={error ? placeholder || '/placeholder-image.jpg' : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
          {...props}
        />
      )}

      {error && !placeholder && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
            color: 'text.secondary',
          }}
        >
          No disponible
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;
