// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/theme/index.ts
// This file now contains our library of pre-defined color palettes.
// -------------------------------------------------------------------------
import { PaletteMode } from '@mui/material';
import { Poppins, Lora } from 'next/font/google'; // Import Google Fonts

// Define the structure for a single color palette
// --- FONT DEFINITIONS ---
export const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins', // CSS variable name
});

export const lora = Lora({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora', // CSS variable name
});
interface PaletteConfig {
  primary: string;
  secondary: string;
}

// --- PALETTE DEFINITIONS ---
// --- PALETTE & THEME LOGIC ---
export type PaletteName = 'coastalBlue' | 'desertSunset' | 'luxeNoir';
export type FontChoice = 'poppins' | 'lora';
export type CardStyle = 'immersive' | 'classic';

interface PaletteConfig { primary: string; secondary: string; }

const palettes: Record<PaletteName, PaletteConfig> = {
  coastalBlue: { primary: '#004AAD', secondary: '#E07A5F' },
  desertSunset: { primary: '#D95D39', secondary: '#4A4E69' },
  luxeNoir: { primary: '#D4AF37', secondary: '#F8F9FA' },
};

// The function now looks up the correct colors from our palette library
export const getThemeOptions = (mode: PaletteMode, paletteName: PaletteName, fontChoice: FontChoice) => {
  const selectedPalette = palettes[paletteName] || palettes.coastalBlue;
 // const selectedFont = fontChoice === 'lora' ? lora.style.fontFamily : poppins.style.fontFamily;
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
          }
        : {
            // Dark Mode Palette
            // We can define lighter shades for dark mode, or use the same ones.
            // For now, we will use slightly lighter versions for better contrast.
            primary: { main: selectedPalette.primary }, // You can adjust this, e.g., lighten(selectedPalette.primary, 0.2)
            secondary: { main: selectedPalette.secondary },
            background: { default: '#121212', paper: '#1c1c1e' },
            text: { primary: '#e9ecef', secondary: '#adb5bd' },
          }),
    },
     // --- 2. THIS IS THE KEY TYPOGRAPHY FIX ---
    typography: {
      fontFamily: bodyFont, // Default body font is Poppins
      h1: { fontFamily: headingFont, fontWeight: 700 },
      h2: { fontFamily: headingFont, fontWeight: 700 },
      h3: { fontFamily: headingFont, fontWeight: 600 },
      h4: { fontFamily: headingFont, fontWeight: 600 },
      // All other text (body1, body2, etc.) will inherit the default Poppins
    },
  };
};
