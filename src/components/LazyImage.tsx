import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  borderRadius?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sx?: any;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  aspectRatio = '16/9',
  borderRadius = 0,
  objectFit = 'cover',
  placeholder,
  onLoad,
  onError,
  sx = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Começar a carregar 50px antes de aparecer
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  const getPlaceholderSrc = () => {
    if (placeholder) return placeholder;
    
    // Gerar placeholder SVG baseado nas dimensões
    const svgWidth = typeof width === 'number' ? width : 300;
    const svgHeight = typeof height === 'number' ? height : 180;
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999999" text-anchor="middle" dy=".3em">
          ${alt || 'Loading...'}
        </text>
      </svg>
    `)}`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width,
        height,
        aspectRatio,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        ...sx,
      }}
    >
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius,
          }}
        />
      )}

      {/* Imagem real */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? getPlaceholderSrc() : src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          loading="lazy" // Lazy loading nativo do browser
          decoding="async" // Decodificação assíncrona
        />
      )}

      {/* Indicador de erro */}
      {hasError && isLoaded && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '0.8rem',
            textAlign: 'center',
            px: 1,
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
};

export default LazyImage;
