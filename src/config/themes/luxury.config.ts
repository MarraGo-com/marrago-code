
import { keywords, luxuryKeywords, sharedKeywords } from '@/config/keywords';
import { SiteConfig } from '../site';

export const luxuryConfig: Partial<SiteConfig> = {
  brandName: "Serene Atlas Escapes",
  siteName: "Serene Atlas Escapes",
  siteDescription: "Curated luxury retreats and bespoke journeys in Morocco's most exclusive destinations.",
   keywords: [...sharedKeywords, ...luxuryKeywords, ...keywords],
  theme: {
    palette: 'luxeNoir',
    font: 'oranienbaum-luxury',
    cardStyle: 'classic', 
  },
    ogImage: {
    src: "/images/og/og-luxury-theme.webp", // Use the luxury image we created
    alt: "Serene Atlas Escapes - Luxury Theme"
  }
};