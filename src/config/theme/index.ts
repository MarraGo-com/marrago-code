// /src/theme/index.ts
import { PaletteMode } from '@mui/material';
import { colors } from '../site';

// This function returns the theme options for a given mode (light or dark)
export const getThemeOptions = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: colors.primaryColor ||'#004AAD', // Majorelle Blue
          },
          secondary: {
            main: colors.secondaryColor ||'#E07A5F', // Terracotta Orange
          },
          background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#121212',
            secondary: '#6c757d',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#5893d4', // A lighter blue for dark mode contrast
          },
          secondary: {
            main: '#F29479', // A lighter orange for dark mode contrast
          },
          background: {
            default: '#121212',
            paper: '#1c1c1e',
          },
          text: {
            primary: '#e9ecef',
            secondary: '#adb5bd',
          },
        }),
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    }
    // You can define more typography styles here
  },
  // You can define component overrides here
});