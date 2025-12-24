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
  // --- NEW PAGES ---
  planning?: Record<Locale, PageMetadata>;
  sitemap?: Record<Locale, PageMetadata>;
  signup?: Record<Locale, PageMetadata>;
  login?: Record<Locale, PageMetadata>;
  account?: Record<Locale, PageMetadata>;
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
  
  // Get the default description from the new localized 'global' object
  const defaultDescription = siteConfig.textContent.en.global.industrySpecifics;
 
  return {
    homepage: {
      en: {
        // UPDATED: Removed the brand name. The layout 'default' will handle this.
        title: `Morocco Transfers, Tours & Itineraries | ${clientDisplayName}`, 
        description: `Discover the magic of Morocco with ${clientDisplayName}. We offer reliable airport transfers, professional guides, and detailed itineraries from south to north. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "A luxury van on a scenic road in the Atlas Mountains."
        }
      },
      fr: {
        // UPDATED: Removed the brand name
        title: `Transferts, Circuits & Itinéraires au Maroc  | ${clientDisplayName}`,
        description: `Découvrez la magie du Maroc avec ${clientDisplayName}. Nous proposons des transferts aéroport fiables, des guides professionnels et des itinéraires détaillés du sud au nord. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "Un van de luxe sur une route panoramique dans les montagnes de l'Atlas."
        }
      },
      ar: {
        // UPDATED: Removed the brand name
       title: `النقل السياحي، الجولات والبرامج في المغرب | ${clientDisplayName}`,
        description: `اكتشف سحر المغرب مع ${clientDisplayName}. نقدم خدمة نقل المطار الموثوقة، ومرشدين محترفين، وبرامج سياحية مفصلة من الجنوب إلى الشمال. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "شاحنة فان فاخرة على طريق خلاب في جبال الأطلس."
        }
      },
      es: {
        // UPDATED: Removed the brand name
        title: `Traslados, Tours & Itinerarios en Marruecos | ${clientDisplayName}`,
        description: `Descubre la magia de Marruecos con ${clientDisplayName}. Ofrecemos traslados de aeropuerto fiables, guías profesionales e itinerarios detallados de sur a norte. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-homepage.webp",
          alt: "Una furgoneta de lujo en una carretera panorámica en las montañas del Atlas."
        }
      }
    },
    about: {
      en: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `About Us`,
        description: `Learn about our mission to provide seamless travel in Morocco. Meet our team of professional drivers and expert local guides. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "A photo of the MarraGo team of drivers and guides."
        }
      },
      fr: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Notre Équipe`,
        description: `Découvrez notre mission : offrir des voyages fluides au Maroc. Rencontrez notre équipe de chauffeurs professionnels et de guides experts locaux. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "Une photo de l'équipe de chauffeurs et de guides de MarraGo."
        }
      },
      ar: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `من نحن`,
        description: `تعرف على مهمتنا لتوفير سفر سلس في المغرب. قابل فريقنا من السائقين المحترفين والمرشدين المحليين الخبراء. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "صورة لفريق سائقي ومرشدي MarraGo."
        }
      },
      es: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Sobre Nosotros`,
        description: `Conozca nuestra misión de proporcionar viajes fluidos en Marruecos. Conozca a nuestro equipo de conductores profesionales y guías locales expertos. ${defaultDescription}`,
        ogImage: {
          src: "/images/og/og-marrago-about.webp",
          alt: "Una foto del equipo de conductores y guías de MarraGo."
        }
      }
    },
    contact: {
      en: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Contact Us`,
        description: `Ready to plan your trip? Contact ${clientDisplayName} for reliable airport transfers, custom itineraries, and expert local guides in Morocco.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "A map of Morocco with pins on Marrakech, Fes, and Agadir."
        }
      },
      fr: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Contactez-Nous`,
        description: `Prêt à planifier votre voyage ? Contactez ${clientDisplayName} pour des transferts aéroport fiables, des itinéraires sur mesure et des guides locaux experts au Maroc.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "Une carte du Maroc avec des épingles sur Marrakech, Fès et Agadir."
        }
      },
      ar: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `اتصل بنا`,
        description: `هل أنت مستعد لتخطيط رحلتك؟ اتصل بـ ${clientDisplayName} للحصول على نقل مطار موثوق، وبرامج سياحية مخصصة، ومرشدين محليين خبراء في المغرب.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "خريطة المغرب مع دبابيس على مراكش وفاس وأغادير."
        }
      },
      es: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Contáctenos`,
        description: `¿Listo para planificar su viaje? Contacte a ${clientDisplayName} para traslados de aeropuerto fiables, itinerarios personalizados y guías locales expertos en Marruecos.`,
        ogImage: {
          src: "/images/og/og-marrago-contact.webp",
          alt: "Un mapa de Marruecos con chinchetas en Marrakech, Fez y Agadir."
        }
      }
    },
    experiences: {
        en: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `Our Services`,
            description: `Browse our complete list of services: airport transfers, full circuits, detailed itineraries, and professional guides.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp",
              alt: "A collage of a luxury van, an Atlas mountain road, and a guide in a medina."
            }
        },
        fr: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `Nos Services`,
            description: `Parcourez notre liste complète de services : transferts aéroport, circuits complets, itinéraires détaillés et guides professionnels.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp",
              alt: "Un collage d'un van de luxe, d'une route de l'Atlas et d'un guide dans une médina."
            }
        },
        ar: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `خدماتنا`,
            description: `تصفح قائمتنا الكاملة للخدمات: نقل المطار، الدوائر الكاملة، البرامج المفصلة، والمرشدين المحترفين.`,
            ogImage: {
              src: "/images/og/og-marrago-services.webp",
              alt: "صورة مجمعة لسيارة فان فاخرة وطريق في الأطلس ومرشد في المدينة القديمة."
            }
        },
      es: {
          // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Nuestros Servicios`,
        description: `Explore nuestra lista completa de servicios: traslados al aeropuerto, circuitos completos, itinerarios detallados y guías profesionales.`,
        ogImage: {
          src: "/images/og/og-marrago-services.webp",
          alt: "Un collage de una furgoneta de lujo, una carretera del Atlas y un guía en una medina."
        }
      }
    },
    blog: {
        en: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `MarraGo Journal`,
            description: `Read our latest articles and travel guides from our expert drivers and guides about exploring Morocco.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp",
              alt: "A person writing in a travel journal with a Moroccan landscape in the background."
            }
        },
        fr: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `Journal MarraGo`,
            description: `Lisez nos derniers articles et guides de voyage rédigés par nos chauffeurs experts et nos guides sur l'exploration du Maroc.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp",
              alt: "Une personne écrivant dans un carnet de voyage avec un paysage marocain en arrière-plan."
            }
        },
        ar: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `مدونة مراڭو`,
            description: `اقرأ أحدث مقالاتنا وأدلة السفر من سائقينا ومرشدينا الخبراء حول استكشاف المغرب.`,
            ogImage: {
              src: "/images/og/og-marrago-blog.webp",
              alt: "شخص يكتب في دفتر يوميات السفر مع منظر طبيعي مغربي في الخلفية."
            }
        },
      es: {
          // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Diario MarraGo`,
        description: `Lea nuestros últimos artículos y guías de viaje de nuestros conductores y guías expertos sobre cómo explorar Marruecos.`,
        ogImage: {
          src: "/images/og/og-marrago-blog.webp",
          alt: "Una persona escribiendo en un diario de viaje con un paisaje marroquí al fondo."
        }
      }
    },
    reviews: {
        en: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `Customer Reviews`,
            description: `Read what our customers say about their seamless transfers and unforgettable tours with ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp",
              alt: "Happy customers reviewing their trip with MarraGo."
            }
        },
        fr: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `Avis Clients`,
            description: `Découvrez ce que nos clients pensent de leurs transferts fluides et de leurs circuits inoubliables avec ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp",
              alt: "Clients heureux évaluant leur voyage avec MarraGo."
           }
        },
        ar: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `آراء العملاء`,
            description: `اقرأ ما يقوله عملاؤنا عن خدمات النقل السلسة والجولات التي لا تُنسى مع ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-reviews.webp",
              alt: "عملاء سعداء يراجعون رحلتهم مع MarraGo."
            }
        },
      es: {
          // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Reseñas de Clientes`,
        description: `Lea lo que dicen nuestros clientes sobre sus traslados fluidos e inolvidables tours con ${clientDisplayName}.`,
        ogImage: {
          src: "/images/og/og-marrago-reviews.webp",
           alt: "Clientes felices reseñando su viaje con MarraGo."
        }
      }
    },
    faq: {
        en: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `FAQ`,
            description: `Find answers to common questions about booking transfers, custom itineraries, and guides with ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp",
              alt: "Person thinking with question marks about a Morocco trip."
            }
        },
        fr: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `FAQ`,
            description: `Trouvez les réponses aux questions courantes sur la réservation de transferts, les itinéraires personnalisés et les guides avec ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp",
              alt: "Personne qui réfléchit avec des points d'interrogation à propos d'un voyage au Maroc."
           }
        },
        ar: {
            // UPDATED: Removed ' - ${clientDisplayName}'
            title: `الأسئلة المتكررة`,
            description: `ابحث عن إجابات للأسئلة الشائعة حول حجز النقل، والبرامج المخصصة، والمرشدين مع ${clientDisplayName}.`,
            ogImage: {
              src: "/images/og/og-marrago-faq.webp",
              alt: "شخص يفكر بعلامات استفهام حول رحلة إلى المغرب."
            }
        },
      es: {
          // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Preguntas Frecuentes`,
        description: `Encuentre respuestas a preguntas comunes sobre la reserva de traslados, itinerarios personalizados y guías con ${clientDisplayName}.`,
        ogImage: {
          src: "/images/og/og-marrago-faq.webp",
          alt: "Persona pensando con signos de interrogación sobre un viaje a Marruecos."
        }
      }
    },
    termsOfUse: {
      en: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Terms of Use`,
        description: `Read the legal terms and conditions for booking our transport and tour services.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
         alt: "Legal document with pen"
        }
      },
      fr: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Conditions d'Utilisation`,
        description: `Consultez les conditions légales pour la réservation de nos services de transport et de circuits.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
           alt: "Document juridique avec un stylo"
        }
      },
      ar: {
        // UPDATED: Removed ' - ${clientDisplayName}'
      title: `شروط الاستخدام`,
        description: `اقرأ الشروط والأحكام القانونية لحجز خدمات النقل والجولات لدينا.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
          alt: "وثيقة قانونية مع قلم"
        }
      },
      es: {
        // UPDATED: Removed ' - ${clientDisplayName}'
       title: `Términos de Uso`,
        description: `Lea los términos y condiciones legales para reservar nuestros servicios de transporte y tours.`,
        ogImage: {
          src: "/images/og/og-legal.webp",
          alt: "Documento legal con bolígrafo"
        }
      }
     },
    privacyPolicy: {
      en: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Privacy Policy`,
        description: `Understand how ${clientDisplayName} collects, uses, and protects your personal booking data.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Shield icon representing data privacy"
        }
      },
      fr: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Politique de Confidentialité`,
        description: `Comprenez comment ${clientDisplayName} recueille, utilise et protège vos données personnelles de réservation.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Icône de bouclier représentant la confidentialité des données"
        }
      },
      ar: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `سياسة الخصوصية`,
        description: `افهم كيف يقوم ${clientDisplayName} بجمع واستخدام وحماية بيانات الحجز الشخصية الخاصة بك.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "درع يمثل خصوصية البيانات"
     }
      },
      es: {
        // UPDATED: Removed ' - ${clientDisplayName}'
        title: `Política de Privacidad`,
        description: `Comprenda cómo ${clientDisplayName} recopila, utiliza y protege sus datos personales de reserva.`,
        ogImage: {
          src: "/images/og/og-privacy.webp",
          alt: "Icono de escudo que representa la privacidad de los datos"
 }
      }
    },
// --- NEW PAGES: PLANNING ---
    planning: {
        en: {
          title: `Plan Your Trip`,
          description: `Create your dream Morocco itinerary with ${clientDisplayName}. Customize your route, select your dates, and let us handle the logistics.`,
          ogImage: { src: "/images/og/og-marrago-planning.webp", alt: "A map of Morocco being planned out with a pen." }
        },
        fr: {
          title: `Planifiez Votre Voyage`,
          description: `Créez votre itinéraire de rêve au Maroc avec ${clientDisplayName}. Personnalisez votre parcours, sélectionnez vos dates et laissez-nous gérer la logistique.`,
          ogImage: { src: "/images/og/og-marrago-planning.webp", alt: "Une carte du Maroc en cours de planification avec un stylo." }
        },
        ar: {
          title: `خطط لرحلتك`,
          description: `أنشئ مسار أحلامك في المغرب مع ${clientDisplayName}. خصص مسارك، واختر تواريخك، واترك لنا إدارة الخدمات اللوجستية.`,
          ogImage: { src: "/images/og/og-marrago-planning.webp", alt: "خريطة للمغرب يتم التخطيط لها بقلم." }
        },
        es: {
          title: `Planifica Tu Viaje`,
          description: `Crea tu itinerario soñado por Marruecos con ${clientDisplayName}. Personaliza tu ruta, selecciona tus fechas y déjanos encargarnos de la logística.`,
          ogImage: { src: "/images/og/og-marrago-planning.webp", alt: "Un mapa de Marruecos siendo planificado con un bolígrafo." }
        }
      },
  
      // --- NEW PAGES: SITEMAP ---
      sitemap: {
        en: {
          title: `Sitemap`,
          description: `Overview of all pages on the ${clientDisplayName} website to help you navigate our services and content.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Sitemap overview." }
        },
        fr: {
          title: `Plan du Site`,
          description: `Aperçu de toutes les pages du site ${clientDisplayName} pour vous aider à naviguer dans nos services et contenus.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Aperçu du plan du site." }
        },
        ar: {
          title: `خريطة الموقع`,
          description: `نظرة عامة على جميع الصفحات الموجودة على موقع ${clientDisplayName} لمساعدتك في تصفح خدماتنا ومحتوانا.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "نظرة عامة على خريطة الموقع." }
        },
        es: {
          title: `Mapa del Sitio`,
          description: `Resumen de todas las páginas del sitio web de ${clientDisplayName} para ayudarle a navegar por nuestros servicios y contenidos.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Resumen del mapa del sitio." }
        }
      },
  
      // --- NEW PAGES: SIGNUP ---
      signup: {
        en: {
          title: `Sign Up`,
          description: `Create an account with ${clientDisplayName} to manage your bookings, save itineraries, and get exclusive travel offers.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Sign up interface." }
        },
        fr: {
          title: `S'inscrire`,
          description: `Créez un compte avec ${clientDisplayName} pour gérer vos réservations, enregistrer vos itinéraires et obtenir des offres de voyage exclusives.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Interface d'inscription." }
        },
        ar: {
          title: `تسجيل`,
          description: `أنشئ حسابًا مع ${clientDisplayName} لإدارة حجوزاتك وحفظ مسارات الرحلة والحصول على عروض سفر حصرية.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "واجهة التسجيل." }
        },
        es: {
          title: `Registrarse`,
          description: `Cree una cuenta con ${clientDisplayName} para gestionar sus reservas, guardar itinerarios y obtener ofertas de viaje exclusivas.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Interfaz de registro." }
        }
      },
  
      // --- NEW PAGES: LOGIN ---
      login: {
        en: {
          title: `Login`,
          description: `Access your ${clientDisplayName} account to view your upcoming trips and manage your profile.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Login interface." }
        },
        fr: {
          title: `Connexion`,
          description: `Accédez à votre compte ${clientDisplayName} pour consulter vos prochains voyages et gérer votre profil.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Interface de connexion." }
        },
        ar: {
          title: `تسجيل الدخول`,
          description: `قم بالوصول إلى حساب ${clientDisplayName} الخاص بك لعرض رحلاتك القادمة وإدارة ملفك الشخصي.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "واجهة تسجيل الدخول." }
        },
        es: {
          title: `Iniciar Sesión`,
          description: `Acceda a su cuenta de ${clientDisplayName} para ver sus próximos viajes y gestionar su perfil.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Interfaz de inicio de sesión." }
        }
      },
  
      // --- NEW PAGES: ACCOUNT ---
      account: {
        en: {
          title: `My Account`,
          description: `Manage your personal details, booking history, and preferences with ${clientDisplayName}.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "User account profile." }
        },
        fr: {
          title: `Mon Compte`,
          description: `Gérez vos informations personnelles, votre historique de réservation et vos préférences avec ${clientDisplayName}.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Profil du compte utilisateur." }
        },
        ar: {
          title: `حسابي`,
          description: `قم بإدارة تفاصيلك الشخصية، وسجل الحجز، وتفضيلاتك مع ${clientDisplayName}.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "ملف حساب المستخدم." }
        },
        es: {
          title: `Mi Cuenta`,
          description: `Gestione sus datos personales, historial de reservas y preferencias con ${clientDisplayName}.`,
          ogImage: { src: "/images/og/og-default.webp", alt: "Perfil de la cuenta de usuario." }
        }
      }
  };
}