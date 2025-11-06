// src/config/client-data.ts (Client-Specific Data & Final SiteConfig Export)

import { mergeClientDataWithTheme, SiteConfig } from './site'; // Import from the core site.ts
import { SiteClientTextContent} from './types'; // Import necessary types
import { generatePageMetadata, MetadataStore } from './page-seo-metadata'; // <-- ADD THIS IMPORT

// --- Client-Specific Textual Content ---
const clientTextContent: SiteClientTextContent = {
  en: { // English content for MarraGo
    homepage: {
      heroTitle: "MarraGo",
      heroSubtitle: "Discover the magic of Morocco from south to north. We create your detailed itinerary, handling all transport, guides, and hotels for a seamless journey.", // <-- UPDATED
      heroCtaButtonText: "Start Your Journey", // <-- UPDATED
      featuredExperiencesTitle: "Our All-in-One Services", // <-- UPDATED
      whyChooseUsTitle: "Why Travel With MarraGo?",
      whyChooseUsFeatures: [
        { title: "Professional Transport", description: "Comfortable, air-conditioned vehicles with professional and reliable drivers at your service 24/7." }, // <-- UPDATED
        { title: "Expert Local Guides", description: "Discover Morocco's rich history with a professional, certified guide in every city you visit." }, // <-- UPDATED
        { title: "Detailed Itineraries", description: "We plan your entire trip from south to north in advance, including hotels, stops, and all logistics." }, // <-- UPDATED
      ],
      blogHighlightsTitle: "From Our Morocco Journal",
      blogHighlightsSubtitle: "Travel tips, local secrets, and adventure stories from our guides.",
      socialProofTitle: "Our Partners & Recognitions",
      testimonialsTitle: "Hear From Our Travelers",
      testimonialsSubtitle: "What our guests say about their Moroccan adventure with us.",
      newsletterTitle: "Get Your Morocco Travel Tips",
      newsletterSubtitle: "Join our newsletter for exclusive offers, travel inspiration, and local insights."
    },
    luxuryHomepageSlides: [
      {
        image: '/images/slides/marrago-transfer-van.webp',
        title: 'Reliable Airport Transfers',
        subtitle: 'Start your trip stress-free. Punctual, professional drivers waiting for you at Marrakech, Agadir, and more.',
        buttonText: 'Book a Transfer',
        link: '/experiences#transfers',
      },
      {
        image: '/images/slides/marrago-atlas-4x4.webp',
        title: 'Full Moroccan Circuits', // <-- UPDATED
        subtitle: 'Let us plan your complete journey from south to north, including all transport, hotels, and guides.', // <-- UPDATED
        buttonText: 'Plan Your Itinerary', // <-- UPDATED
        link: '/experiences#excursions',
      },
      {
        image: '/images/slides/marrago-guide-medina.webp',
        title: 'Expert Historical Guides', // <-- UPDATED
        subtitle: 'Explore the rich history of Fes, Marrakech, and more with a professional guide providing all the necessary information.', // <-- UPDATED
        buttonText: 'Meet Our Guides', // <-- UPDATED
        link: '/experiences#guides',
      },
    ],
    aboutPage: {
      title: "About MarraGo: Your Complete Moroccan Itinerary Planners", // <-- UPDATED
      subtitle: "Seamless travel, from south to north.", // <-- UPDATED
      paragraph1: "MarraGo was born from a passion to show travelers the *real* magic of Morocco, from south to north. We are a full-service agency that believes you shouldn't have to worry about logistics. We are here to be your single point of contact for your entire journey.", // <-- UPDATED
      paragraph2: "Our process is simple: we work with you to prepare a detailed travel itinerary in advance. We handle all your hotel reservations, arrange comfortable, air-conditioned transportation with reliable drivers, and provide professional tour guides in each city to help you explore Morocco's rich history. Your only job is to enjoy the journey.", // <-- UPDATED (Uses his exact words)
      valuesTitle: "Our Travel Promise",
      valuesSubtitle: "What you can expect from every booking.",
      values: [
        { title: "Comfort & Safety", description: "Comfortable, air-conditioned vehicles and professional, reliable drivers." }, // <-- UPDATED
        { title: "Historical Expertise", description: "Certified local guides who share the rich history and culture of each city." }, // <-- UPDATED
        { title: "Seamless Planning", description: "One detailed itinerary in advance. We handle all logistics, hotels, and transport." }, // <-- UPDATED
      ],
      teamTitle: "Meet Your Guides & Drivers",
      teamSubtitle: "The professional, local team making your trip happen.",
      teamMembers: [
        { image: "/images/mock/driver-male.webp", name: "Hassan", title: "Lead Driver & Transport Manager", bio: "With 15+ years of experience, Hassan ensures every airport transfer and city-to-city trip is safe, comfortable, and punctual." },
        { image: "/images/mock/guide-female.webp", name: "Fatima", title: "Certified Guide - Marrakech", bio: "Fatima is a licensed guide who speaks 4 languages and loves sharing the hidden history and food of the Marrakech medina." },
        { image: "/images/mock/ops-manager-male.webp", name: "Omar (Your Brother)", title: "Founder & Itinerary Planner", bio: "Omar manages all logistics, from your detailed itinerary to hotel bookings, ensuring every part of your trip connects perfectly." }, // <-- UPDATED
      ],
      ctaTitle: "Ready for Your Moroccan Adventure?",
      ctaButtonText: "Plan Your Trip Now", // <-- UPDATED
    },
    contactPage: {
      title: "Contact MarraGo",
      infoTitle: "Get in Touch With Our Team",
      infoSubtitle: "For custom itineraries, full circuits, or any questions, our team is ready to build your perfect Moroccan trip.", // <-- UPDATED
    },
    experiencesPage: { 
      title: "Our Services: Full Itineraries, Transport & Guides", // <-- UPDATED
      subtitle: "Explore all the ways we can make your Moroccan travel seamless and authentic.",
    },
    blogPage: {
      title: "MarraGo Travel Journal",
      subtitle: "Tips, insights, and stories from our drivers and guides to help you discover the real Morocco.",
    },
  },
  "fr": { // French content for MarraGo
    "homepage": {
      "heroTitle": "MarraGo",
      heroSubtitle: "Découvrez la magie du Maroc du sud au nord. Nous créons votre itinéraire détaillé, gérant transport, guides et hôtels pour un voyage sans faille.", // <-- UPDATED
      heroCtaButtonText: "Commencez Votre Voyage", // <-- UPDATED
      featuredExperiencesTitle: "Nos Services Tout-en-Un", // <-- UPDATED
      whyChooseUsTitle: "Pourquoi Voyager Avec MarraGo ?",
      whyChooseUsFeatures: [
        { title: "Transport Professionnel", description: "Véhicules confortables et climatisés avec des chauffeurs professionnels et fiables à votre service 24/7." }, // <-- UPDATED
        { title: "Guides Locaux Experts", description: "Découvrez la riche histoire du Maroc avec un guide professionnel et certifié dans chaque ville." }, // <-- UPDATED
        { title: "Itinéraires Détaillés", description: "Nous planifions votre voyage complet du sud au nord à l'avance, incluant hôtels, arrêts et toute la logistique." }, // <-- UPDATED
      ],
      blogHighlightsTitle: "De Notre Journal Marocain",
      blogHighlightsSubtitle: "Conseils de voyage, secrets locaux et récits d'aventure de nos guides.",
      socialProofTitle: "Nos Partenaires & Reconnaissances",
      testimonialsTitle: "Nos Voyageurs Prennent la Parole",
      testimonialsSubtitle: "Ce que nos clients disent de leur aventure marocaine avec nous.",
      newsletterTitle: "Recevez nos Astuces de Voyage",
      newsletterSubtitle: "Inscrivez-vous pour des offres exclusives, de l'inspiration et des bons plans locaux."
    },
    "luxuryHomepageSlides": [
      {
        image: "/images/slides/marrago-transfer-van.webp",
        title: "Transferts Aéroport Fiables",
        subtitle: "Commencez votre voyage sans stress. Chauffeurs ponctuels et professionnels vous attendent à Marrakech, Agadir, et plus encore.",
        buttonText: "Réserver un Transfert",
        link: "/services/transfers"
      },
      {
        image: "/images/slides/marrago-atlas-4x4.webp",
        title: "Circuits Marocains Complets", // <-- UPDATED
        subtitle: "Laissez-nous planifier votre voyage complet du sud au nord, incluant transport, hôtels et guides.", // <-- UPDATED
        buttonText: "Planifiez Votre Itinéraire", // <-- UPDATED
        link: "/services/excursions"
      },
      {
        image: "/images/slides/marrago-guide-medina.webp",
        title: "Guides Historiques Experts", // <-- UPDATED
        subtitle: "Explorez la riche histoire de Fès, Marrakech et plus encore avec un guide professionnel vous donnant toutes les informations.", // <-- UPDATED
        buttonText: "Rencontrez Nos Guides", // <-- UPDATED
        link: "/services/guides"
      }
    ],
    "aboutPage": {
      title: "À Propos de MarraGo : Vos Planificateurs d'Itinéraires Complets au Maroc", // <-- UPDATED
      subtitle: "Voyagez sans faille, du sud au nord.", // <-- UPDATED
      paragraph1: "MarraGo est née de la passion de montrer aux voyageurs la *vraie* magie du Maroc, du sud au nord. Nous sommes une agence complète qui croit que vous ne devriez pas vous soucier de la logistique. Nous sommes votre unique point de contact pour tout votre voyage.", // <-- UPDATED
      paragraph2: "Notre processus est simple : nous préparons avec vous un itinéraire de voyage détaillé à l'avance. Nous gérons toutes vos réservations d'hôtel, organisons un transport confortable et climatisé avec des chauffeurs fiables, et fournissons des guides touristiques professionnels dans chaque ville pour vous aider à explorer la riche histoire du Maroc. Votre seul travail est de profiter du voyage.", // <-- UPDATED (Uses his exact words)
      valuesTitle: "Notre Promesse de Voyage",
      valuesSubtitle: "Ce que vous pouvez attendre de chaque réservation.",
      values: [
        { title: "Confort & Sécurité", description: "Véhicules confortables, climatisés et chauffeurs professionnels et fiables." }, // <-- UPDATED
        { title: "Expertise Historique", description: "Guides locaux certifiés qui partagent la riche histoire et culture de chaque ville." }, // <-- UPDATED
        { title: "Planification Sans Faille", description: "Un itinéraire détaillé à l'avance. Nous gérons logistique, hôtels et transport." }, // <-- UPDATED
      ],
      teamTitle: "Rencontrez Nos Guides & Chauffeurs",
      teamSubtitle: "L'équipe locale et professionnelle qui donne vie à votre voyage.",
      teamMembers: [
        { image: "/images/mock/driver-male.webp", name: "Hassan", title: "Chauffeur Principal & Resp. Transport", bio: "Avec plus de 15 ans d'expérience, Hassan veille à ce que chaque transfert aéroport et trajet inter-villes soit sûr, confortable et ponctuel." },
        { image: "/images/mock/guide-female.webp", name: "Fatima", title: "Guide Certifiée - Marrakech", bio: "Fatima est une guide agréée qui parle 4 langues et adore partager l'histoire cachée et la gastronomie de la médina de Marrakech." },
        { image: "/images/mock/ops-manager-male.webp", name: "Omar", title: "Fondateur & Planificateur d'Itinéraires", bio: "Omar gère toute la logistique, de votre itinéraire détaillé aux réservations d'hôtels, s'assurant que chaque partie de votre voyage se connecte parfaitement." }, // <-- UPDATED
      ],
      ctaTitle: "Prêt pour Votre Aventure Marocaine ?",
      ctaButtonText: "Planifiez Votre Voyage" // <-- UPDATED
    },
    "contactPage": {
      title: "Contacter MarraGo",
      infoTitle: "Contactez Notre Équipe",
      infoSubtitle: "Pour des itinéraires sur mesure, des circuits complets ou toute question, notre équipe est prête à construire votre voyage parfait au Maroc.", // <-- UPDATED
    },
    "experiencesPage": {
      title: "Nos Services : Itinéraires Complets, Transport & Guides", // <-- UPDATED
      subtitle: "Découvrez comment nous pouvons rendre votre voyage au Maroc fluide et authentique."
    },
    "blogPage": {
      title: "Journal de Voyage MarraGo",
      subtitle: "Astuces, perspectives et récits de nos chauffeurs et guides pour vous aider à découvrir le vrai Maroc."
    }
  },
  "ar": { // Arabic content for MarraGo
    "homepage": {
      "heroTitle": "MarraGo (مراڭو)",
      heroSubtitle: "اكتشف سحر المغرب من جنوبه لشماله. كنصاوبو ليك برنامج مفصل، كنتكلفو بالنقل، المرشدين، والفنادق باش تكون رحلة واعرة وبلا صداع.", // <-- UPDATED
      heroCtaButtonText: "بدا الرحلة ديالك", // <-- UPDATED
      featuredExperiencesTitle: "خدماتنا المتكاملة", // <-- UPDATED
      whyChooseUsTitle: "علاش تسافر مع MarraGo؟",
      whyChooseUsFeatures: [
        { title: "نقل احترافي", description: "سيارات مريحة ومكيفة مع سائقين محترفين وموثوقين في خدمتكم 24/7." }, // <-- UPDATED
        { title: "مرشدين محليين خبراء", description: "اكتشف تاريخ المغرب الغني مع مرشد سياحي محترف ومعتمد في كل مدينة كتزورها." }, // <-- UPDATED
        { title: "برامج مفصلة", description: "كنخططو لرحلتك كاملة من الجنوب للشمال مسبقًا، شاملة الفنادق، المحطات، واللوجستيك كامل." }, // <-- UPDATED
      ],
      blogHighlightsTitle: "من دفترنا المغربي",
      blogHighlightsSubtitle: "نصائح للسفر، أسرار محلية، وقصص مغامرات من عند المرشدين ديالنا.",
      socialProofTitle: "شركاؤنا وشهاداتنا",
      testimonialsTitle: "آراء المسافرين معنا",
      testimonialsSubtitle: "شنو قالو ضيوفنا على مغامرتهم المغربية معانا.",
      newsletterTitle: "توصل بنصائح السفر للمغرب",
      newsletterSubtitle: "تسجل معانا باش توصل بعروض حصرية، وإلهام السفر، وأفكار محلية."
    },
    "luxuryHomepageSlides": [
      {
        image: "/images/slides/marrago-transfer-van.webp",
        title: "تحويلات مطار موثوقة",
        subtitle: "بدا الرحلة ديالك بلا ستريس. سائقون محترفون في الموعد، كينتظروك في مطار مراكش، أگادير، وغيرها.",
        buttonText: "احجز نوبتك",
        link: "/services/transfers"
      },
      {
        image: "/images/slides/marrago-atlas-4x4.webp",
        title: "دورات (Circuits) مغربية كاملة", // <-- UPDATED
        subtitle: "خلينا نخططو لرحلتك كاملة من الجنوب للشمال، شاملة النقل، الفنادق، والمرشدين.", // <-- UPDATED
        buttonText: "خطط لرحلتك", // <-- UPDATED
        link: "/services/excursions"
      },
      {
        image: "/images/slides/marrago-guide-medina.webp",
        title: "مرشدون تاريخيون خبراء", // <-- UPDATED
        subtitle: "اكتشف التاريخ الغني ديال فاس، مراكش، وأكثر مع مرشد محترف كيعطيك كاع المعلومات اللازمة.", // <-- UPDATED
        buttonText: "تلاقى بالمرشدين", // <-- UPDATED
        link: "/services/guides"
      }
    ],
    "aboutPage": {
      title: "عن MarraGo: المخططون لرحلتك الكاملة في المغرب", // <-- UPDATED
      subtitle: "سفر بلا مشاكل، من الجنوب للشمال.", // <-- UPDATED
      paragraph1: "MarraGo تولدات من شغف باش نوريكم السحر الحقيقي ديال المغرب، من جنوبه لشماله. حنا وكالة كاملة كتآمن بأنك ما خاصكش تهز هم اللوجستيك. حنا هنا باش نكونو نقطة الاتصال الوحيدة ديالك لرحلتك كاملة.", // <-- UPDATED
      paragraph2: "العملية ديالنا ساهلة: كنخدمو معاك باش نوجدو برنامج سفر مفصل مسبقًا. كنتكلفو بجميع حجوزات الفنادق ديالك، كنوفرو نقل مريح ومكيف مع سائقين موثوقين، وكنوفرو مرشدين سياحيين محترفين في كل مدينة باش نعاونوك تستكشف تاريخ المغرب الغني. خدمتك الوحيدة هي تستمتع بالرحلة.", // <-- UPDATED (Uses his exact words)
      valuesTitle: "وعدنا لك في السفر",
      valuesSubtitle: "شنو تقدر تتوقع مع كل حجز.",
      values: [
        { title: "الراحة والأمان", description: "سيارات مريحة ومكيفة وسائقين محترفين وموثوقين." }, // <-- UPDATED
        { title: "الخبرة فالتاريخ", description: "مرشدين محليين معتمدين كيشاركو معاك تاريخ وثقافة كل مدينة." }, // <-- UPDATED
        { title: "تخطيط ساهل ماهل", description: "برنامج واحد مفصل مسبقًا. كنتكلفو باللوجستيك، الفنادق، والنقل." }, // <-- UPDATED
      ],
      teamTitle: "تعرف على المرشدين والسائقين ديالك",
      teamSubtitle: "الفريق المحلي والمحترف اللي كيخلي رحلتك دوز مزيان.",
      teamMembers: [
        { image: "/images/mock/driver-male.webp", name: "حسن", title: "سائق رئيسي ومسؤول النقل", bio: "بأكثر من 15 عامًا من الخبرة، كيضمن حسن أن كل تنقل من المطار أو بين المدن يكون آمن، مريح، وفي الوقت." },
        { image: "/images/mock/guide-female.webp", name: "فاطمة", title: "مرشدة معتمدة - مراكش", bio: "فاطمة مرشدة مرخصة كتهضر 4 لغات وكتبغي تشارك التاريخ الخفي والماكلة ديال مدينة مراكش القديمة." },
        { image: "/images/mock/ops-manager-male.webp", name: "عمر", title: "مؤسس ومخطط الرحلات", bio: "عمر كيدير جميع اللوجستيات، من برنامجك المفصل حتى لحجوزات الفنادق، وكيضمن أن كل جزء من رحلتك يكون متناسق." }, // <-- UPDATED
      ],
      ctaTitle: "واجد لمغامرتك المغربية؟",
      ctaButtonText: "خطط لرحلتك دابا" // <-- UPDATED
    },
    "contactPage": {
      title: "تواصل مع MarraGo",
      infoTitle: "تواصل مع فريقنا",
      infoSubtitle: "لبرامج خاصة، دورات كاملة، أو أي أسئلة، الفريق ديالنا واجد يبني معاك رحلتك المثالية للمغرب.", // <-- UPDATED
    },
    "experiencesPage": {
      title: "خدماتنا: برامج كاملة، نقل ومرشدين", // <-- UPDATED
      subtitle: "اكتشف جميع الطرق اللي نقدروا بيها نجعل سفرك للمغرب سلس وأصيل."
    },
    "blogPage": {
      title: "دفتر سفر MarraGo",
      subtitle: "نصائح، أفكار، وقصص من السائقين والمرشدين ديالنا باش تعيش المغرب الحقيقي."
    }
  }
};

