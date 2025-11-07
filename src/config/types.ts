// src/config/types.ts (Centralized Type Definitions)

export type Locale = 'en' | 'fr' | 'ar' | 'es'; // Define available locales
export type PaletteName = 'coastalBlue' | 'desertSunset' | 'luxeNoir';
export type ThemeName = 'default' | 'luxury' | 'adventure';
export type FontChoice = 'poppins' | 'lora' | 'cinzel-luxury' | 'pinyon-luxury' | 'oranienbaum-luxury';
export type CardStyle = 'immersive' | 'classic';
export type PaymentMethod = 'bankTransfer' | 'onlinePaymentGateway' | 'cashOnArrival' | 'paypal' | 'creditCard';
export type WebsiteLanguage = 'en' | 'fr' | 'es' | 'ar';

// --- Interfaces for Client Textual Content (Moved from client-text-data.ts) ---

export interface HeroSlide {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string; // Added link for the button
}

export interface HomepageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroCtaButtonText: string;
    featuredExperiencesTitle: string;
    whyChooseUsTitle: string;
    whyChooseUsFeatures: { title: string; description: string; }[];
    blogHighlightsTitle: string;
    blogHighlightsSubtitle: string;
    socialProofTitle: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
}

export interface AboutPageContent {
    title: string;
    subtitle: string;
    paragraph1: string;
    paragraph2: string;
    valuesTitle: string;
    valuesSubtitle: string;
    values: { title: string; description: string; }[]; // No 'icon' field here
    teamTitle: string;
    teamSubtitle: string;
    teamMembers: {image: string; name: string; title: string; bio: string; }[]; // 'title' for role, not 'role'
    ctaTitle: string;
    ctaButtonText: string;
    // No ctaLink or imageAlt in this interface
}

export interface ContactPageContent {
    title: string;
    infoTitle: string;
    infoSubtitle: string;
}

export interface ExperiencesPageContent {
    title: string;
    subtitle: string;
}

export interface BlogPageContent {
    title: string;
    subtitle: string;
}
// AboutUsContent type for metadata in ManualClientData

type AboutUsContent = {
  title: string;
  imageUrl: string;
};
// Define the overall SiteClientTextContent interface
// This interface describes the structure of ALL localized textual content.
export interface SiteClientTextContent {
    en: {
        homepage: HomepageContent; // Now using the dedicated interface
        luxuryHomepageSlides: HeroSlide[];
        aboutPage: AboutPageContent;
        contactPage: ContactPageContent;
        experiencesPage: ExperiencesPageContent;
        blogPage: BlogPageContent;
    };
    fr: {
        homepage: HomepageContent; // Now using the dedicated interface
        luxuryHomepageSlides: HeroSlide[];
        aboutPage: AboutPageContent;
        contactPage: ContactPageContent;
        experiencesPage: ExperiencesPageContent;
        blogPage: BlogPageContent;
    };
    ar: {
        homepage: HomepageContent; // Now using the dedicated interface
        luxuryHomepageSlides: HeroSlide[];
        aboutPage: AboutPageContent;
        contactPage: ContactPageContent;
        experiencesPage: ExperiencesPageContent;
        blogPage: BlogPageContent;
    };
    es: {
        homepage: HomepageContent; // Now using the dedicated interface
        luxuryHomepageSlides: HeroSlide[];
        aboutPage: AboutPageContent;
        contactPage: ContactPageContent;
        experiencesPage: ExperiencesPageContent;
        blogPage: BlogPageContent;
    };
}

export type ManualClientData = {
  // --- Core Business Info ---
  clientId: string;
  officialName: string;
  websiteDisplayName: string;
  ownerName: string;
  slogan: string;
  logoUrl: string;
  businessCategory: string;
  industrySpecifics: string;

  // --- Branding & Theme ---
  primaryColor: string;
  secondaryColor: string;
  templateTheme: string;

  // --- Contact Information ---
  email: string;
  phone: string;
  latitude: number;
  longitude: number;
  address: string;
  whatsappNumber: string;

  // --- Social Media Links ---
  facebook: string;
  instagram: string;
  twitter: string;

  // --- About Us Content (Short version for config) ---
  aboutUsContent: AboutUsContent; // Using our nested type

  // --- Service Description (Short version for config) ---
  serviceDescription: string;

  // --- Tour Locations Served (Key cities) ---
  tourLocationsServed: string;

  // --- Payment & Language Options ---
  paymentMethodsAccepted: PaymentMethod[]; // An array of strings
  websiteLanguageOptions: string[]; // An array of strings

  // --- SEO Keywords & Social Share Image ---
  keywords: string;
  socialShareImageUrl: string;

  // --- Feature Toggles ---
  reviewsSystem: boolean;
  blogSystem: boolean;
  bookingEngine: boolean;
  experiencesSection: boolean;
  faqSection: boolean;

  // --- Legal Content (Placeholders) ---
  privacyPolicyContent: string;
  termsOfUseContent: string;

  // This will pull in the detailed text
  clientTextContent: SiteClientTextContent; // Using our placeholder type
};