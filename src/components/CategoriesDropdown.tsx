import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  NewReleases as NewReleasesIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  trending?: boolean;
  new?: boolean;
}

interface CategoriesDropdownProps {
  mode: 'light' | 'dark';
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ mode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const open = Boolean(anchorEl);

  // Mock categories data
  const categories: Category[] = [
    { id: '1', name: 'Amateur', count: 1250, icon: <StarIcon />, color: '#FF0F50', trending: true },
    { id: '2', name: 'MILF', count: 2100, icon: <FavoriteIcon />, color: '#9900CC', trending: true },
    { id: '3', name: 'Teen', count: 1800, icon: <NewReleasesIcon />, color: '#2196F3', new: true },
    { id: '4', name: 'Blonde', count: 890, icon: <StarIcon />, color: '#FF9800' },
    { id: '5', name: 'Brunette', count: 756, icon: <StarIcon />, color: '#795548' },
    { id: '6', name: 'Latina', count: 650, icon: <FireIcon />, color: '#FF5722', trending: true },
    { id: '7', name: 'Asian', count: 580, icon: <StarIcon />, color: '#607D8B' },
    { id: '8', name: 'Big Tits', count: 1950, icon: <FavoriteIcon />, color: '#E91E63', trending: true },
    { id: '9', name: 'Anal', count: 1200, icon: <StarIcon />, color: '#9C27B0' },
    { id: '10', name: 'Blowjob', count: 1600, icon: <StarIcon />, color: '#3F51B5' },
    { id: '11', name: 'Hardcore', count: 2200, icon: <FireIcon />, color: '#F44336', trending: true },
    { id: '12', name: 'Lesbian', count: 980, icon: <FavoriteIcon />, color: '#E91E63' },
  ];

  const trendingCategories = categories.filter(cat => cat.trending).slice(0, 4);
  const popularCategories = categories.sort((a, b) => b.count - a.count).slice(0, 8);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (categoryName: string) => {
    navigate(`/videos?category=${encodeURIComponent(categoryName.toLowerCase())}`);
    handleClose();
  };

  const handleViewAll = () => {
    navigate('/categories');
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{
          color: mode === 'dark' ? '#fff' : '#333',
          fontWeight: 600,
          px: 2,
          py: 1,
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 15, 80, 0.15)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        Categories
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 500,
            bgcolor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#FF0F50',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CategoryIcon />
            Browse Categories
          </Typography>
        </Box>

        {/* Trending Categories */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 14 }} />
            Trending Now
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {trendingCategories.map((category) => (
              <Chip
                key={category.id}
                label={`${category.name} (${category.count.toLocaleString()})`}
                onClick={() => handleCategorySelect(category.name)}
                sx={{
                  bgcolor: `${category.color}20`,
                  color: category.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  '&:hover': {
                    bgcolor: `${category.color}30`,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Popular Categories Grid */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
              mb: 1,
              display: 'block',
            }}
          >
            Popular Categories
          </Typography>
          
          <Grid container spacing={0}>
            {popularCategories.map((category) => (
              <Grid item xs={6} key={category.id}>
                <MenuItem
                  onClick={() => handleCategorySelect(category.name)}
                  sx={{
                    borderRadius: '8px',
                    mx: 0.5,
                    mb: 0.5,
                    py: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${category.color}15`,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: category.color,
                      minWidth: 32,
                    }}
                  >
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.85rem',
                          }}
                        >
                          {category.name}
                        </Typography>
                        {category.trending && (
                          <Chip
                            label="🔥"
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              bgcolor: 'transparent',
                            }}
                          />
                        )}
                        {category.new && (
                          <Chip
                            label="NEW"
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.5rem',
                              bgcolor: '#4CAF50',
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                        }}
                      >
                        {category.count.toLocaleString()} videos
                      </Typography>
                    }
                  />
                </MenuItem>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* View All Button */}
        <Box sx={{ p: 2, pt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleViewAll}
            sx={{
              borderColor: '#FF0F50',
              color: '#FF0F50',
              fontWeight: 600,
              borderRadius: '8px',
              py: 1,
              '&:hover': {
                borderColor: '#D10D42',
                bgcolor: 'rgba(255, 15, 80, 0.1)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            View All Categories
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CategoriesDropdown;
