// src/config/page-seo-metadata.ts (Localized Page SEO Titles & Descriptions)

import { SiteConfig } from './site'; // Ensure SiteConfig is imported from your site.ts
import { Locale } from './types'; // Ensure Locale is defined in your types.ts

export interface PageMetadata {
  title: string;
  description: string;
  ogImage?: { // Made optional for now, as not all pages might have unique OG images
    src: string;
    alt: string;
  };
}

// Interface to hold all page-specific localized metadata
export interface MetadataStore {
  homepage?: Record<Locale, PageMetadata>;
  about?: Record<Locale, PageMetadata>;
  contact?: Record<Locale, PageMetadata>;
  experiences?: Record<Locale, PageMetadata>;
  blog?: Record<Locale, PageMetadata>;
  privacyPolicy?: Record<Locale, PageMetadata>;
  termsOfUse?: Record<Locale, PageMetadata>;
  reviews?: Record<Locale, PageMetadata>; // Added for completeness if you have reviews page
  faq?: Record<Locale, PageMetadata>;       // Added for completeness if you have faq page
  // Add other pages as needed
}

/**
 * Generates dynamic metadata for pages based on siteConfig.
 * This function ensures consistency and centralizes metadata generation logic.
 *
 * @param siteConfig The full SiteConfig object containing brand names, slogans, and general descriptions.
 * @returns A MetadataStore object containing localized titles and descriptions for various pages.
 */
