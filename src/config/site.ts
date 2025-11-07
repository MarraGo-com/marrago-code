// src/config/site.ts (Core Configuration Logic)

// Import types from the new types file
import type { 
  PaletteName, ThemeName, FontChoice, CardStyle, PaymentMethod, WebsiteLanguage, SiteClientTextContent // NEW: Also import SiteClientTextContent
} from './types'; 

// Re-export types so other modules can import them from '@/config/site'
export type { PaletteName, ThemeName, FontChoice, CardStyle, PaymentMethod, WebsiteLanguage, SiteClientTextContent } from './types';

// Import theme configurations
import { adventureConfig } from "./themes/adventure.config";
import { defaultConfig } from "./themes/default.config";
import { luxuryConfig } from "./themes/luxury.config";


// --- SiteConfig INTERFACE ---
// This interface defines the structure of the final merged configuration.
export interface SiteConfig {
  clientId: string; // The unique identifier for the client (e.g., "client-omar")
  templateTheme: 'default' | 'adventure' | 'luxury' ; // The base theme the client uses
  brandName: string;
  siteName: string;
  ownerName: string;
  slogan: string;
  businessType: 'TravelAgency' | 'TourOperator' | 'TransportService' | 'Other';
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  logo: string;
  siteDescription: string;
  keywords: string[];

  contact: {
    email: string;
    phone: string;
    whatsappNumber: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  social: {
    twitter: string;
    instagram: string;
    facebook: string;
  };

  colors: {
    primaryColor: string;
    secondaryColor: string;
  };
  theme: {
    palette: PaletteName;
    font: FontChoice;
    cardStyle: CardStyle;
  };
  ogImage?: {
    src: string;
    alt: string;
  };

  aboutUsContent: {
    title: string;
    imageUrl: string;
  };
  serviceDescription: string;
  tourLocationsServed: string[];
  paymentMethodsAccepted: PaymentMethod[];
  websiteLanguageOptions: WebsiteLanguage[];

  hasReviewsSystem: boolean;
  hasBlogSystem: boolean;
  hasBookingEngine: boolean;
  hasExperiencesSection: boolean;
  hasFaqSection: boolean;

  privacyPolicyContent: string;
  termsOfUseContent: string;

  templateThemeName: ThemeName;

  // THIS IS THE NEW PROPERTY YOU RIGHTLY POINTED OUT!
  textContent: SiteClientTextContent; 
}

// --- Theme Configuration Objects ---
const themeConfigs: Record<ThemeName, Partial<SiteConfig>> = {
  default: defaultConfig,
  luxury: luxuryConfig,
  adventure: adventureConfig,
};

/**
 * Merges raw client data (from questionnaire or manual source) with the chosen theme's configuration.
 * @param rawClientData The data directly from the client's questionnaire.
 * @returns The final, merged SiteConfig object.
 */
export function mergeClientDataWithTheme(rawClientData: unknown): SiteConfig {
  const r = rawClientData as Record<string, any>;
  const processedConfig: Partial<SiteConfig> = {
    brandName: r.officialName,
    siteName: r.websiteDisplayName,
    clientId: r.clientId,
    slogan: r.slogan,
    businessType: r.businessCategory || 'Other',
    addressLocality: r.address?.split(',')[0]?.trim() || '',
    addressRegion: r.address?.split(',')[2]?.trim() || '',
    addressCountry: r.address?.split(',').pop()?.trim() || 'MA',
    logo: r.logoUrl,
    siteDescription: r.industrySpecifics || "A leading provider of custom travel experiences.",
    keywords: r.keywords ? (r.keywords as string).split(',').map((k: string) => k.trim()) : [],

    contact: {
      email: r.email,
      phone: r.phone,
      whatsappNumber: r.whatsappNumber,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
    },
    social: {
      twitter: r.twitter,
      instagram: r.instagram,
      facebook: r.facebook,
    },

    colors: {
      primaryColor: r.primaryColor,
      secondaryColor: r.secondaryColor,
    },
    theme: {
      palette: r.palette || 'desertSunset',
      font: r.font || 'lora',
      cardStyle: r.cardStyle || 'immersive',
    },
    ogImage: r.socialShareImageUrl
      ? {
          src: r.socialShareImageUrl,
          alt: `${r.websiteDisplayName} social share image`,
        }
      : undefined,

    aboutUsContent: r.aboutUsContent,
    serviceDescription: r.serviceDescription,
    tourLocationsServed: r.tourLocationsServed ? (r.tourLocationsServed as string).split(',').map((l: string) => l.trim()) : [],
    paymentMethodsAccepted: r.paymentMethodsAccepted || [],
    websiteLanguageOptions: r.websiteLanguageOptions || [],

    hasReviewsSystem: r.reviewsSystem,
    hasBlogSystem: r.blogSystem,
    hasBookingEngine: r.bookingEngine,
    hasExperiencesSection: r.experiencesSection,
    hasFaqSection: r.faqSection,

    privacyPolicyContent: r.privacyPolicyContent || 'Default privacy policy text...',
    termsOfUseContent: r.termsOfUseContent || 'Default terms of use text...',

    templateTheme: r.templateTheme as ThemeName,
    textContent: r.clientTextContent, // Ensure rawClientData has this property
  };

  const selectedThemeConfig = themeConfigs[processedConfig.templateThemeName || 'default'];
  
  const finalConfig: SiteConfig = {
      ...selectedThemeConfig,
      ...processedConfig,
      
      colors: {
          ...(selectedThemeConfig.colors || {}),
          ...(processedConfig.colors || {}),
      },
      theme: {
          ...(selectedThemeConfig.theme || {}),
          ...(processedConfig.theme || {}),
      },
      keywords: Array.from(new Set([
          ...(selectedThemeConfig.keywords || []),
          ...(processedConfig.keywords || []),
      ])),
      tourLocationsServed: Array.from(new Set([
          ...(selectedThemeConfig.tourLocationsServed || []),
          ...(processedConfig.tourLocationsServed || []),
      ])),
      textContent: processedConfig.textContent as SiteClientTextContent, 
  } as SiteConfig;

  return finalConfig;
}