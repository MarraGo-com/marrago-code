// src/config/page-seo-metadata.ts (Localized Page SEO Titles & Descriptions)

import { SiteConfig } from './site'; // Ensure SiteConfig is imported from your site.ts
import { Locale } from './types'; // Ensure Locale is defined in your types.ts

export interface PageMetadata {
  title: string;
  description: string;
  ogImage?: {
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
  reviews?: Record<Locale, PageMetadata>;
  faq?: Record<Locale, PageMetadata>;
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
  const clientDisplayName = siteConfig.siteName || siteConfig.brandName; // This will be "MarraGo"
  const defaultDescription = siteConfig.siteDescription; // This is your main site description
 
  return {
    homepage: {
      en: {
        title: `${clientDisplayName} - Morocco Transfers, Tours & Itineraries`,
        description: `Discover the magic of Morocco with ${clientDisplayName}. We offer reliable airport transfers, professional guides, and detailed itineraries from south to north. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp", // <-- UPDATE PATH
          alt: "A luxury van on a scenic road in the Atlas Mountains."
        }
      },
      fr: {
        title: `${clientDisplayName} - Transferts, Circuits & Itinéraires au Maroc`,
        description: `Découvrez la magie du Maroc avec ${clientDisplayName}. Nous proposons des transferts aéroport fiables, des guides professionnels et des itinéraires détaillés du sud au nord. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "Un van de luxe sur une route panoramique dans les montagnes de l'Atlas."
        }
      },
      ar: {
        title: `${clientDisplayName} - النقل السياحي، الجولات والبرامج في المغرب`,
        description: `اكتشف سحر المغرب مع ${clientDisplayName}. نقدم خدمة نقل المطار الموثوقة، ومرشدين محترفين، وبرامج سياحية مفصلة من الجنوب إلى الشمال. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "شاحنة فان فاخرة على طريق خلاب في جبال الأطلس."
        }
      },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `${clientDisplayName} - Traslados, Tours & Itinerarios en Marruecos`,
        description: `Descubre la magia de Marruecos con ${clientDisplayName}. Ofrecemos traslados de aeropuerto fiables, guías profesionales e itinerarios detallados de sur a norte. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "Una furgoneta de lujo en una carretera panorámica en las montañas del Atlas."
        }
      }
    },
    about: {
      en: {
        title: `About Us - ${clientDisplayName}`,
        description: `Learn about our mission to provide seamless travel in Morocco. Meet our team of professional drivers and expert local guides. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp", // <-- UPDATE PATH
          alt: "A photo of the MarraGo team of drivers and guides."
        }
      },
      fr: {
        title: `Notre Équipe - ${clientDisplayName}`,
        description: `Découvrez notre mission : offrir des voyages fluides au Maroc. Rencontrez notre équipe de chauffeurs professionnels et de guides experts locaux. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "Une photo de l'équipe de chauffeurs et de guides de MarraGo."
        }
      },
      ar: {
        title: `من نحن - ${clientDisplayName}`,
        description: `تعرف على مهمتنا لتوفير سفر سلس في المغرب. قابل فريقنا من السائقين المحترفين والمرشدين المحليين الخبراء. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "صورة لفريق سائقي ومرشدي MarraGo."
        }
      },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Sobre Nosotros - ${clientDisplayName}`,
        description: `Conozca nuestra misión de proporcionar viajes fluidos en Marruecos. Conozca a nuestro equipo de conductores profesionales y guías locales expertos. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "Una foto del equipo de conductores y guías de MarraGo."
        }
      }
    },
    contact: {
      en: {
        title: `Contact Us - ${clientDisplayName}`,
        description: `Ready to plan your trip? Contact ${clientDisplayName} for reliable airport transfers, custom itineraries, and expert local guides in Morocco.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp", // <-- UPDATE PATH
          alt: "A map of Morocco with pins on Marrakech, Fes, and Agadir."
        }
      },
      fr: {
        title: `Contactez-Nous - ${clientDisplayName}`,
        description: `Prêt à planifier votre voyage ? Contactez ${clientDisplayName} pour des transferts aéroport fiables, des itinéraires sur mesure et des guides locaux experts au Maroc.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "Une carte du Maroc avec des épingles sur Marrakech, Fès et Agadir."
        }
      },
      ar: {
        title: `اتصل بنا - ${clientDisplayName}`,
        description: `هل أنت مستعد لتخطيط رحلتك؟ اتصل بـ ${clientDisplayName} للحصول على نقل مطار موثوق، وبرامج سياحية مخصصة، ومرشدين محليين خبراء في المغرب.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "خريطة المغرب مع دبابيس على مراكش وفاس وأغادير."
        }
      },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Contáctenos - ${clientDisplayName}`,
        description: `¿Listo para planificar su viaje? Contacte a ${clientDisplayName} para traslados de aeropuerto fiables, itinerarios personalizados y guías locales expertos en Marruecos.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "Un mapa de Marruecos con chinchetas en Marrakech, Fez y Agadir."
        }
      }
    },
    experiences: {
        en: {
            title: `Our Services - ${clientDisplayName}`,
            description: `Browse our complete list of services: airport transfers, full circuits, detailed itineraries, and professional guides.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp", // <-- UPDATE PATH
              alt: "A collage of a luxury van, an Atlas mountain road, and a guide in a medina."
            }
        },
        fr: {
            title: `Nos Services - ${clientDisplayName}`,
            description: `Parcourez notre liste complète de services : transferts aéroport, circuits complets, itinéraires détaillés et guides professionnels.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp",
              alt: "Un collage d'un van de luxe, d'une route de l'Atlas et d'un guide dans une médina."
            }
        },
        ar: {
            title: `خدماتنا - ${clientDisplayName}`,
            description: `تصفح قائمتنا الكاملة للخدمات: نقل المطار، الدوائر الكاملة، البرامج المفصلة، والمرشدين المحترفين.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp",
              alt: "صورة مجمعة لسيارة فان فاخرة وطريق في الأطلس ومرشد في المدينة القديمة."
            }
        },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Nuestros Servicios - ${clientDisplayName}`,
        description: `Explore nuestra lista completa de servicios: traslados al aeropuerto, circuitos completos, itinerarios detallados y guías profesionales.`,
        ogImage: {
          src: "/images/og/og-marrago-services.webp",
          alt: "Un collage de una furgoneta de lujo, una carretera del Atlas y un guía en una medina."
        }
      }
    },
    blog: {
        en: {
            title: `MarraGo Journal - ${clientDisplayName}`,
            description: `Read our latest articles and travel guides from our expert drivers and guides about exploring Morocco.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp", // <-- UPDATE PATH
              alt: "A person writing in a travel journal with a Moroccan landscape in the background."
            }
        },
        fr: {
            title: `Journal MarraGo - ${clientDisplayName}`,
            description: `Lisez nos derniers articles et guides de voyage rédigés par nos chauffeurs experts et nos guides sur l'exploration du Maroc.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp",
              alt: "Une personne écrivant dans un carnet de voyage avec un paysage marocain en arrière-plan."
            }
        },
        ar: {
            title: `مدونة مراڭو - ${clientDisplayName}`,
            description: `اقرأ أحدث مقالاتنا وأدلة السفر من سائقينا ومرشدينا الخبراء حول استكشاف المغرب.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp",
              alt: "شخص يكتب في دفتر يوميات السفر مع منظر طبيعي مغربي في الخلفية."
            }
        },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Diario MarraGo - ${clientDisplayName}`,
        description: `Lea nuestros últimos artículos y guías de viaje de nuestros conductores y guías expertos sobre cómo explorar Marruecos.`,
        ogImage: {
          src: "/images/og/og-marrago-blog.webp",
          alt: "Una persona escribiendo en un diario de viaje con un paisaje marroquí al fondo."
        }
      }
    },
    reviews: {
        en: {
            title: `Customer Reviews - ${clientDisplayName}`,
            description: `Read what our customers say about their seamless transfers and unforgettable tours with ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp", // <-- UPDATE PATH
              alt: "Happy customers reviewing their trip with MarraGo."
            }
        },
        fr: {
            title: `Avis Clients - ${clientDisplayName}`,
            description: `Découvrez ce que nos clients pensent de leurs transferts fluides et de leurs circuits inoubliables avec ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp",
              alt: "Clients heureux évaluant leur voyage avec MarraGo."
            }
        },
        ar: {
            title: `آراء العملاء - ${clientDisplayName}`,
            description: `اقرأ ما يقوله عملاؤنا عن خدمات النقل السلسة والجولات التي لا تُنسى مع ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp",
              alt: "عملاء سعداء يراجعون رحلتهم مع MarraGo."
            }
        },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Reseñas de Clientes - ${clientDisplayName}`,
        description: `Lea lo que dicen nuestros clientes sobre sus traslados fluidos e inolvidables tours con ${clientDisplayName}.`,
        ogImage: {
          src: "/images/og/og-marrago-reviews.webp",
          alt: "Clientes felices reseñando su viaje con MarraGo."
        }
      }
    },
    faq: {
        en: {
            title: `FAQ - ${clientDisplayName}`,
            description: `Find answers to common questions about booking transfers, custom itineraries, and guides with ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp", // <-- UPDATE PATH
              alt: "Person thinking with question marks about a Morocco trip."
            }
        },
        fr: {
            title: `FAQ - ${clientDisplayName}`,
            description: `Trouvez les réponses aux questions courantes sur la réservation de transferts, les itinéraires personnalisés et les guides avec ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp",
              alt: "Personne qui réfléchit avec des points d'interrogation à propos d'un voyage au Maroc."
            }
        },
        ar: {
            title: `الأسئلة المتكررة - ${clientDisplayName}`,
            description: `ابحث عن إجابات للأسئلة الشائعة حول حجز النقل، والبرامج المخصصة، والمرشدين مع ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp",
              alt: "شخص يفكر بعلامات استفهام حول رحلة إلى المغرب."
            }
        },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Preguntas Frecuentes - ${clientDisplayName}`,
        description: `Encuentre respuestas a preguntas comunes sobre la reserva de traslados, itinerarios personalizados y guías con ${clientDisplayName}.`,
        ogImage: {
          src: "/images/og/og-marrago-faq.webp",
          alt: "Persona pensando con signos de interrogación sobre un viaje a Marruecos."
        }
      }
    },
    termsOfUse: {
      en: {
        title: `Terms of Use - ${clientDisplayName}`,
        description: `Read the legal terms and conditions for booking our transport and tour services.`,
        ogImage: {
          src: "/images/og/og-legal.webp", // <-- UPDATE PATH
          alt: "Legal document with pen"
        }
      },
      fr: {
        title: `Conditions d'Utilisation - ${clientDisplayName}`,
        description: `Consultez les conditions légales pour la réservation de nos services de transport et de circuits.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
          alt: "Document juridique avec un stylo"
        }
      },
      ar: {
        title: `شروط الاستخدام - ${clientDisplayName}`,
        description: `اقرأ الشروط والأحكام القانونية لحجز خدمات النقل والجولات لدينا.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
          alt: "وثيقة قانونية مع قلم"
        }
      },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Términos de Uso - ${clientDisplayName}`,
        description: `Lea los términos y condiciones legales para reservar nuestros servicios de transporte y tours.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
          alt: "Documento legal con bolígrafo"
        }
      }
    },
    privacyPolicy: {
      en: {
        title: `Privacy Policy - ${clientDisplayName}`,
        description: `Understand how ${clientDisplayName} collects, uses, and protects your personal booking data.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Shield icon representing data privacy"
        }
      },
      fr: {
        title: `Politique de Confidentialité - ${clientDisplayName}`,
        description: `Comprenez comment ${clientDisplayName} recueille, utilise et protège vos données personnelles de réservation.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Icône de bouclier représentant la confidentialité des données"
        }
      },
      ar: {
        title: `سياسة الخصوصية - ${clientDisplayName}`,
        description: `افهم كيف يقوم ${clientDisplayName} بجمع واستخدام وحماية بيانات الحجز الشخصية الخاصة بك.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "درع يمثل خصوصية البيانات"
        }
      },
      // --- ADD YOUR NEW 'ES' LOCALE ---
      es: {
        title: `Política de Privacidad - ${clientDisplayName}`,
        description: `Comprenda cómo ${clientDisplayName} recopila, utiliza y protege sus datos personales de reserva.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Icono de escudo que representa la privacidad de los datos"
        }
      }
    }
  };
}