export function generatePageMetadata(siteConfig: SiteConfig): MetadataStore {
  const clientDisplayName = siteConfig.siteName || siteConfig.brandName;
  const defaultDescription = siteConfig.siteDescription;
 // const defaultOgImage = siteConfig.ogImage || { src: '/images/og/default-og.webp', alt: 'Website default social share image' }; // Fallback OG image

  return {
    homepage: {
      en: {
        title: `Authentic Moroccan Adventures - ${clientDisplayName}`,
        description: `Discover authentic, private tours in Morocco. We offer bespoke experiences, from desert treks to cultural city tours, crafted by local experts. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-homepage.webp", // Specific OG image for homepage
          alt: "Panoramic view of a Moroccan desert landscape at sunset."
        }
      },
      fr: {
        title: `Aventures Marocaines Authentiques - ${clientDisplayName}`,
        description: `Découvrez des circuits privés et authentiques au Maroc. Nous proposons des expériences sur mesure, des treks dans le désert aux visites culturelles, conçues par des experts locaux. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-homepage.webp",
          alt: "Vue panoramique d'un paysage désertique marocain au coucher du soleil."
        }
      },
      ar: {
        title: `مغامرات مغربية أصيلة - ${clientDisplayName}`,
        description: `اكتشف جولات خاصة وأصيلة في المغرب. نقدم تجارب مصممة خصيصًا، من رحلات الصحراء إلى جولات المدينة الثقافية، صممها خبراء محليون. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-homepage.webp",
          alt: "منظر بانورامي لصحراء مغربية عند غروب الشمس."
        }
      },
    },
    about: {
      en: {
        title: `Our Story - ${clientDisplayName}`,
        description: `Learn about our passion for responsible tourism and our mission to share the authentic beauty of Morocco. Meet our team of local expert guides. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-about.webp",
          alt: "A traditional Moroccan tagine being prepared in a riad."
        }
      },
      fr: {
        title: `Notre Histoire - ${clientDisplayName}`,
        description: `Découvrez notre passion pour le tourisme responsable et notre mission de partager la beauté authentique du Maroc. Rencontrez notre équipe de guides experts locaux. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-about.webp",
          alt: "Un tajine marocain traditionnel en cours de préparation dans un riad."
        }
      },
      ar: {
        title: `قصتنا - ${clientDisplayName}`,
        description: `تعرف على شغفنا بالسياحة المسؤولة ومهمتنا لمشاركة الجمال الأصيل للمغرب. قابل فريقنا من المرشدين المحليين الخبراء. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-about.webp",
          alt: "طاجين مغربي تقليدي يتم تحضيره في رياض."
        }
      },
    },
    contact: {
      en: {
        title: `Contact Us - ${clientDisplayName}`,
        description: `Ready to plan your adventure? Get in touch with our team to create your perfect, tailor-made Moroccan journey.`,
        ogImage: {
          src: "/images/og/og-contact.webp",
          alt: "A map of Morocco with a pin on the Souss-Massa region."
        }
      },
      fr: {
        title: `Contactez-Nous - ${clientDisplayName}`,
        description: `Prêt à planifier votre aventure ? Contactez notre équipe pour créer votre voyage marocain sur mesure parfait.`,
        ogImage: {
          src: "/images/og/og-contact.webp",
          alt: "Une carte du Maroc avec une épingle sur la région de Souss-Massa."
        }
      },
      ar: {
        title: `اتصل بنا - ${clientDisplayName}`,
        description: `هل أنت مستعد لتخطيط مغامرتك؟ تواصل مع فريقنا لإنشاء رحلتك المغربية المثالية والمصممة خصيصًا لك.`,
        ogImage: {
          src: "/images/og/og-contact.webp",
          alt: "خريطة المغرب مع دبوس على منطقة سوس ماسة."
        }
      },
    },
    experiences: {
        en: {
            title: `All Our Tours - ${clientDisplayName}`,
            description: `Browse our complete collection of curated tours and authentic experiences across Morocco.`,
            ogImage: {
              src: "/images/og/og-experiences.webp",
              alt: "A collage of different Moroccan experiences: desert, mountains, and coast."
            }
        },
        fr: {
            title: `Tous Nos Circuits - ${clientDisplayName}`,
            description: `Parcourez notre collection complète de circuits organisés et d'expériences authentiques à travers le Maroc.`,
            ogImage: {
              src: "/images/og/og-experiences.webp",
              alt: "Un collage de différentes expériences marocaines : désert, montagnes et côte."
            }
        },
        ar: {
            title: `جميع جولاتنا - ${clientDisplayName}`,
            description: `تصفح مجموعتنا الكاملة من الجولات المنسقة والتجارب الأصيلة في جميع أنحاء المغرب.`,
            ogImage: {
              src: "/images/og/og-experiences.webp",
              alt: "مجموعة من التجارب المغربية المختلفة: الصحراء، الجبال، والساحل."
            }
        },
    },
    blog: {
        en: {
            title: `Our Journal - ${clientDisplayName}`,
            description: `Read our latest articles and travel guides about exploring the beautiful Souss-Massa region of Morocco.`,
            ogImage: {
              src: "/images/og/og-blog.webp",
              alt: "A person writing in a travel journal with a Moroccan landscape in the background."
            }
        },
        fr: {
            title: `Notre Journal - ${clientDisplayName}`,
            description: `Lisez nos derniers articles et guides de voyage sur l'exploration de la magnifique région de Souss-Massa au Maroc.`,
            ogImage: {
              src: "/images/og/og-blog.webp",
              alt: "Une personne écrivant dans un carnet de voyage avec un paysage marocain en arrière-plan."
            }
        },
        ar: {
            title: `مجلتنا - ${clientDisplayName}`,
            description: `اقرأ أحدث مقالاتنا وأدلة السفر حول استكشاف منطقة سوس ماسة الجميلة في المغرب.`,
            ogImage: {
              src: "/images/og/og-blog.webp",
              alt: "شخص يكتب في دفتر يوميات السفر مع منظر طبيعي مغربي في الخلفية."
            }
        },
    },
    reviews: {
        en: {
            title: `Customer Reviews - ${clientDisplayName}`,
            description: `Read what our customers say about their unforgettable travel experiences with us in Morocco.`,
            ogImage: {
              src: "/images/og/og-reviews.webp",
              alt: "Happy customers reviewing their trip"
            }
        },
        fr: {
            title: `Avis Clients - ${clientDisplayName}`,
            description: `Découvrez ce que nos clients pensent de leurs expériences de voyage inoubliables avec nous au Maroc.`,
            ogImage: {
              src: "/images/og/og-reviews.webp",
              alt: "Clients heureux évaluant leur voyage"
            }
        },
        ar: {
            title: `آراء العملاء - ${clientDisplayName}`,
            description: `اقرأ ما يقوله عملاؤنا عن تجارب سفرهم التي لا تُنسى معنا في المغرب.`,
            ogImage: {
              src: "/images/og/og-reviews.webp",
              alt: "عملاء سعداء يراجعون رحلتهم"
            }
        },
    },
    faq: {
        en: {
            title: `Frequently Asked Questions - ${clientDisplayName}`,
            description: `Find answers to common questions about our travel services and Moroccan adventures.`,
            ogImage: {
              src: "/images/og/og-faq.webp",
              alt: "Person thinking with question marks"
            }
        },
        fr: {
            title: `Foire Aux Questions - ${clientDisplayName}`,
            description: `Trouvez les réponses aux questions courantes sur nos services de voyage et nos aventures marocaines.`,
            ogImage: {
              src: "/images/og/og-faq.webp",
              alt: "Personne qui réfléchit avec des points d'interrogation"
            }
        },
        ar: {
            title: `الأسئلة المتكررة - ${clientDisplayName}`,
            description: `ابحث عن إجابات للأسئلة الشائعة حول خدمات السفر والمغامرات المغربية.`,
            ogImage: {
              src: "/images/og/og-faq.webp",
              alt: "شخص يفكر بعلامات استفهام"
            }
        },
    },
    termsOfUse: { // Renamed from 'terms' to match SiteConfig and clarity
      en: {
        title: `Terms of Use - ${clientDisplayName}`,
        description: `Read the legal terms and conditions for using our website and services.`,
        ogImage: {
          src: "/images/og/og-terms.webp",
          alt: "Legal document with pen"
        }
      },
      fr: {
        title: `Conditions d'Utilisation - ${clientDisplayName}`,
        description: `Consultez les conditions légales d'utilisation de notre site web et de nos services.`,
        ogImage: {
          src: "/images/og/og-terms.webp",
          alt: "Document juridique avec un stylo"
        }
      },
      ar: {
        title: `شروط الاستخدام - ${clientDisplayName}`,
        description: `اقرأ الشروط والأحكام القانونية لاستخدام موقعنا وخدماتنا.`,
        ogImage: {
          src: "/images/og/og-terms.webp",
          alt: "وثيقة قانونية مع قلم"
        }
      },
    },
    privacyPolicy: { // Renamed from 'privacy' to match SiteConfig and clarity
      en: {
        title: `Privacy Policy - ${clientDisplayName}`,
        description: `Understand how we collect, use, and protect your personal data.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Shield icon representing data privacy"
        }
      },
      fr: {
        title: `Politique de Confidentialité - ${clientDisplayName}`,
        description: `Comprenez comment nous recueillons, utilisons et protégeons vos données personnelles.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Icône de bouclier représentant la confidentialité des données"
        }
      },
      ar: {
        title: `سياسة الخصوصية - ${clientDisplayName}`,
        description: `افهم كيف نجمع بياناتك الشخصية ونستخدمها ونحميها.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "درع يمثل خصوصية البيانات"
        }
      },
    }
  };
}