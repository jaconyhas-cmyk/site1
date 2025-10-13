import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Fade,
  Box,
  IconButton,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CloudDownload as DownloadIcon,
} from '@mui/icons-material';

// Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotificationOptions {
  id?: string;
  title?: string;
  message: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  progress?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState extends NotificationOptions {
  id: string;
  timestamp: number;
}

interface FeedbackContextType {
  showNotification: (options: NotificationOptions) => string;
  hideNotification: (id: string) => void;
  updateNotification: (id: string, updates: Partial<NotificationOptions>) => void;
  clearAll: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider');
  }
  return context;
};

// Provider do sistema de feedback
export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = useCallback((options: NotificationOptions): string => {
    const id = options.id || `notification-${Date.now()}-${Math.random()}`;
    const notification: NotificationState = {
      ...options,
      id,
      timestamp: Date.now(),
      duration: options.duration ?? (options.type === 'error' ? 6000 : 4000),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-hide se não for persistente
    if (!options.persistent && options.type !== 'loading') {
      setTimeout(() => {
        hideNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<NotificationOptions>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <SuccessIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      case 'loading': return <DownloadIcon />;
      default: return <InfoIcon />;
    }
  };

  const getSeverity = (type: NotificationType) => {
    if (type === 'loading') return 'info';
    return type;
  };

  return (
    <FeedbackContext.Provider value={{ 
      showNotification, 
      hideNotification, 
      updateNotification, 
      clearAll 
    }}>
      {children}
      
      {/* Renderizar notificações */}
      <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 10000, maxWidth: 400 }}>
        {notifications.map((notification, index) => (
          <Slide
            key={notification.id}
            direction="left"
            in={true}
            timeout={300}
            style={{ 
              transformOrigin: 'right center',
              marginBottom: 8,
            }}
          >
            <Alert
              severity={getSeverity(notification.type)}
              icon={getIcon(notification.type)}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {notification.action && (
                    <Typography
                      variant="button"
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.75rem',
                        '&:hover': { opacity: 0.8 }
                      }}
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Typography>
                  )}
                  {!notification.persistent && (
                    <IconButton
                      size="small"
                      onClick={() => hideNotification(notification.id)}
                      sx={{ color: 'inherit' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              sx={{
                minWidth: 300,
                boxShadow: 3,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              {notification.title && (
                <AlertTitle sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {notification.title}
                </AlertTitle>
              )}
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {notification.message}
              </Typography>
              
              {/* Progress bar para loading */}
              {notification.type === 'loading' && notification.progress !== undefined && (
                <LinearProgress
                  variant="determinate"
                  value={notification.progress}
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 2,
                  }}
                />
              )}
            </Alert>
          </Slide>
        ))}
      </Box>
    </FeedbackContext.Provider>
  );
};

// Hook para operações comuns
export const useQuickFeedback = () => {
  const { showNotification } = useFeedback();

  return {
    success: (message: string, title?: string) => 
      showNotification({ type: 'success', message, title }),
    
    error: (message: string, title?: string) => 
      showNotification({ type: 'error', message, title, duration: 6000 }),
    
    warning: (message: string, title?: string) => 
      showNotification({ type: 'warning', message, title }),
    
    info: (message: string, title?: string) => 
      showNotification({ type: 'info', message, title }),
    
    loading: (message: string, title?: string) => 
      showNotification({ type: 'loading', message, title, persistent: true }),
  };
};

// Componente para feedback de operações
interface OperationFeedbackProps {
  isLoading: boolean;
  error?: string | null;
  success?: string | null;
  loadingMessage?: string;
  children?: React.ReactNode;
}

export const OperationFeedback: React.FC<OperationFeedbackProps> = ({
  isLoading,
  error,
  success,
  loadingMessage = 'Processing...',
  children,
}) => {
  const { showNotification } = useFeedback();

  React.useEffect(() => {
    if (error) {
      showNotification({
        type: 'error',
        message: error,
        title: 'Operation Failed',
      });
    }
  }, [error, showNotification]);

  React.useEffect(() => {
    if (success) {
      showNotification({
        type: 'success',
        message: success,
        title: 'Success!',
      });
    }
  }, [success, showNotification]);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {loadingMessage}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default FeedbackProvider;
