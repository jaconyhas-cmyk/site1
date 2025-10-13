import { FC, useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Chip, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import Skeleton from '@mui/material/Skeleton';
import { VideoService } from '../services/VideoService';

interface VideoCardProps {
  video: {
    $id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string;
    isPurchased?: boolean;
    duration?: string | number;
    views?: number;
    createdAt?: string;
    created_at?: string;
  };
}

const VideoCard: FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);
  
  const handleCardClick = async () => {
    try {
      // Increment view count
      await VideoService.incrementViews(video.$id);
      
      // Navigate to video page
      navigate(`/video/${video.$id}`);
    } catch (error) {
      console.error('Error handling video card click:', error);
      // Navigate anyway even if incrementing views fails
      navigate(`/video/${video.$id}`);
    }
  };

  // Format the duration nicely
  const formatDuration = (duration?: string | number) => {
    if (duration === undefined || duration === null) return '00:00';
    
    // If duration is a number (seconds), convert to string format
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}min ${seconds}s`;
    }
    
    // If duration is already a string, check format
    if (typeof duration === 'string') {
      try {
        // Check if duration is in format MM:SS or HH:MM:SS
        const parts = duration.split(':');
        if (parts.length === 2) {
          return `${parts[0]}min ${parts[1]}s`;
        } else if (parts.length === 3) {
          return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
        }
      } catch (error) {
        console.error('Error formatting duration:', error);
        // Return the original string if split fails
        return duration;
      }
    }
    
    // Return as is if we can't parse it
    return String(duration);
  };

  // Format view count with K, M, etc.
  const formatViews = (views?: number) => {
    if (views === undefined) return '0 views';
    if (views < 1000) return `${views} views`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
  };

  // Format date to relative time
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Ajuste para lidar com formato created_at ou createdAt
  const createdAtField = video.createdAt || video.created_at;

  // Handle thumbnail loading states
  useEffect(() => {
    if (video.thumbnailUrl) {
      setIsThumbnailLoading(true);
      setThumbnailError(false);
    } else {
      setIsThumbnailLoading(false);
    }
  }, [video.thumbnailUrl]);

  const handleThumbnailLoad = () => {
    setIsThumbnailLoading(false);
  };

  const handleThumbnailError = () => {
    setIsThumbnailLoading(false);
    setThumbnailError(true);
  };

  return (
    <>
      {/* Add CSS animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme => theme.palette.mode === 'dark' 
            ? '0 4px 12px rgba(0,0,0,0.3)' 
            : '0 2px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme => theme.palette.mode === 'dark'
              ? '0 12px 24px rgba(0,0,0,0.4)'
              : '0 8px 16px rgba(0,0,0,0.15)',
            borderColor: '#FF0F50',
          }
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <Box sx={{ position: 'relative' }}>
        {/* Optimized thumbnail with lazy loading */}
        <LazyImage
          src={video.thumbnailUrl || ''}
          alt={video.title}
          aspectRatio="16/9"
          borderRadius="0"
          onLoad={handleThumbnailLoad}
          onError={handleThumbnailError}
          sx={{
            filter: 'brightness(0.9)',
            backgroundColor: '#0A0A0A',
          }}
        />

        {/* Loading indicator overlay */}
        {isThumbnailLoading && video.thumbnailUrl && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            <CircularProgress 
              size={40} 
              thickness={4}
              sx={{ 
                color: '#FF0F50',
                mb: 1,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}

        {/* Error state overlay */}
        {thumbnailError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#0A0A0A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}
            >
              Video Thumbnail
            </Typography>
          </Box>
        )}
        
        {/* Adult content indicator - simplified */}
        <Box
          sx={{ 
            position: 'absolute', 
            top: 12, 
            left: 12, 
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            px: 1,
            py: 0.5,
            borderRadius: '6px',
            zIndex: 2,
            backdropFilter: 'blur(4px)',
          }}
        >
          18+
        </Box>
        
        {/* Simplified hover overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Box
            sx={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,15,80,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s ease',
              backdropFilter: 'blur(4px)',
            }}
          >
            {video.isPurchased ? (
              <PlayArrowIcon sx={{ fontSize: 32, color: 'white' }} />
            ) : (
              <LockIcon sx={{ fontSize: 24, color: 'white' }} />
            )}
          </Box>
        </Box>
        
        {/* Duration badge - simplified */}
        {video.duration && (
          <Box
            sx={{ 
              position: 'absolute', 
              bottom: 12, 
              left: 12, 
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              px: 1,
              py: 0.5,
              borderRadius: '6px',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: '12px' }} />
            {formatDuration(video.duration)}
          </Box>
        )}
        
        {/* Price badge - simplified */}
        <Box
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            backgroundColor: '#FF0F50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(255, 15, 80, 0.3)',
            zIndex: 2,
          }}
        >
          ${video.price.toFixed(2)}
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{
          fontWeight: 600,
          fontSize: '1rem',
          lineHeight: 1.3,
          mb: 1.5,
          height: '2.6rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          color: theme => theme.palette.mode === 'dark' ? 'white' : 'text.primary',
        }}>
          {video.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon sx={{ 
              fontSize: 14, 
              color: theme => theme.palette.mode === 'dark' ? '#FF69B4' : 'text.secondary' 
            }} />
            <Typography variant="caption" sx={{ 
              color: theme => theme.palette.mode === 'dark' ? '#FF69B4' : 'text.secondary',
              fontSize: '0.75rem'
            }}>
              {formatViews(video.views)}
            </Typography>
          </Box>
          
          {createdAtField && (
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem'
            }}>
              {formatDate(createdAtField)}
            </Typography>
          )}
        </Box>
      </CardContent>
      </Card>
    </>
  );
};

export default memo(VideoCard); 