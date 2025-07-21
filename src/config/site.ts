// /src/config/site.ts

// This is the new, single source of truth for all client-specific data.
// When you get a new client, you will duplicate the template and edit only this file.
export const LOCATIONS = [
  { id: 'agadir', name: 'Agadir' },
  { id: 'essaouira', name: 'Essaouira' },
  { id: 'imlil', name: 'Imlil, Atlas Mountains' },
  { id: 'legzira', name: 'Legzira Beach' },
  { id: 'marrakech', name: 'Marrakech' },
  { id: 'tafraout', name: 'Tafraout' },
  { id: 'taroudant', name: 'Taroudant' }
];

   // Theme & Visuals
 export const colors = {
    primaryColor: "#004AAD", // Majorelle Blue
    secondaryColor: "#E07A5F", // Terracotta Orange
  };

export type SiteConfig = {
  // Brand & SEO
  brandName: string;
  siteName: string;
  siteDescription: string;
  keywords: string[];
  
  // Contact & Social
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    twitter: string;
    instagram: string;
    facebook: string;
  };

  // Theme & Visuals
  colors: {
    primaryColor: string;
    secondaryColor: string;
  };

  // Content Specific
  locations: { id: string; name: string; }[];
};

// --- CONFIGURATION FOR YOUR FIRST CLIENT (YOUR BROTHER) ---
// We will fill this out using the new questionnaire.

export const siteConfig: SiteConfig = {
  // Brand & SEO
  brandName: "Hassan's Atlas Treks", // The official business name
  siteName: "Hassan's Atlas Treks", // The name displayed on the site
  siteDescription: "Authentic, private trekking tours in the High Atlas Mountains, led by local Berber guides.",
  keywords: ["atlas mountains trek", "morocco hiking", "imlil guide", "berber village tour", "toubkal trek"],
  
  // Contact & Social
  contact: {
    email: "contact@hassan-treks.com",
    phone: "+212 600 000 001",
    address: "Imlil, High Atlas Mountains, Morocco",
  },
  social: {
    twitter: "https://twitter.com/hassantreks",
    instagram: "https://instagram.com/hassantreks",
    facebook: "https://facebook.com/hassantreks",
  },

  // Theme & Visuals
  colors,

  // Content Specific
 locations: LOCATIONS,
  // Add more locations here as needed
};
// static metadata for the site:
export const metadataStore = {
  homepage: {
    en: {
      title: "Authentic Moroccan Adventures",
      description: "Discover authentic, private tours in Agadir, Marrakech, and the Sahara. We offer bespoke experiences, from desert treks to cultural city tours, crafted by local experts.",
      ogImage: { 
        src: "/images/og/og-homepage.webp",
        alt: "Panoramic view of a Moroccan desert landscape at sunset."
      }
    },
    fr: {
      title: "Aventures Marocaines Authentiques",
      description: "Découvrez des circuits privés et authentiques à Agadir, Marrakech et dans le Sahara. Nous proposons des expériences sur mesure, des treks dans le désert aux visites culturelles, conçues par des experts locaux.",
      ogImage: { 
        src: "/images/og/og-homepage.webp",
        alt: "Vue panoramique d'un paysage désertique marocain au coucher du soleil."
      }
    }
  },
  about: {
    en: {
      title: "Our Story",
      description: "Learn about our passion for responsible tourism and our mission to share the authentic beauty of Morocco. Meet our team of local expert guides.",
      ogImage: { 
        src: "/images/og/og-about.webp",
        alt: "A traditional Moroccan tagine being prepared in a riad."
      }
    },
    fr: {
      title: "Notre Histoire",
      description: "Découvrez notre passion pour le tourisme responsable et notre mission de partager la beauté authentique du Maroc. Rencontrez notre équipe de guides experts locaux.",
      ogImage: { 
        src: "/images/og/og-about.webp",
        alt: "Un tajine marocain traditionnel en cours de préparation dans un riad."
      }
    }
  },
  contact: {
    en: {
      title: "Contact Us",
      description: "Ready to plan your adventure? Get in touch with our team to create your perfect, tailor-made Moroccan journey.",
      ogImage: { 
        src: "/images/og/og-contact.webp",
        alt: "A map of Morocco with a pin on the Souss-Massa region."
      }
    },
    fr: {
      title: "Contactez-Nous",
      description: "Prêt à planifier votre aventure ? Contactez notre équipe pour créer votre voyage marocain sur mesure parfait.",
      ogImage: { 
        src: "/images/og/og-contact.webp",
        alt: "Une carte du Maroc avec une épingle sur la région de Souss-Massa."
      }
    }
  },
  experiences: {
    en: {
      title: "All Our Tours",
      description: "Browse our complete collection of curated tours and authentic experiences across Agadir, Marrakech, the Atlas Mountains, and the Sahara Desert.",
      ogImage: { 
        src: "/images/og/og-experiences.webp",
        alt: "A collage of different Moroccan experiences: desert, mountains, and coast."
      }
    },
    fr: {
      title: "Tous Nos Circuits",
      description: "Parcourez notre collection complète de circuits organisés et d'expériences authentiques à travers Agadir, Marrakech, les montagnes de l'Atlas et le désert du Sahara.",
      ogImage: { 
        src: "/images/og/og-experiences.webp",
        alt: "Un collage de différentes expériences marocaines : désert, montagnes et côte."
      }
    }
  },
  blog: {
    en: {
      title: "Our Journal",
      description: "Read our latest articles and travel guides about exploring the beautiful Souss-Massa region of Morocco.",
      ogImage: { 
        src: "/images/og/og-blog.webp",
        alt: "A person writing in a travel journal with a Moroccan landscape in the background."
      }
    },
    fr: {
      title: "Notre Journal",
      description: "Lisez nos derniers articles et guides de voyage sur l'exploration de la magnifique région de Souss-Massa au Maroc.",
      ogImage: { 
        src: "/images/og/og-blog.webp",
        alt: "Une personne écrivant dans un carnet de voyage avec un paysage marocain en arrière-plan."
      }
    }
  }
} as const;
