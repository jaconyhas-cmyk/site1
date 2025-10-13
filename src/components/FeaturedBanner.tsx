import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { VideoService, Video } from '../services/VideoService';
import { Chip } from '@mui/material';

interface FeaturedBannerProps {
  onError?: (error: string) => void;
}

const FeaturedBanner = ({ onError }: FeaturedBannerProps) => {
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(3); // 3 seconds

  // Function to calculate time until next change based on global timestamp
  const calculateTimeUntilNext = () => {
    const now = Date.now();
    const intervalMs = 3 * 1000; // 3 seconds in milliseconds
    const timeSinceLastChange = now % intervalMs;
    const timeUntilNextChange = intervalMs - timeSinceLastChange;
    return Math.ceil(timeUntilNextChange / 1000); // Convert to seconds
  };

  // Function to get a deterministic video based on current time interval
  const getVideoForCurrentInterval = (videos: Video[]) => {
    if (videos.length === 0) return null;
    
    const now = Date.now();
    const intervalMs = 3 * 1000; // 3 seconds
    const currentInterval = Math.floor(now / intervalMs);
    
    // Use the interval number as seed for deterministic selection
    const videoIndex = currentInterval % videos.length;
    return videos[videoIndex];
  };

  // Function to fetch a video for current time interval
  const fetchVideoForCurrentInterval = async (isTransition = false) => {
    try {
      if (isTransition) {
        setIsTransitioning(true);
      } else {
        setLoading(true);
      }
      
      // If we don't have videos yet, fetch them
      if (allVideos.length === 0) {
        const videos = await VideoService.getAllVideos();
        setAllVideos(videos);
        
        if (videos.length > 0) {
          // Select video based on current time interval
          const selectedVideo = getVideoForCurrentInterval(videos);
          if (selectedVideo) {
            setFeaturedVideo(selectedVideo);
          }
        }
      } else {
        // Use existing videos to select based on current interval
        const selectedVideo = getVideoForCurrentInterval(allVideos);
        if (selectedVideo) {
          setFeaturedVideo(selectedVideo);
        }
      }
    } catch (error) {
      console.error('Error fetching featured video:', error);
      if (onError) {
        onError('Failed to load featured content');
      }
    } finally {
      setLoading(false);
      if (isTransition) {
        // Add a small delay for smooth transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }
    }
  };

  useEffect(() => {
    // Initial load
    fetchVideoForCurrentInterval();
    
    // Set initial countdown
    setTimeUntilNext(calculateTimeUntilNext());
  }, []);

  // Set up interval to change video every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (allVideos.length > 0) {
        fetchVideoForCurrentInterval(true); // Pass true to indicate this is a transition
        setTimeUntilNext(calculateTimeUntilNext()); // Reset countdown based on global time
      }
    }, 3 * 1000); // 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [allVideos.length]);

  // Countdown timer that syncs with global time
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilNext());
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  if (loading || !featuredVideo) {
    return null; // Or a skeleton loader
  }

  // Extract only what we need from the description (first 150 characters)
  const truncatedDescription = featuredVideo.description.length > 150 
    ? `${featuredVideo.description.substring(0, 150)}...` 
    : featuredVideo.description;

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', sm: '70vh', md: '75vh', lg: '80vh' },
        width: '100%',
        overflow: 'hidden',
        mb: { xs: 2, md: 4 },
        opacity: isTransitioning ? 0.7 : 1,
        transition: 'opacity 0.5s ease-in-out',
        borderRadius: { xs: 0, sm: '16px' },
      }}
    >
      {/* Age verification banner */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <WarningIcon sx={{ color: '#FF0F50' }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          18+ ADULT CONTENT • By continuing, you confirm you are at least 18 years old
        </Typography>
      </Box>

      {/* Auto-change indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'rgba(255, 15, 80, 0.9)',
          color: 'white',
          padding: '8px 12px',
          zIndex: 3,
          borderRadius: '0 0 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isTransitioning ? '#FFD700' : '#00FF00',
            animation: isTransitioning ? 'pulse 1s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.5 },
              '100%': { opacity: 1 },
            },
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
          {isTransitioning ? 'CHANGING...' : `NEXT IN ${timeUntilNext}s`}
        </Typography>
      </Box>

      {/* Background image (thumbnail) with gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${featuredVideo.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.85)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,15,80,0.15) 0%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }
        }}
      />

      {/* Banner content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          width: '100%',
          padding: { xs: '0 5%', md: '0 10%' },
          zIndex: 2,
        }}
      >
        <Chip 
          label="FEATURED EXCLUSIVE" 
          color="primary"
          sx={{ 
            mb: 2, 
            fontWeight: 'bold', 
            backgroundColor: '#FF0F50',
            '& .MuiChip-label': { px: 1, py: 0.5 }
          }} 
        />

        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: { 
              xs: '1.75rem', 
              sm: '2.5rem', 
              md: '3.5rem', 
              lg: '4rem' 
            },
            lineHeight: { xs: 1.2, md: 1.1 },
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            mb: { xs: 1.5, md: 2 },
          }}
        >
          {featuredVideo.title}
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'white', 
            maxWidth: { xs: '100%', md: '60%', lg: '50%' },
            mb: { xs: 2, md: 3 },
            textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
            lineHeight: { xs: 1.4, md: 1.5 },
            display: { xs: '-webkit-box', md: 'block' },
            WebkitLineClamp: { xs: 3, md: 'none' },
            WebkitBoxOrient: { xs: 'vertical', md: 'unset' },
            overflow: { xs: 'hidden', md: 'visible' },
          }}
        >
          {truncatedDescription}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1.5, md: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          maxWidth: { xs: '100%', sm: 'auto' }
        }}>
          <Button
            component={Link}
            to={`/video/${featuredVideo.$id}`}
            variant="contained"
            size={window.innerWidth < 600 ? "medium" : "large"}
            startIcon={<PlayArrowIcon />}
            sx={{
              bgcolor: '#FF0F50',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#D10D42',
                transform: 'scale(1.03)',
              },
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.2 },
              borderRadius: '8px',
              fontSize: { xs: '0.9rem', md: '1rem' },
              minWidth: { xs: 'auto', sm: '140px' },
            }}
          >
            Watch Now
          </Button>
          
          <Button
            component={Link}
            to={`/video/${featuredVideo.$id}`}
            variant="contained"
            size={window.innerWidth < 600 ? "medium" : "large"}
            startIcon={<InfoIcon />}
            sx={{
              bgcolor: 'rgba(25, 25, 25, 0.8)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(25, 25, 25, 0.95)',
                transform: 'scale(1.03)',
              },
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.2 },
              borderRadius: '8px',
              fontSize: { xs: '0.9rem', md: '1rem' },
              minWidth: { xs: 'auto', sm: '140px' },
            }}
          >
            More Info
          </Button>
        </Box>

        <Box sx={{ 
          mt: { xs: 2, md: 3 }, 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 2 }, 
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              display: 'inline-block',
              border: '1px solid #FF0F50',
              bgcolor: 'rgba(255, 15, 80, 0.2)',
              px: { xs: 1, md: 1.5 },
              py: 0.5,
              borderRadius: '4px',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            18+ ADULTS ONLY
          </Typography>
          
          {/* Enhanced price display */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, md: 1 },
            backgroundColor: 'rgba(255, 15, 80, 0.9)',
            px: { xs: 1.5, md: 2 },
            py: { xs: 0.8, md: 1 },
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1rem', md: '1.2rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              ${featuredVideo.price.toFixed(2)}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', md: '0.8rem' }
              }}
            >
              ONE-TIME
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(25, 25, 25, 0.7)',
              px: { xs: 0.8, md: 1 },
              py: 0.5,
              borderRadius: '4px',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            {featuredVideo.duration}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedBanner; 