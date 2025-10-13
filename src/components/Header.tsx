import React, { useContext, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../services/Auth';
import { useSiteConfig } from '../context/SiteConfigContext';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header: FC = () => {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();
  const { siteName } = useSiteConfig();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear session if logout fails
      localStorage.removeItem('sessionToken');
      window.location.reload();
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSearchSuggestionsOpen(true);
  };

  const handleSearchFocus = () => {
    setSearchSuggestionsOpen(true);
  };

  const handleSearchSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchSuggestionsOpen(false);
    navigate(`/videos?search=${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSuggestionsClose = () => {
    setSearchSuggestionsOpen(false);
  };

  // Only show admin/logout if authenticated
  const showAdminControls = isAuthenticated && user;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: mode === 'dark' ? '#0A0A0A' : '#ffffff',
      color: mode === 'dark' ? '#fff' : '#333',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      minHeight: isMobile ? '64px' : '72px',
      padding: isMobile ? '8px 16px' : '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '16px'
    }}>
      {isMobile && (
        <button
          onClick={() => setMobileDrawerOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'dark' ? '#fff' : '#333',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            marginRight: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <MenuIcon style={{ fontSize: '24px' }} />
        </button>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <h1
          onClick={() => navigate('/')}
          style={{
            fontWeight: '900',
                letterSpacing: '0.5px',
                fontFamily: "'Montserrat', sans-serif",
            fontSize: isMobile ? '1.2rem' : '1.6rem',
            color: mode === 'dark' ? '#FF0F50' : '#D10D42',
            textShadow: mode === 'dark' ? '0 2px 4px rgba(255, 15, 80, 0.3)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: isMobile ? '12px 16px' : '16px 22px',
            borderRadius: '8px',
            margin: 0,
            minHeight: isMobile ? '44px' : '48px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = mode === 'dark' ? '#FF4081' : '#FF0F50';
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = mode === 'dark' ? '#FF0F50' : '#D10D42';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {siteName}
        </h1>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? '8px' : '16px'
      }}>
        {!isMobile && (
          <form onSubmit={handleSearch} style={{ 
              display: 'flex', 
              alignItems: 'center',
            minWidth: '250px',
            maxWidth: '350px',
            position: 'relative',
          }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearchChange}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '8px 12px 8px 40px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  color: mode === 'dark' ? '#fff' : '#333',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF0F50';
                  e.target.style.borderWidth = '2px';
                  e.target.style.backgroundColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderWidth = '1px';
                  e.target.style.backgroundColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                }}
              />
              <SearchIcon style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '18px',
                pointerEvents: 'none'
              }} />
            </div>
          </form>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: mode === 'dark' ? '#fff' : '#333',
              fontWeight: 600,
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Home
            </button>
            
            <button
              onClick={() => navigate('/videos')}
              style={{
                background: 'none',
                border: 'none',
                color: mode === 'dark' ? '#fff' : '#333',
                fontWeight: 600,
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Browse
            </button>
          </div>
        )}
        
        {isMobile && (
          <button
            onClick={() => navigate('/videos')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'dark' ? '#fff' : '#333',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.15)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <SearchIcon style={{ fontSize: '22px' }} />
          </button>
        )}
        
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: '#FF69B4',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 105, 180, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {mode === 'dark' ? 
            <Brightness7Icon style={{ fontSize: '22px' }} /> : 
            <Brightness4Icon style={{ fontSize: '22px' }} />
          }
        </button>
      </div>

      {mobileDrawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1001
        }} onClick={() => setMobileDrawerOpen(false)}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '280px',
            height: '100%',
            backgroundColor: mode === 'dark' ? '#0A0A0A' : '#ffffff',
            color: mode === 'dark' ? '#fff' : '#333',
            padding: '16px',
            boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontWeight: 'bold',
              color: mode === 'dark' ? '#FF0F50' : '#D10D42',
              marginBottom: '16px',
              textAlign: 'center',
              margin: '0 0 16px 0',
              fontSize: '1.2rem'
            }}>
              {siteName}
            </h2>
            <hr style={{ 
              border: 'none', 
              borderTop: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`, 
              margin: '0 0 16px 0' 
            }} />
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => {
                  navigate('/');
                  setMobileDrawerOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mode === 'dark' ? '#fff' : '#333',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <HomeIcon style={{ fontSize: '20px' }} />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/videos');
                  setMobileDrawerOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mode === 'dark' ? '#fff' : '#333',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <VideoLibraryIcon style={{ fontSize: '20px' }} />
                <span>Browse Videos</span>
              </button>
              
              {showAdminControls && (
                <>
                  <hr style={{ 
                    border: 'none', 
                    borderTop: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`, 
                    margin: '8px 0' 
                  }} />
                  <button
                    onClick={() => {
                      navigate('/admin');
                      setMobileDrawerOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: mode === 'dark' ? '#fff' : '#333',
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <AdminPanelSettingsIcon style={{ fontSize: '20px' }} />
                    <span>Admin Panel</span>
                  </button>
            </>
          )}
          
              <hr style={{ 
                border: 'none', 
                borderTop: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`, 
                margin: '8px 0' 
              }} />
              
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileDrawerOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mode === 'dark' ? '#fff' : '#333',
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {mode === 'dark' ? <Brightness7Icon style={{ fontSize: '20px' }} /> : <Brightness4Icon style={{ fontSize: '20px' }} />}
                <span>Switch to {mode === 'dark' ? 'Light' : 'Dark'} Theme</span>
              </button>
              
              {showAdminControls && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileDrawerOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: mode === 'dark' ? '#fff' : '#333',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 15, 80, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogoutIcon style={{ fontSize: '20px' }} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
