; // Or wherever your type is defined
import { defaultKeywords , sharedKeywords } from '@/config/keywords';
import { SiteConfig } from '../site';

export const defaultConfig: Partial<SiteConfig> = {
  brandName: "Authentic Morocco Adventures",
  siteName: "Authentic Morocco Adventures",
  siteDescription: "Discover authentic, private tours in the High Atlas Mountains, led by expert local Berber guides.",
   keywords: [...sharedKeywords, ...defaultKeywords],
  theme: {
    palette: 'desertSunset',
    font: 'lora',
    cardStyle: 'immersive',
  },
};