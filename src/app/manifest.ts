// /src/app/manifest.ts
import { siteConfig } from '@/config/client-data';
import { MetadataRoute } from 'next'


export default function manifest(): MetadataRoute.Manifest {
  // Get the primary color from the currently selected theme palette
const primaryColor = siteConfig.colors.primaryColor || '#004AAD'; // Fallback to a default if somehow not set
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.brandName,
    description: siteConfig.siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: primaryColor, // Use the dynamic theme color
    icons: [
      {
        src: '/images/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
