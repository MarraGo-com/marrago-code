// /src/config/theme/index.ts
import { PaletteMode } from '@mui/material';
import { Poppins, Lora } from 'next/font/google';
import { PaletteName, FontChoice } from '@/config/site';

// --- FONT DEFINITIONS ---
export const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const lora = Lora({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

// --- PALETTE DEFINITIONS ---
interface PaletteConfig {
  primary: string;
  secondary: string;
}

export const palettes: Record<PaletteName, PaletteConfig> = {
  coastalBlue: { primary: '#004AAD', secondary: '#E07A5F' },
  desertSunset: { primary: '#D95D39', secondary: '#4A4E69' },
  luxeNoir: { primary: '#D4AF37', secondary: '#F8F9FA' },
};

export const getThemeOptions = (
  mode: PaletteMode, 
  paletteName: PaletteName, 
  fontChoice: FontChoice
) => {
  
  // --- THIS IS THE KEY CHANGE ---
  // The entire site's font is now determined by one variable
  const siteFont = `var(--font-${fontChoice})`;

  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode Palette
            primary: { main: palettes[paletteName].primary },
            secondary: { main: palettes[paletteName].secondary },
            background: { default: '#F8F9FA', paper: '#FFFFFF' },
            text: { primary: '#121212', secondary: '#6c757d' },
            footer: { background: '#F8F9FA', text: '#495057' }
          }
        : {
            // Dark Mode Palette
            primary: { main: palettes[paletteName].primary },
            secondary: { main: palettes[paletteName].secondary },
            background: { default: '#121212', paper: '#1c1c1e' },
            text: { primary: '#e9ecef', secondary: '#adb5bd' },
            footer: { background: '#1c1c1e', text: '#adb5bd' }
          }),
    },
    typography: {
      // The entire typography system now uses the single dynamic font
      fontFamily: siteFont,
      h1: { fontFamily: siteFont },
      h2: { fontFamily: siteFont },
      h3: { fontFamily: siteFont },
      h4: { fontFamily: siteFont },
    },
  };
};

