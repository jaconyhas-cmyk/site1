import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  LinearProgress, 
  Skeleton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { styled, keyframes } from '@mui/material/system';

// Animações customizadas
const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const StyledLoadingBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, 
    ${theme.palette.background.paper} 0%, 
    ${theme.palette.action.hover} 50%, 
    ${theme.palette.background.paper} 100%)`,
  backgroundSize: '200px 100%',
  animation: `${shimmer} 1.5s ease-in-out infinite`,
}));

// Loading Spinner Customizado
interface CustomLoadingProps {
  size?: number;
  message?: string;
  progress?: number;
  variant?: 'circular' | 'linear' | 'dots';
}

export const CustomLoading: React.FC<CustomLoadingProps> = ({ 
  size = 40, 
  message = 'Loading...', 
  progress,
  variant = 'circular' 
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              variant={progress !== undefined ? 'determinate' : 'indeterminate'}
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 15, 80, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#FF0F50',
                }
              }}
            />
          </Box>
        );
      
      case 'dots':
        return (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#FF0F50',
                  animation: `${pulse} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </Box>
        );
      
      default:
        return (
          <CircularProgress 
            size={size}
            sx={{ 
              color: '#FF0F50',
              mb: 2,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      {renderLoader()}
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          textAlign: 'center',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {message}
        {progress !== undefined && ` (${Math.round(progress)}%)`}
      </Typography>
    </Box>
  );
};

// Skeleton para VideoCard otimizado
export const VideoCardSkeleton: React.FC = () => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail skeleton com shimmer effect */}
      <StyledLoadingBox sx={{ aspectRatio: '16/9', position: 'relative' }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%"
          animation="wave"
          sx={{ position: 'absolute' }}
        />
      </StyledLoadingBox>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Title skeleton */}
        <Skeleton 
          variant="text" 
          width="85%" 
          height={24}
          sx={{ mb: 1 }}
          animation="wave"
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height={24}
          sx={{ mb: 2 }}
          animation="wave"
        />
        
        {/* Stats skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="40%" height={16} animation="wave" />
          <Skeleton variant="text" width="25%" height={16} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

// Grid de skeletons para múltiplos cards
interface SkeletonGridProps {
  count?: number;
  columns?: { xs: number; sm: number; md: number; lg: number; xl: number };
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ 
  count = 8,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }
}) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid 
          item 
          key={index}
          xs={12 / columns.xs}
          sm={12 / columns.sm}
          md={12 / columns.md}
          lg={12 / columns.lg}
          xl={12 / columns.xl}
        >
          <VideoCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

// Loading para página inteira
interface PageLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Loading content...', 
  showProgress = false,
  progress 
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 4,
          minWidth: 300,
          textAlign: 'center',
          boxShadow: 24,
        }}
      >
        <CustomLoading 
          size={60}
          message={message}
          variant={showProgress ? 'linear' : 'circular'}
          progress={progress}
        />
      </Box>
    </Box>
  );
};

// Loading inline para seções
interface InlineLoadingProps {
  height?: number | string;
  message?: string;
  variant?: 'circular' | 'linear' | 'dots';
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  height = 200, 
  message = 'Loading...',
  variant = 'dots'
}) => {
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CustomLoading message={message} variant={variant} />
    </Box>
  );
};

export default {
  CustomLoading,
  VideoCardSkeleton,
  SkeletonGrid,
  PageLoading,
  InlineLoading,
};
