import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { Chip } from '@mui/material';
import { useAuth } from '../services/Auth';
import VideoCard from '../components/VideoCard';
import { VideoService, Video, SortOption } from '../services/VideoService';
import { useSiteConfig } from '../context/SiteConfigContext';
import DatabaseSetupModal from '../components/DatabaseSetupModal';
import CredentialsStatus from '../components/CredentialsStatus';
import ContactSection from '../components/ContactSection';
import PromoBanner from '../components/PromoBanner';
import DynamicStats from '../components/DynamicStats';
import { SkeletonGrid, InlineLoading } from '../components/LoadingStates';
import { useFeedback, useQuickFeedback } from '../components/FeedbackSystem';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

// Skeleton card component for loading state
const VideoCardSkeleton: FC = () => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      bgcolor: 'background.paper'
    }}>
      <Skeleton 
        variant="rectangular" 
        sx={{ width: '100%', paddingTop: '56.25%' }} 
        animation="wave" 
      />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" sx={{ width: '30%' }} />
          <Skeleton variant="text" sx={{ width: '20%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Loading card component with progress indicator
const VideoCardLoading: FC<{ index: number }> = ({ index }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      bgcolor: 'background.paper',
      position: 'relative'
    }}>
      {/* Thumbnail area with progress indicator */}
      <Box sx={{ 
        width: '100%', 
        paddingTop: '56.25%', 
        position: 'relative',
        bgcolor: 'rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2
        }}>
          <CircularProgress 
            size={40} 
            thickness={4}
            sx={{ 
              color: 'primary.main',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} 
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Loading video {index + 1}...
          </Typography>
        </Box>
      </Box>
      
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" sx={{ width: '30%' }} />
          <Skeleton variant="text" sx={{ width: '20%' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const Home: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [showSetupButton, setShowSetupButton] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [loadedVideos, setLoadedVideos] = useState<Video[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { user } = useAuth();
  const { videoListTitle } = useSiteConfig();
  const navigate = useNavigate();
  const feedback = useQuickFeedback();
  const { isOnline, wasOffline } = useOfflineSupport();
  const videosPerPage = 24; // Aumentar de 12 para 24 vídeos por página


  // Show feedback when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      feedback.success('Connection restored! Content updated.', 'Back Online');
    } else if (!isOnline) {
      feedback.warning('You are offline. Showing cached content.', 'Offline Mode');
    }
  }, [isOnline, wasOffline, feedback]);


  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchVideos = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        setLoadedVideos([]); // Reset loaded videos
        
        // Get video IDs first (ultra-fast operation - no metadata loading)
        const allVideoIds = await VideoService.getVideoIds(SortOption.NEWEST);
        
        if (!isMounted) return;
        
        const totalPages = Math.ceil(allVideoIds.length / videosPerPage);
        setTotalPages(totalPages);
        
        // Get video IDs for current page
        const startIndex = (page - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
        const pageVideoIds = allVideoIds.slice(startIndex, endIndex);
        
        // Set loading to false immediately so skeletons show
        setLoading(false);
        
        // Load videos in parallel batches for better performance
        await loadVideosInBatches(pageVideoIds);
      } catch (err) {
        if (isMounted) {
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
        }
      }
    };
    
    fetchVideos();
    
    // Sempre mostrar o botão de configuração (não dependemos mais do Appwrite)
    setShowSetupButton(false);
    
    return () => {
      isMounted = false; // Cleanup function
    };
  }, [page]);

  // Function to load videos in parallel batches for better performance
  const loadVideosInBatches = async (videoIds: string[]) => {
    setIsLoadingMore(true);
    
    const batchSize = 6; // Load 6 videos at a time
    const batches = [];
    
    // Split video IDs into batches
    for (let i = 0; i < videoIds.length; i += batchSize) {
      batches.push(videoIds.slice(i, i + batchSize));
    }
    
    // Process each batch
    for (const batch of batches) {
      try {
        // Load all videos in the batch in parallel
        const videoPromises = batch.map(videoId => 
          VideoService.getVideo(videoId).catch(error => {
            return null;
          })
        );
        
        const videos = await Promise.all(videoPromises);
        
        // Filter out null results and add to state
        const validVideos = videos.filter(video => video !== null);
        
        if (validVideos.length > 0) {
          setLoadedVideos(prev => {
            // Prevent duplicates by checking if video already exists
            const existingIds = new Set(prev.map(v => v.$id));
            const newVideos = validVideos.filter(video => !existingIds.has(video.$id));
            return [...prev, ...newVideos];
          });
        }
        
        // Small delay between batches to prevent overwhelming the server
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        // Silent error handling
      }
    }
    
    setIsLoadingMore(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll to top with enhanced smooth behavior
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Render skeleton loaders during loading state
  const renderSkeletons = () => {
    // Show skeletons for videos that haven't loaded yet
    const totalExpectedVideos = videosPerPage;
    const loadedCount = loadedVideos.length;
    const skeletonCount = Math.max(0, totalExpectedVideos - loadedCount);
    
    return Array(skeletonCount).fill(0).map((_, index) => (
      <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3} xl={2.4}>
        <VideoCardSkeleton />
      </Grid>
    ));
  };

  // Render loading cards with progress indicators
  const renderLoadingCards = () => {
    // Show loading cards for videos that are currently being loaded
    const totalExpectedVideos = videosPerPage;
    const loadedCount = loadedVideos.length;
    const loadingCount = Math.max(0, totalExpectedVideos - loadedCount);
    
    return Array(loadingCount).fill(0).map((_, index) => (
      <Grid item key={`loading-${index}`} xs={12} sm={6} md={4} lg={3} xl={2.4}>
        <VideoCardLoading index={loadedCount + index} />
      </Grid>
    ));
  };


  const handleQuickSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (quickSearchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(quickSearchQuery.trim())}`);
    }
  };

  const handleQuickSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuickSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
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
      
      {/* Banner promocional */}
      <PromoBanner />
      
      {/* Estatísticas dinâmicas */}
      <DynamicStats />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Status das Credenciais */}
        <CredentialsStatus />
        

        {/* Header Section - Título à esquerda, controles à direita */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'flex-start' },
          mb: 4,
          gap: 2
        }}>
          {/* Título - mantém posição */}
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{
                fontWeight: 700,
                fontFamily: "'Montserrat', sans-serif",
                color: 'text.primary',
                mb: 1
              }}
            >
              {videoListTitle || 'Featured Videos'}
            </Typography>
          </Box>
          
          {/* Controles e informações - lado direito */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: { xs: 'stretch', md: 'flex-end' },
            gap: 2,
            minWidth: { xs: '100%', md: '300px' }
          }}>
            {/* Chips de preços e quantidade */}
            {!loading && loadedVideos.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                flexWrap: 'wrap', 
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'center' 
              }}>
                <Chip 
                  label={`From $${Math.min(...loadedVideos.map(v => v.price)).toFixed(2)}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4CAF50',
                    fontWeight: 600,
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip 
                  label={`Up to $${Math.max(...loadedVideos.map(v => v.price)).toFixed(2)}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    color: '#FF9800',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip 
                  label={`Avg: $${(loadedVideos.reduce((sum, v) => sum + v.price, 0) / loadedVideos.length).toFixed(2)}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: '#2196F3',
                    fontWeight: 600,
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    fontSize: '0.75rem'
                  }}
                />
                
                {/* Loading progress indicator */}
                {isLoadingMore && (
                  <Chip 
                    label={`Loading videos...`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3',
                      fontWeight: 600,
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      fontSize: '0.75rem',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            alignSelf: { xs: 'flex-start', md: 'center' }
          }}>
            {showSetupButton && (
              <Tooltip title="Configurar Armazenamento Wasabi">
                <Button
                  onClick={() => setSetupModalOpen(true)}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ 
                    minWidth: 'auto', 
                    px: 1.5,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}
            
            <Button 
              component={RouterLink}
              to="/videos"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              View All Videos
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setSetupModalOpen(true)}
                startIcon={<SettingsIcon />}
              >
                Configurar Base de Dados
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        <Fade in={true} timeout={500}>
          <Box>
            {loading ? (
              <Grid container spacing={3}>
                {renderSkeletons()}
              </Grid>
            ) : loadedVideos.length === 0 && !isLoadingMore ? (
              <Grow in={true} timeout={1000}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  No videos available at the moment. Please check back later.
                </Alert>
              </Grow>
            ) : (
              <>
                <Grid container spacing={3}>
                  {/* Show loaded videos with smooth animation and better responsive grid */}
                  {loadedVideos.map((video, index) => (
                    <Grow
                      key={`${video.$id}-${index}`}
                      in={true}
                      timeout={200 + (index % 6) * 50} // Staggered animation
                    >
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                        <VideoCard video={video} />
                      </Grid>
                    </Grow>
                  ))}
                  
                  {/* Show loading cards with progress indicators for remaining videos */}
                  {isLoadingMore && renderLoadingCards()}
                </Grid>
                
                {totalPages > 1 && (
                  <Fade in={true} timeout={800}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 5,
                      pt: 3,
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          '& .MuiPaginationItem-root': {
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              bgcolor: 'primary.main',
                              color: 'white'
                            }
                          }
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Container>
      
      <ContactSection />
      
      {/* Modal de setup da base de dados */}
      <DatabaseSetupModal 
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
      />

    </Box>
  );
};

export default Home;
