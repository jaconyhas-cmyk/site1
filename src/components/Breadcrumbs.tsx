import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  VideoLibrary as VideoLibraryIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  active?: boolean;
  chip?: string;
}

interface BreadcrumbsProps {
  mode: 'light' | 'dark';
  customItems?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ mode, customItems }) => {
  const location = useLocation();
  const theme = useTheme();

  const getIconForPath = (path: string): React.ReactNode => {
    if (path === '/') return <HomeIcon sx={{ fontSize: 16 }} />;
    if (path.startsWith('/videos')) return <VideoLibraryIcon sx={{ fontSize: 16 }} />;
    if (path.startsWith('/categories')) return <CategoryIcon sx={{ fontSize: 16 }} />;
    if (path.startsWith('/admin')) return <PersonIcon sx={{ fontSize: 16 }} />;
    if (path.startsWith('/settings')) return <SettingsIcon sx={{ fontSize: 16 }} />;
    if (path.startsWith('/search')) return <SearchIcon sx={{ fontSize: 16 }} />;
    return null;
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const searchParams = new URLSearchParams(location.search);
    
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Home',
        path: '/',
        icon: <HomeIcon sx={{ fontSize: 16 }} />,
      },
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      let icon = getIconForPath(currentPath);
      let chip: string | undefined;

      // Customize labels and add context
      switch (segment) {
        case 'videos':
          label = 'Browse Videos';
          if (searchParams.get('search')) {
            chip = `Search: "${searchParams.get('search')}"`;
          } else if (searchParams.get('category')) {
            chip = `Category: ${searchParams.get('category')}`;
          }
          break;
        case 'categories':
          label = 'Categories';
          break;
        case 'admin':
          label = 'Admin Panel';
          break;
        case 'settings':
          label = 'Settings';
          break;
        case 'profile':
          label = 'My Profile';
          break;
        case 'favorites':
          label = 'Favorites';
          break;
        case 'history':
          label = 'Watch History';
          break;
        default:
          // Try to decode if it's a URL-encoded string
          try {
            label = decodeURIComponent(segment);
            label = label.charAt(0).toUpperCase() + label.slice(1);
          } catch {
            // Keep original if decoding fails
          }
      }

      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath,
        icon,
        active: isLast,
        chip,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page unless there are custom items
  if (location.pathname === '/' && !customItems) {
    return null;
  }

  return (
    <Box
      sx={{
        py: 1.5,
        px: { xs: 2, md: 3 },
        bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'text.secondary' }} />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 1,
          },
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast || !item.path) {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isLast ? 'text.primary' : 'text.secondary',
                    fontWeight: isLast ? 600 : 400,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {item.icon}
                  {item.label}
                </Typography>
                {item.chip && (
                  <Chip
                    label={item.chip}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: '#FF0F50',
                      color: 'white',
                      fontWeight: 500,
                      ml: 0.5,
                    }}
                  />
                )}
              </Box>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.path}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.85rem',
                fontWeight: 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#FF0F50',
                  textDecoration: 'none',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
