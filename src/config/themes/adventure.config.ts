; // Or wherever your type is defined
import { adventureKeywords , keywords, sharedKeywords } from '@/config/keywords';
import { SiteConfig } from '../site';

export const adventureConfig: Partial<SiteConfig> = {
  brandName: "Authentic Morocco Adventures",
  siteName: "Authentic Morocco Adventures",
  siteDescription: "Discover authentic, private tours in the High Atlas Mountains, led by expert local Berber guides.",
keywords: [...sharedKeywords, ...adventureKeywords, ...keywords],
  theme: {
    palette: 'desertSunset',
    font: 'lora',
    cardStyle: 'immersive',
  },
  ogImage: {
    src: "/images/og/og-adventure-theme.webp", // Use the adventure image we created
    alt: "Authentic Morocco Adventures - Adventure Theme"
  }
};