// /src/config/theme/index.ts
import { PaletteMode } from '@mui/material';
import { Poppins, Lora } from 'next/font/google';
import { FontChoice } from '@/config/types';

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

// --- REMOVED: PALETTE DEFINITIONS (The 'palettes' object is no longer needed) ---
// interface PaletteConfig {
//   primary: string;
//   secondary: string;
// }
// export const palettes: Record<PaletteName, PaletteConfig> = {
//   coastalBlue: { primary: '#004AAD', secondary: '#E07A5F' },
//   desertSunset: { primary: '#D95D39', secondary: '#4A4E69' },
//   luxeNoir: { primary: '#D4AF37', secondary: '#F8F9FA' },
// };

// UPDATED: getThemeOptions now accepts primary and secondary color hex codes directly
export const getThemeOptions = (
  mode: PaletteMode,
  primaryColor: string, // NEW: Accepts primary color hex code
  secondaryColor: string, // NEW: Accepts secondary color hex code
  fontChoice: FontChoice
) => {
  
  const siteFont = `var(--font-${fontChoice})`;

  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode Palette
            primary: { main: primaryColor }, // UPDATED: Use provided primaryColor
            secondary: { main: secondaryColor }, // UPDATED: Use provided secondaryColor
            background: { default: '#F8F9FA', paper: '#FFFFFF' },
            text: { primary: '#121212', secondary: '#6c757d' },
            footer: { background: '#F8F9FA', text: '#495057' }
          }
        : {
            // Dark Mode Palette
            primary: { main: primaryColor }, // UPDATED: Use provided primaryColor
            secondary: { main: secondaryColor }, // UPDATED: Use provided secondaryColor
            background: { default: '#121212', paper: '#1c1c1e' },
            text: { primary: '#e9ecef', secondary: '#adb5bd' },
            footer: { background: '#1c1c1e', text: '#adb5bd' }
          }),
    },
    typography: {
      fontFamily: siteFont,
      h1: { fontFamily: siteFont },
      h2: { fontFamily: siteFont },
      h3: { fontFamily: siteFont },
      h4: { fontFamily: siteFont },
    },
  };
};