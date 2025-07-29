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

const palettes: Record<PaletteName, PaletteConfig> = {
  coastalBlue: { primary: '#004AAD', secondary: '#E07A5F' },
  desertSunset: { primary: '#D95D39', secondary: '#4A4E69' },
  luxeNoir: { primary: '#D4AF37', secondary: '#F8F9FA' },
};

// The function now includes a dedicated 'footer' color scheme
export const getThemeOptions = (mode: PaletteMode, paletteName: PaletteName, fontChoice: FontChoice) => {
  const selectedPalette = palettes[paletteName] || palettes.coastalBlue;
  const headingFont = fontChoice === 'lora' ? lora.style.fontFamily : poppins.style.fontFamily;
  const bodyFont = poppins.style.fontFamily;

  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light Mode Palette
            primary: { main: selectedPalette.primary },
            secondary: { main: selectedPalette.secondary },
            background: { default: '#F8F9FA', paper: '#FFFFFF' },
            text: { primary: '#121212', secondary: '#6c757d' },
            // --- THIS IS THE KEY FIX ---
            // We add a dedicated color set for the footer in light mode.
            footer: {
              background: '#F8F9FA', // A slightly off-white background
              text: '#495057' // A darker, more accessible grey for the text
            }
          }
        : {
            // Dark Mode Palette
            primary: { main: selectedPalette.primary },
            secondary: { main: selectedPalette.secondary },
            background: { default: '#121212', paper: '#1c1c1e' },
            text: { primary: '#e9ecef', secondary: '#adb5bd' },
            // We do the same for dark mode to keep it consistent.
            footer: {
              background: '#1c1c1e', // The dark paper color
              text: '#adb5bd' // The standard secondary text color
            }
          }),
    },
    typography: {
      fontFamily: bodyFont,
      h1: { fontFamily: headingFont, fontWeight: 700 },
      h2: { fontFamily: headingFont, fontWeight: 700 },
      h3: { fontFamily: headingFont, fontWeight: 600 },
      h4: { fontFamily: headingFont, fontWeight: 600 },
    },
  };
};
