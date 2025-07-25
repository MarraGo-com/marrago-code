// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/providers/ThemeRegistry.tsx
// This component now reads the theme settings dynamically from our new context.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getThemeOptions } from '@/config/theme';
import { useThemeContext } from '@/contexts/ThemeContext'; // <-- 1. Import our new context hook

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // 2. Get the dynamic theme settings from the context
  const { palette, font } = useThemeContext();
  
  const mode = prefersDarkMode ? 'dark' : 'light';

  // 3. The theme is now recreated whenever the mode, palette, or font changes.
  const theme = React.useMemo(
    () => createTheme(getThemeOptions(mode, palette, font)),
    [mode, palette, font],
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
