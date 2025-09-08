
import { luxuryKeywords, sharedKeywords } from '@/config/keywords';
import { SiteConfig } from '../site';

export const luxuryConfig: Partial<SiteConfig> = {
  brandName: "Serene Atlas Escapes",
  siteName: "Serene Atlas Escapes",
  siteDescription: "Curated luxury retreats and bespoke journeys in Morocco's most exclusive destinations.",
   keywords: [...sharedKeywords, ...luxuryKeywords],
  theme: {
    palette: 'luxeNoir',
    font: 'oranienbaum-luxury',
    cardStyle: 'classic', 
  },
};