import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface AgeVerificationModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ 
  open, 
  onAccept, 
  onDecline 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing without choice
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          border: '2px solid #FF0F50',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pb: 2,
        borderBottom: '1px solid rgba(255, 15, 80, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <WarningIcon sx={{ 
            fontSize: 48, 
            color: '#FF0F50', 
            mr: 1,
            animation: 'pulse 2s infinite'
          }} />
        </Box>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#FF0F50',
            textAlign: 'center',
          }}
        >
          Age Verification Required
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          ⚠️ Adult Content Warning ⚠️
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
          }}
        >
          This website contains adult content intended for individuals 
          <strong style={{ color: '#FF0F50' }}> 18 years of age or older</strong>.
        </Typography>

        <Box sx={{ 
          p: 2, 
          mb: 3,
          backgroundColor: 'rgba(255, 15, 80, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(255, 15, 80, 0.2)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            By clicking "I am 18 or older", you confirm that:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2, textAlign: 'left' }}>
            <Typography component="li" variant="body2">
              You are at least 18 years old
            </Typography>
            <Typography component="li" variant="body2">
              You agree to view adult content
            </Typography>
            <Typography component="li" variant="body2">
              You understand the nature of this content
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: theme.palette.text.disabled,
            fontStyle: 'italic',
          }}
        >
          If you are under 18, please leave this website immediately.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 0,
        gap: 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <Button
          onClick={onDecline}
          variant="outlined"
          color="error"
          size="large"
          startIcon={<CancelIcon />}
          fullWidth={isMobile}
          sx={{
            py: 1.5,
            px: 3,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            }
          }}
        >
          I am under 18
        </Button>
        
        <Button
          onClick={onAccept}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CheckIcon />}
          fullWidth={isMobile}
          sx={{
            py: 1.5,
            px: 3,
            fontWeight: 600,
            backgroundColor: '#FF0F50',
            '&:hover': {
              backgroundColor: '#D10D42',
            }
          }}
        >
          I am 18 or older
        </Button>
      </DialogActions>

      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Dialog>
  );
};

export default AgeVerificationModal;
