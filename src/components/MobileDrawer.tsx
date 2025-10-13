import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  VideoLibrary as VideoLibraryIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth';
import { useSiteConfig } from '../context/SiteConfigContext';
import { ThemeContext } from '../context/ThemeContext';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose, mode, toggleTheme }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { siteName } = useSiteConfig();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('sessionToken');
      window.location.reload();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/', color: '#FF0F50' },
    { text: 'Browse Videos', icon: <VideoLibraryIcon />, path: '/videos', color: '#9900CC' },
    { text: 'Search', icon: <SearchIcon />, path: '/videos', color: '#2196F3' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories', color: '#FF9800' },
  ];

  const userMenuItems = [
    { text: 'Favorites', icon: <FavoriteIcon />, path: '/favorites', color: '#E91E63' },
    { text: 'Watch History', icon: <HistoryIcon />, path: '/history', color: '#607D8B' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', color: '#795548' },
  ];

  const adminMenuItems = isAuthenticated ? [
    { text: 'Admin Panel', icon: <PersonIcon />, path: '/admin', color: '#FF5722' },
  ] : [];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      id="mobile-navigation-menu"
      aria-labelledby="mobile-menu-title"
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: mode === 'dark' ? '#121212' : '#ffffff',
          color: mode === 'dark' ? '#fff' : '#333',
          borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        },
        role: 'navigation',
        'aria-label': 'Main navigation menu',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #FF0F50 0%, #D10D42 100%)',
          color: 'white',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="h6"
            id="mobile-menu-title"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {siteName}
          </Typography>
          <Chip 
            label="18+" 
            size="small"
            sx={{ 
              ml: 1, 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              fontWeight: 'bold',
              height: '20px',
              fontSize: '0.65rem'
            }} 
          />
        </Box>
        
        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                mr: 1,
                fontSize: '0.9rem',
              }}
            >
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {user.name || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Main Navigation */}
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${item.color}15`,
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.color,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, opacity: 0.3 }} />

      {/* User Features */}
      <List sx={{ px: 1, py: 1 }}>
        <ListItem sx={{ px: 2, py: 0.5 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
            }}
          >
            Your Content
          </Typography>
        </ListItem>
        {userMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '12px',
                py: 1,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${item.color}15`,
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.color,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Section */}
      {adminMenuItems.length > 0 && (
        <>
          <Divider sx={{ mx: 2, opacity: 0.3 }} />
          <List sx={{ px: 1, py: 1 }}>
            <ListItem sx={{ px: 2, py: 0.5 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  letterSpacing: '0.5px',
                }}
              >
                Administration
              </Typography>
            </ListItem>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '12px',
                    py: 1,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${item.color}15`,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: item.color,
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* Bottom Actions */}
      <Box sx={{ mt: 'auto', p: 1 }}>
        <Divider sx={{ mx: 1, mb: 1, opacity: 0.3 }} />
        
        {/* Theme Toggle */}
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            borderRadius: '12px',
            py: 1,
            px: 2,
            mb: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 105, 180, 0.15)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: '#FF69B4',
              minWidth: 40,
            }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText
            primary={`${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          />
        </ListItemButton>

        {/* Logout */}
        {isAuthenticated && (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              py: 1,
              px: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 15, 80, 0.15)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FF0F50',
                minWidth: 40,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            />
          </ListItemButton>
        )}
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
