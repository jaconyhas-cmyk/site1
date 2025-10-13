import React, { useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/Auth';
import { useTheme } from '@mui/material/styles';

interface UserProfileDropdownProps {
  mode: 'light' | 'dark';
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ mode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('sessionToken');
      window.location.reload();
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const userMenuItems = [
    { text: 'My Profile', icon: <AccountIcon />, path: '/profile', color: '#2196F3' },
    { text: 'Account Settings', icon: <SettingsIcon />, path: '/settings', color: '#607D8B' },
    { text: 'Security', icon: <SecurityIcon />, path: '/security', color: '#FF9800' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', color: '#9C27B0' },
  ];

  const contentMenuItems = [
    { text: 'Favorites', icon: <FavoriteIcon />, path: '/favorites', color: '#E91E63' },
    { text: 'Watch History', icon: <HistoryIcon />, path: '/history', color: '#795548' },
  ];

  const supportMenuItems = [
    { text: 'Help & Support', icon: <HelpIcon />, path: '/help', color: '#4CAF50' },
  ];

  const adminMenuItems = user.role === 'admin' ? [
    { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin', color: '#FF5722' },
  ] : [];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = () => {
    // Simular status online/offline
    return '#4CAF50'; // Verde para online
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0,
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#FF0F50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            border: `2px solid ${getStatusColor()}`,
          }}
        >
          {getUserInitials(user.name || 'User')}
        </Avatar>
        {/* Online Status Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: getStatusColor(),
            border: `2px solid ${mode === 'dark' ? '#0A0A0A' : '#ffffff'}`,
          }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 480,
            bgcolor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#FF0F50',
                color: 'white',
                fontWeight: 'bold',
                mr: 1.5,
              }}
            >
              {getUserInitials(user.name || 'User')}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'text.primary',
                }}
              >
                {user.name || 'User'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.85rem',
                }}
              >
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label="Online"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    bgcolor: `${getStatusColor()}20`,
                    color: getStatusColor(),
                  }}
                />
                {user.role === 'admin' && (
                  <Chip
                    label="Admin"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      bgcolor: 'rgba(255, 87, 34, 0.2)',
                      color: '#FF5722',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Account Section */}
        <Box sx={{ py: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
              px: 2,
              py: 0.5,
              display: 'block',
            }}
          >
            Account
          </Typography>
          {userMenuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 1,
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
                  minWidth: 36,
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
            </MenuItem>
          ))}
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Content Section */}
        <Box sx={{ py: 1 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.5px',
              px: 2,
              py: 0.5,
              display: 'block',
            }}
          >
            Your Content
          </Typography>
          {contentMenuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 1,
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
                  minWidth: 36,
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
            </MenuItem>
          ))}
        </Box>

        {/* Admin Section */}
        {adminMenuItems.length > 0 && (
          <>
            <Divider sx={{ mx: 2 }} />
            <Box sx={{ py: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  letterSpacing: '0.5px',
                  px: 2,
                  py: 0.5,
                  display: 'block',
                }}
              >
                Administration
              </Typography>
              {adminMenuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: '8px',
                    py: 1,
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
                      minWidth: 36,
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
                </MenuItem>
              ))}
            </Box>
          </>
        )}

        {/* Support Section */}
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ py: 1 }}>
          {supportMenuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: '8px',
                py: 1,
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
                  minWidth: 36,
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
            </MenuItem>
          ))}
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Logout */}
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: '8px',
              py: 1.2,
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
                minWidth: 36,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: '#FF0F50',
              }}
            />
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default UserProfileDropdown;
