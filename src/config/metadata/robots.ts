import { Robots } from "next/dist/lib/metadata/types/metadata-types";
// --- UPDATED: Import the dynamic siteConfig ---
import { siteConfig } from "../client-data";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const ROBOTS: Robots = {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  export const VERIFICATION= {
      google: 'google', // You should replace 'google' with your actual Google verification code
      yandex: 'yandex', // Replace with your Yandex code
      yahoo: 'yahoo', // Replace with your Yahoo code
      other: {
        // --- UPDATED: Use the dynamic email from siteConfig ---
        me: [siteConfig.contact.email, `${baseUrl}/contact`],
      },
    };

  export const MEDIA =  {'only screen and (max-width: 600px)': `${baseUrl}/mobile`};
  
  export const APP_LINKS = {
        // (Your app link data)
        web: {
          url: baseUrl,
          should_fallback: true,
        },
     };