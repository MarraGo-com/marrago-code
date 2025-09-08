// /src/config/fonts.ts
import { Poppins, Lora } from 'next/font/google';
import localFont from 'next/font/local'; // Import the localFont function
// --- FONT DEFINITIONS ---

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '600', '700'],
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '600', '700'],
});

// --- Example of a custom, self-hosted font ---
const cinzelLuxury = localFont({
  src: '../../public/fonts/Cinzel.ttf', // Path to your font file
  display: 'swap',
  variable: '--font-cinzel-luxury',
});
const pinyonLuxury = localFont({
  src: '../../public/fonts/Pinyon.ttf', // Path to your font file
  display: 'swap',
  variable: '--font-pinyon-luxury',
});
const oranienbaumLuxury = localFont({
  src: '../../public/fonts/Oranienbaum.ttf', // Path to your font file
  display: 'swap',
  variable: '--font-oranienbaum-luxury',
});
// --- THE FONT MAP (The Single Source of Truth) --- Oranienbaum
// To add a new font, you just add it here. The RootLayout will handle the rest automatically.
export const fontMap = {
  poppins: poppins,
  lora: lora,
  'cinzel-luxury': cinzelLuxury, // Add your custom font here
  'pinyon-luxury': pinyonLuxury, // Add your custom font here
  'oranienbaum-luxury': oranienbaumLuxury, // Add your custom font here
};

// This generates a string of all font variable names to pass to the layout
export const fontVariables = Object.values(fontMap).map(font => font.variable).join(' ');