import type { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { useSiteConfig } from '../context/SiteConfigContext';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const { siteName, telegramUsername } = useSiteConfig();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        bgcolor: theme.palette.mode === 'dark' ? '#0A0A0A' : '#f8f9fa',
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,15,80,0.2)' : 'rgba(255,15,80,0.3)'}`,
        color: theme.palette.mode === 'dark' ? '#fff' : '#333',
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#FF0F50', 
                  fontWeight: 700, 
                  mb: 2,
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                {siteName}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                Premium adult content platform offering exclusive videos for our 18+ community. 
                High-quality content with secure, private viewing experience.
              </Typography>
              
              {/* Contact Links */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {telegramUsername && (
                  <Box
                    component="a"
                    href={`https://t.me/${telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#0088cc',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#006ba3',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <TelegramIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="500">
                      Telegram
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          
          {/* Navigation Links */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FF0F50', 
                fontWeight: 600, 
                mb: 3,
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Link 
                component={RouterLink}
                to="/" 
                underline="none" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#FF0F50',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink}
                to="/videos" 
                underline="none" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#FF0F50',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Browse Videos
              </Link>
              <Link 
                component={RouterLink}
                to="/contact" 
                underline="none" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#FF0F50',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                Contact
              </Link>
            </Box>
          </Grid>
          
          {/* Legal & Security */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FF0F50', 
                fontWeight: 600, 
                mb: 3,
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Legal & Security
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUserIcon sx={{ color: '#4CAF50', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
                  18+ Age Verification Required
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: '#2196F3', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}>
                  Secure Payment Processing
            </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                  mt: 2,
                  fontSize: '0.8rem'
                }}
              >
                All content is intended for adults 18+ only. 
                By accessing this site, you confirm you are of legal age.
            </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        
        {/* Bottom Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            &copy; {currentYear} {siteName}. All rights reserved.
          </Typography>
          
          <Typography 
            variant="body2" 
                sx={{ 
              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
              textAlign: { xs: 'center', md: 'right' },
              fontSize: '0.8rem'
            }}
          >
            Adults Only • Secure & Private
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
