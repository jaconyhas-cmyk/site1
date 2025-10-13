import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'search' | 'category' | 'trending' | 'history';
  count?: number;
  icon?: React.ReactNode;
}

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  isOpen,
  onSelect,
  onClose,
  anchorEl,
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data - em produção, isso viria de uma API
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'amateur', type: 'trending', count: 1250, icon: <TrendingUpIcon /> },
    { id: '2', text: 'blonde', type: 'category', count: 890, icon: <CategoryIcon /> },
    { id: '3', text: 'brunette', type: 'category', count: 756, icon: <CategoryIcon /> },
    { id: '4', text: 'milf', type: 'trending', count: 2100, icon: <TrendingUpIcon /> },
    { id: '5', text: 'teen', type: 'category', count: 1800, icon: <CategoryIcon /> },
    { id: '6', text: 'latina', type: 'category', count: 650, icon: <CategoryIcon /> },
    { id: '7', text: 'asian', type: 'category', count: 580, icon: <CategoryIcon /> },
    { id: '8', text: 'big tits', type: 'trending', count: 1950, icon: <TrendingUpIcon /> },
  ];

  const recentSearches = [
    { id: 'h1', text: 'blonde amateur', type: 'history' as const, icon: <HistoryIcon /> },
    { id: 'h2', text: 'milf brunette', type: 'history' as const, icon: <HistoryIcon /> },
    { id: 'h3', text: 'teen latina', type: 'history' as const, icon: <HistoryIcon /> },
  ];

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    
    // Simular delay de API
    const timer = setTimeout(() => {
      if (query.trim()) {
        // Filtrar sugestões baseadas na query
        const filtered = mockSuggestions.filter(s =>
          s.text.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
      } else {
        // Mostrar buscas recentes e trending quando não há query
        setSuggestions([...recentSearches, ...mockSuggestions.slice(0, 5)]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trending': return '#FF0F50';
      case 'category': return '#9900CC';
      case 'history': return '#607D8B';
      default: return theme.palette.text.secondary;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'trending': return 'Trending';
      case 'category': return 'Category';
      case 'history': return 'Recent';
      default: return '';
    }
  };

  const clearRecentSearches = () => {
    // Em produção, isso limparia o localStorage ou chamaria uma API
    console.log('Clear recent searches');
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1300,
        mt: 0.5,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxHeight: '400px',
          overflow: 'auto',
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} sx={{ color: '#FF0F50' }} />
          </Box>
        ) : (
          <>
            {/* Header */}
            {!query.trim() && suggestions.some(s => s.type === 'history') && (
              <Box sx={{ p: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Recent Searches
                  </Typography>
                  <Chip
                    label="Clear"
                    size="small"
                    onClick={clearRecentSearches}
                    icon={<ClearIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      '&:hover': {
                        bgcolor: 'rgba(255, 15, 80, 0.1)',
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            <List sx={{ py: 0 }}>
              {suggestions.map((suggestion, index) => (
                <React.Fragment key={suggestion.id}>
                  {/* Divider between recent and other suggestions */}
                  {index > 0 && 
                   suggestions[index - 1].type === 'history' && 
                   suggestion.type !== 'history' && (
                    <>
                      <Divider sx={{ mx: 2, my: 1 }} />
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography
                          variant="overline"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'text.secondary',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Suggestions
                        </Typography>
                      </Box>
                    </>
                  )}
                  
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => onSelect(suggestion.text)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: `${getTypeColor(suggestion.type)}15`,
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: getTypeColor(suggestion.type),
                          minWidth: 36,
                        }}
                      >
                        {suggestion.icon || <SearchIcon />}
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.9rem',
                              }}
                            >
                              {suggestion.text}
                            </Typography>
                            
                            {suggestion.count && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                }}
                              >
                                ({suggestion.count.toLocaleString()})
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          suggestion.type !== 'search' && (
                            <Chip
                              label={getTypeLabel(suggestion.type)}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.6rem',
                                bgcolor: `${getTypeColor(suggestion.type)}20`,
                                color: getTypeColor(suggestion.type),
                                mt: 0.5,
                              }}
                            />
                          )
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>

            {suggestions.length === 0 && !loading && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                >
                  No suggestions found
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SearchSuggestions;
