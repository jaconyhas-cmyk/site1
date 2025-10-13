import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { 
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  People as PeopleIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';
import { VideoService } from '../services/VideoService';

interface DynamicStatsProps {
  className?: string;
}

const DynamicStats: React.FC<DynamicStatsProps> = ({ className }) => {
  const [stats, setStats] = useState({
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
    happyCustomers: 927,
    rating: 4.4,
    onlineUsers: 2
  });

  useEffect(() => {
    const loadVideoStats = async () => {
      try {
        const videos = await VideoService.getAllVideos();
        
        if (videos.length > 0) {
          const prices = videos.map(video => video.price).filter(price => price > 0);
          
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            
            setStats(prev => ({
              ...prev,
              minPrice: Math.round(minPrice * 100) / 100,
              maxPrice: Math.round(maxPrice * 100) / 100,
              avgPrice: Math.round(avgPrice * 100) / 100
            }));
          }
        }
      } catch (error) {
        // Fallback para valores padrão se não conseguir carregar vídeos
        setStats(prev => ({
          ...prev,
          minPrice: 24.00,
          maxPrice: 135.00,
          avgPrice: 42.42
        }));
      }
    };

    loadVideoStats();
  }, []);

  // Simular variação de usuários online (2-40)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineUsers: Math.floor(Math.random() * 39) + 2 // 2-40
      }));
    }, 3000); // Atualiza a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      label: 'From',
      value: `$${stats.minPrice.toFixed(2)}`,
      color: '#4CAF50',
      icon: <MoneyIcon />,
    },
    {
      label: 'Up to',
      value: `$${stats.maxPrice.toFixed(2)}`,
      color: '#FF9800',
      icon: <TrendingIcon />,
    },
    {
      label: 'Avg',
      value: `$${stats.avgPrice.toFixed(2)}`,
      color: '#2196F3',
      icon: <MoneyIcon />,
    },
    {
      label: `${stats.happyCustomers}+ Happy Customers`,
      value: '',
      color: '#4CAF50',
      icon: <PeopleIcon />,
    },
    {
      label: `${stats.rating}/5 Rating`,
      value: '',
      color: '#FFD700',
      icon: <StarIcon />,
    },
    {
      label: `${stats.onlineUsers} online`,
      value: '',
      color: '#FF4444',
      icon: <DotIcon />,
      isOnline: true,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }} className={className}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {statsData.map((stat, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              px: 2,
              py: 1,
              borderRadius: '20px',
              backgroundColor: 'background.paper',
              border: `1px solid ${stat.color}20`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 'fit-content',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${stat.color}30`,
              }
            }}
          >
            <Box
              sx={{
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                ...(stat.isOnline && {
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }),
              }}
            >
              {stat.icon}
            </Box>
            
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: 'text.primary',
                whiteSpace: 'nowrap',
              }}
            >
              {stat.label}
              {stat.value && (
                <Typography
                  component="span"
                  sx={{
                    ml: 0.5,
                    color: stat.color,
                    fontWeight: 'bold',
                  }}
                >
                  {stat.value}
                </Typography>
              )}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default DynamicStats;
