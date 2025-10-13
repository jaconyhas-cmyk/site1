import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { 
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  People as PeopleIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material';

const FakeStats: React.FC = () => {
  const stats = [
    {
      label: 'From',
      value: '$24.00',
      color: '#4CAF50',
      icon: <MoneyIcon />,
    },
    {
      label: 'Up to',
      value: '$135.00',
      color: '#FF9800',
      icon: <TrendingIcon />,
    },
    {
      label: 'Avg:',
      value: '$42.42',
      color: '#2196F3',
      icon: <MoneyIcon />,
    },
    {
      label: '927+ Happy Customers',
      value: '',
      color: '#4CAF50',
      icon: <PeopleIcon />,
    },
    {
      label: '4.4/5 Rating',
      value: '',
      color: '#FFD700',
      icon: <StarIcon />,
    },
    {
      label: '75 online',
      value: '',
      color: '#FF4444',
      icon: <DotIcon />,
      isOnline: true,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {stats.map((stat, index) => (
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

export default FakeStats;
