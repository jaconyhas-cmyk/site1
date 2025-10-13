import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { designTokens } from '../theme/tokens';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Start with light theme as default
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) {
      setMode(savedTheme);
    } else {
      // Set light theme as default
      localStorage.setItem('theme', 'light');
    }
  }, []);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', mode);
    
    // Apply theme class to body
    document.body.className = mode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  // Create MUI theme based on mode using design tokens
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: designTokens.colors.primary.main,
        light: designTokens.colors.primary.light,
        dark: designTokens.colors.primary.dark,
        contrastText: designTokens.colors.primary.contrastText,
      },
      secondary: {
        main: designTokens.colors.secondary.main,
        light: designTokens.colors.secondary.light,
        dark: designTokens.colors.secondary.dark,
        contrastText: designTokens.colors.secondary.contrastText,
      },
      background: {
        default: mode === 'dark' ? designTokens.colors.dark.background : designTokens.colors.light.background,
        paper: mode === 'dark' ? designTokens.colors.dark.paper : designTokens.colors.light.paper,
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : designTokens.colors.neutral[900],
        secondary: mode === 'dark' ? designTokens.colors.secondary.main : designTokens.colors.neutral[600],
      },
      error: {
        main: designTokens.colors.semantic.error,
      },
      success: {
        main: designTokens.colors.semantic.success,
      },
      warning: {
        main: designTokens.colors.semantic.warning,
      },
      info: {
        main: designTokens.colors.semantic.info,
      },
    },
    typography: {
      fontFamily: designTokens.typography.fontFamily.primary,
      h1: {
        fontWeight: designTokens.typography.fontWeight.extrabold,
        fontSize: designTokens.typography.fontSize['5xl'],
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h2: {
        fontWeight: designTokens.typography.fontWeight.bold,
        fontSize: designTokens.typography.fontSize['4xl'],
        lineHeight: designTokens.typography.lineHeight.tight,
      },
      h3: {
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontSize: designTokens.typography.fontSize['3xl'],
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h4: {
        fontWeight: designTokens.typography.fontWeight.semibold,
        fontSize: designTokens.typography.fontSize['2xl'],
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      h5: {
        fontWeight: designTokens.typography.fontWeight.medium,
        fontSize: designTokens.typography.fontSize.xl,
      },
      h6: {
        fontWeight: designTokens.typography.fontWeight.medium,
        fontSize: designTokens.typography.fontSize.lg,
      },
      body1: {
        fontSize: designTokens.typography.fontSize.base,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      body2: {
        fontSize: designTokens.typography.fontSize.sm,
        lineHeight: designTokens.typography.lineHeight.normal,
      },
      button: {
        fontWeight: designTokens.typography.fontWeight.semibold,
        textTransform: 'none',
        fontSize: designTokens.typography.fontSize.sm,
      },
    },
    spacing: 8, // 8px base unit
    breakpoints: {
      values: {
        xs: parseInt(designTokens.breakpoints.xs),
        sm: parseInt(designTokens.breakpoints.sm),
        md: parseInt(designTokens.breakpoints.md),
        lg: parseInt(designTokens.breakpoints.lg),
        xl: parseInt(designTokens.breakpoints.xl),
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.md,
            padding: '10px 20px',
            transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.easing.spring}`,
            fontWeight: designTokens.typography.fontWeight.semibold,
            textTransform: 'none',
          },
          containedPrimary: {
            backgroundColor: designTokens.colors.primary.main,
            boxShadow: designTokens.shadows.md,
            '&:hover': {
              backgroundColor: designTokens.colors.primary.dark,
              transform: 'translateY(-1px)',
              boxShadow: designTokens.shadows.lg,
            },
          },
          sizeSmall: {
            height: '36px',
            padding: '0 12px',
            fontSize: designTokens.typography.fontSize.sm,
          },
          sizeMedium: {
            height: '44px',
            padding: '0 16px',
            fontSize: designTokens.typography.fontSize.base,
          },
          sizeLarge: {
            height: '52px',
            padding: '0 24px',
            fontSize: designTokens.typography.fontSize.lg,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.lg,
            transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.easing.spring}`,
            boxShadow: mode === 'dark' ? designTokens.shadows.md : designTokens.shadows.base,
            border: `1px solid ${mode === 'dark' ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? designTokens.colors.dark.surface : designTokens.colors.light.paper,
            boxShadow: designTokens.shadows.lg,
            borderBottom: `1px solid ${mode === 'dark' ? designTokens.colors.dark.border : designTokens.colors.light.border}`,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.md,
            transition: `all ${designTokens.transitions.duration.fast} ${designTokens.transitions.easing.spring}`,
            '&:hover': {
              backgroundColor: `rgba(${mode === 'dark' ? '255, 15, 80' : '0, 0, 0'}, 0.1)`,
              transform: 'scale(1.05)',
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: designTokens.borderRadius.md,
              transition: `all ${designTokens.transitions.duration.normal} ${designTokens.transitions.easing.spring}`,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: designTokens.colors.primary.light,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: designTokens.colors.primary.main,
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: designTokens.borderRadius.xl,
            boxShadow: designTokens.shadows['2xl'],
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 