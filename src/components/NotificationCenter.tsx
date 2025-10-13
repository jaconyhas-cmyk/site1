import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Circle as CircleIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  NewReleases as NewReleasesIcon,
  Favorite as FavoriteIcon,
  VideoLibrary as VideoLibraryIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'new_video' | 'favorite' | 'system';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

interface NotificationCenterProps {
  mode: 'light' | 'dark';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ mode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Video Available',
        message: 'Check out the latest premium content just uploaded!',
        type: 'new_video',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        actionUrl: '/videos/new-video-id',
      },
      {
        id: '2',
        title: 'Special Offer',
        message: 'Limited time: Get 50% off premium membership!',
        type: 'info',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionUrl: '/premium',
      },
      {
        id: '3',
        title: 'Video Added to Favorites',
        message: 'Your favorite video has been saved successfully.',
        type: 'favorite',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
      },
      {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM.',
        type: 'warning',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
      },
      {
        id: '5',
        title: 'Welcome!',
        message: 'Thanks for joining our platform. Explore premium content now!',
        type: 'success',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    handleClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'warning': return <WarningIcon sx={{ color: '#FF9800' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#F44336' }} />;
      case 'new_video': return <VideoLibraryIcon sx={{ color: '#FF0F50' }} />;
      case 'favorite': return <FavoriteIcon sx={{ color: '#E91E63' }} />;
      case 'system': return <PersonIcon sx={{ color: '#607D8B' }} />;
      default: return <InfoIcon sx={{ color: '#2196F3' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'new_video': return '#FF0F50';
      case 'favorite': return '#E91E63';
      case 'system': return '#607D8B';
      default: return '#2196F3';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: mode === 'dark' ? '#fff' : '#333',
          width: 44,
          height: 44,
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'rgba(255, 15, 80, 0.15)',
            transform: 'scale(1.05)',
          },
        }}
        aria-label="notifications"
      >
        <Badge
          badgeContent={unreadCount}
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#FF0F50',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              minWidth: 18,
              height: 18,
            },
          }}
        >
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
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
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <NotificationsIcon />
              Notifications
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: '#FF0F50',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Typography>
          </Box>
          
          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  onClick={handleMarkAllAsRead}
                  sx={{
                    fontSize: '0.7rem',
                    textTransform: 'none',
                    color: '#2196F3',
                    minWidth: 'auto',
                    p: 0.5,
                  }}
                >
                  Mark all read
                </Button>
              )}
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: '#607D8B',
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNoneIcon
              sx={{
                fontSize: 48,
                color: 'text.secondary',
                opacity: 0.5,
                mb: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0, maxHeight: 350, overflow: 'auto' }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderLeft: `3px solid ${notification.read ? 'transparent' : getNotificationColor(notification.type)}`,
                  bgcolor: notification.read ? 'transparent' : `${getNotificationColor(notification.type)}08`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: `${getNotificationColor(notification.type)}15`,
                    transform: 'translateX(2px)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: `${getNotificationColor(notification.type)}20`,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification.read ? 500 : 700,
                          fontSize: '0.85rem',
                          color: 'text.primary',
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <CircleIcon
                          sx={{
                            fontSize: 8,
                            color: getNotificationColor(notification.type),
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                          mb: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.7rem',
                          color: 'text.secondary',
                          opacity: 0.8,
                        }}
                      >
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />

                {!notification.read && (
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      sx={{
                        width: 24,
                        height: 24,
                        color: 'text.secondary',
                        '&:hover': {
                          color: getNotificationColor(notification.type),
                        },
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;