// --- MANUAL CLIENT DATA (for Sahara Luxe Expeditions) ---
const manualClientData = {
  // --- Core Business Info ---
  "clientId": "client-marrago",
  "officialName": "MarraGo Travel SARL", // Fictional official name
  "websiteDisplayName": "MarraGo",
  "slogan": "Magic of Morocco: Full Itineraries, Transport, Guides & Hotels.", // <-- UPDATED
  "logoUrl": "/images/icons/icon-256x256.png", // (Using a placeholder path, you can change)
  "businessCategory": "TourOperator",
  "industrySpecifics": "A full-service Moroccan tour operator creating detailed travel itineraries from south to north. We specialize in comfortable, air-conditioned transportation with professional drivers, expert local guides in every city, and curated hotel reservations for a seamless and magical journey.", // <-- UPDATED (Uses his exact words)

  // --- Branding & Theme ---
  // (Keeping the colors you set)
  "primaryColor": "#D97706", 
  "secondaryColor": "#083344", 
  "templateTheme": "adventure",

  // --- Contact Information ---
  // (Keeping the contact info you set)
  "email": "marragog@gmail.com", 
  "phone": "+212669761650", 
  "latitude": 31.6258, 
  "longitude": -7.9892,
  "address": "Fictional: 123 Rue de la Liberté, Guéliz, Marrakech, Morocco", 
  "whatsappNumber": "+212669761650", 

  // --- Social Media Links ---
  "facebook": "https://www.facebook.com/MarraGo", 
  "instagram": "https://www.instagram.com/MarraGo/",
  "twitter": "", 

  // --- About Us Content (Short version for config) ---
  // (This was already very good and matches his new description)
  "aboutUsContent": {
    "title": "MarraGo is your local partner for a seamless Moroccan adventure. We handle all your logistics—from airport transfers to hotel bookings and expert local guides—so you can enjoy the magic.", 
    "imageUrl": "/images/mock/about-us-marrago.webp" // (Placeholder path)
  },

  // --- Service Description (Short version for config) ---
  "serviceDescription": "We offer detailed travel itineraries (circuits from south to north), hotel reservations, professional local guides, and comfortable, air-conditioned transportation with reliable drivers.", // <-- UPDATED

  // --- Tour Locations Served (Key cities) ---
  // (This was already perfect for "south to north")
  "tourLocationsServed": "Marrakech, Agadir, Fes, Casablanca, Rabat, Tangier, Essaouira, Merzouga",

  // --- Payment & Language Options ---
  "paymentMethodsAccepted": ["bankTransfer", "onlinePaymentGateway", "creditCard"],
  "websiteLanguageOptions": ["en", "fr", "es"],

  // --- SEO Keywords & Social Share Image ---
  "keywords": "Marrakech airport transfer, Morocco private driver, Morocco tour operator, book hotels Morocco, local guides Marrakech, MarraGo, excursions Morocco, transport touristique Maroc, Morocco circuits, detailed travel itinerary Morocco, Morocco south to north", // <-- UPDATED (Added new keywords)
  "socialShareImageUrl": "/images/mock/og-marrago.webp", // (Placeholder path)

  // --- Feature Toggles ---
  "reviewsSystem": true,
  "blogSystem": true,
  "bookingEngine": true, 
  "experiencesSection": true, 
  "faqSection": true,

  // --- Legal Content (Placeholders) ---
  "privacyPolicyContent": "MarraGo Travel SARL is committed to protecting your data... [Standard policy covering booking info, contact details, payment info, cookie usage for tours and transfers]. Contact: privacy@marraGo.com", 
  "termsOfUseContent": "Booking a service with MarraGo constitutes acceptance of these terms... [Standard terms covering transfer details, tour cancellations, booking modifications, liability for transport, payment policies].", 

  // This will pull in the detailed text you'll provide later
  "clientTextContent": clientTextContent, 
};


// --- DYNAMIC `siteConfig` VARIABLE (using manual data for development) ---
// This uses the manualClientData to generate the final siteConfig.
export const siteConfig: SiteConfig = mergeClientDataWithTheme(manualClientData);

// --- EXPORT THE GENERATED PAGE-SPECIFIC SEO METADATA STORE ---
// This line was missing or commented out!
export const pageSeoMetadataStore: MetadataStore = generatePageMetadata(siteConfig); // <-- ADD/UNCOMMENT THIS LINE