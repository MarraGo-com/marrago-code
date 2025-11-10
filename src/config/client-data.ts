// src/config/client-data.ts (Client-Specific Data & Final SiteConfig Export)

import { mergeClientDataWithTheme, SiteConfig } from './site'; // Import from the core site.ts
import { ManualClientData, SiteClientTextContent} from './types'; // Import necessary types
import { generatePageMetadata, MetadataStore } from './page-seo-metadata'; // <-- ADD THIS IMPORT

// --- Client-Specific Textual Content ---
const clientTextContent: SiteClientTextContent = {
  en: { // English content for MarraGo
    homepage: {
      heroTitle: "MarraGo",
      heroSubtitle: "Discover the magic of Morocco from south to north. We prepare your detailed itinerary in advance, handling all transport, hotels, and guides for an enjoyable journey.", // <-- UPDATED
      heroCtaButtonText: "Start Your Journey",
      featuredExperiencesTitle: "Our All-in-One Services",
      whyChooseUsTitle: "Why Travel With MarraGo?",
      whyChooseUsFeatures: [
        { title: "Professional Transport", description: "Comfortable, air-conditioned transportation with professional and reliable drivers at your service." }, // <-- UPDATED
        { title: "Expert Local Guides", description: "A professional guide in each city to help you explore the region’s rich history." }, // <-- UPDATED
        { title: "Detailed Itineraries", description: "We handle hotel reservations and plan your entire journey in advance, including all stops." }, // <-- UPDATED
      ],
      blogHighlightsTitle: "From Our Morocco Journal",
      blogHighlightsSubtitle: "Travel tips, local secrets, and adventure stories from our guides.",
      socialProofTitle: "Our Trusted Partners", // (This is the title we chose)
      testimonialsTitle: "Hear From Our Travelers",
      testimonialsSubtitle: "What our guests say about their Moroccan adventure with us.",
      newsletterTitle: "Get Your Morocco Travel Tips",
      newsletterSubtitle: "Join our newsletter for exclusive offers, travel inspiration, and local insights."
    },
   global: {
      slogan: "Magic of Morocco: Full Itineraries, Transport, Guides & Hotels.",
      industrySpecifics: "A full-service Moroccan tour operator creating detailed travel itineraries from south to north. We specialize in comfortable, air-conditioned transportation with professional drivers, expert local guides in every city, and curated hotel reservations for a seamless and magical journey.",
      serviceDescription: "We offer detailed travel itineraries (circuits from south to north), hotel reservations, professional local guides, and comfortable, air-conditioned transportation with reliable drivers.",
      keywords: "Marrakech airport transfer, Morocco private driver, Morocco tour operator, book hotels Morocco, local guides Marrakech, MarraGo, excursions Morocco, Morocco circuits, detailed travel itinerary Morocco, Morocco south to north",
      // --- UPDATED with placeholders ---
    //  privacyPolicyContent: "{officialName} is committed to protecting your data... [Standard policy covering booking info, contact details, payment info, cookie usage for tours and transfers]. Contact: {email}",
    //  termsOfUseContent: "Booking a service with {brandName} constitutes acceptance of these terms... [Standard terms covering transfer details, tour cancellations, booking modifications, liability for transport, payment policies]."
    },
   luxuryHomepageSlides: [
      {
        image: '/images/slides/marrago-transfer-van.webp',
        title: 'Professional Transport', // <-- UPDATED
        subtitle: 'Comfortable, air-conditioned transportation with professional and reliable drivers at your service.', // <-- UPDATED
        buttonText: 'Book a Transfer',
        link: '/experiences#transfers',
      },
      {
        image: '/images/slides/marrago-atlas-4x4.webp', // (This is the van in the desert/mountain)
        title: 'Detailed Travel Itineraries', // <-- UPDATED
        subtitle: 'We plan your complete journey from south to north in advance, including all stops, hotels, and guides.', // <-- UPDATED
        buttonText: 'Plan Your Itinerary',
        link: '/experiences#excursions',
      },
      {
        image: '/images/slides/marrago-guide-medina.webp',
        title: 'Expert Local Guides', // <-- KEPT
        subtitle: 'Explore Morocco\'s rich history with a professional guide in each city to provide all the necessary information.', // <-- UPDATED
        buttonText: 'Meet Our Guides',
        link: '/experiences#guides',
      },
    ],
    aboutPage: {
      title: "About MarraGo: Your Complete Moroccan Itinerary Planners",
      subtitle: "Discover the magic of Morocco, from south to north.", // <-- UPDATED
      summary: "Your local partner for seamless transport, authentic guides, and complete itineraries in Morocco.", // <-- For Footer
      imageUrl: "/images/marrago/about-us-marrago.webp", // <-- For About Page
      paragraph1: "MarraGo was born from a passion to offer travelers an enjoyable journey to discover the *real* magic of Morocco. We are a full-service agency, and we are here to be your single point of contact for your entire trip, from south to north.", // <-- UPDATED
      paragraph2: "Our process is simple: we work with you to prepare a detailed travel itinerary in advance, including all the places you will visit. We handle all your hotel reservations, provide comfortable, air-conditioned transportation, and accompany you with a professional tour guide in each city to explore the region’s rich history. Your only job is to enjoy the journey.", // <-- UPDATED (Uses his exact words)
      valuesTitle: "Our Travel Promise",
      valuesSubtitle: "What you can expect from every booking.",
      values: [
        { title: "Comfort & Safety", description: "Comfortable, air-conditioned vehicles and professional, reliable drivers." }, // (Matches new description)
        { title: "Historical Expertise", description: "Certified local guides who share the rich history and culture of each city." }, // (Matches new description)
        { title: "Seamless Planning", description: "We plan your detailed itinerary and handle all logistics, hotels, and transport." }, // (Matches new description)
      ],
      teamTitle: "Meet Your Guides & Drivers",
      teamSubtitle: "The professional, local team making your trip happen.",
      teamMembers: [
        { image: "/images/marrago/driver-male.webp", name: "Hassan", title: "Lead Driver & Transport Manager", bio: "With 15+ years of experience, Hassan ensures every airport transfer and city-to-city trip is safe, comfortable, and punctual." },
        { image: "/images/marrago/guide-female.webp", name: "Fatima", title: "Certified Guide - Marrakech", bio: "Fatima is a licensed guide who speaks 4 languages and loves sharing the hidden history and food of the Marrakech medina." },
        { image: "/images/marrago/ops-manager-male.webp", name: "Omar (Your Brother)", title: "Founder & Itinerary Planner", bio: "Omar manages all logistics, from your detailed itinerary to hotel bookings, ensuring every part of your trip connects perfectly." },
      ],
      ctaTitle: "Ready for Your Moroccan Adventure?",
      ctaButtonText: "Plan Your Trip Now",
    },
    contactPage: {
      title: "Contact MarraGo",
      infoTitle: "Get in Touch With Our Team",
      infoSubtitle: "For custom itineraries, full circuits, or any questions, our team is ready to build your perfect Moroccan trip.",
    },
    experiencesPage: { 
      title: "Our Services: Full Itineraries, Transport & Guides",
      subtitle: "Explore all the ways we can make your Moroccan travel seamless and authentic.",
    },
    blogPage: {
      title: "MarraGo Travel Journal",
      subtitle: "Tips, insights, and stories from our drivers and guides to help you discover the real Morocco.",
    },
  },
  fr: { // Contenu français pour MarraGo
  homepage: {
    heroTitle: "MarraGo",
    heroSubtitle: "Découvrez la magie du Maroc du sud au nord. Nous préparons votre itinéraire détaillé à l'avance, gérant l'ensemble du transport, des hôtels et des guides pour un voyage agréable.",
    heroCtaButtonText: "Commencez Votre Voyage",
    featuredExperiencesTitle: "Nos Services Tout Compris",
    whyChooseUsTitle: "Pourquoi Voyager Avec MarraGo ?",
    whyChooseUsFeatures: [
      { title: "Transport Professionnel", description: "Transport confortable et climatisé avec des chauffeurs professionnels et fiables à votre service." },
      { title: "Guides Locaux Experts", description: "Un guide professionnel dans chaque ville pour vous aider à explorer la riche histoire de la région." },
      { title: "Itinéraires Détaillés", description: "Nous gérons les réservations d'hôtel et planifions tout votre voyage à l'avance, y compris toutes les étapes." },
    ],
    blogHighlightsTitle: "De Notre Journal du Maroc",
    blogHighlightsSubtitle: "Conseils de voyage, secrets locaux et récits d'aventure de nos guides.",
    socialProofTitle: "Nos Partenaires de Confiance",
    testimonialsTitle: "L'avis de Nos Voyageurs",
    testimonialsSubtitle: "Ce que nos clients disent de leur aventure marocaine avec nous.",
    newsletterTitle: "Recevez Nos Conseils de Voyage au Maroc",
    newsletterSubtitle: "Inscrivez-vous à notre newsletter pour des offres exclusives, de l'inspiration de voyage et des perspectives locales."
  },
  
  global: {
  slogan: "Magie du Maroc : Itinéraires Complets, Transport, Guides & Hôtels.",
  industrySpecifics: "Un tour-opérateur marocain complet créant des itinéraires de voyage détaillés du sud au nord. Nous sommes spécialisés dans le transport confortable et climatisé avec chauffeurs professionnels, les guides locaux experts dans chaque ville, et les réservations d'hôtels organisées pour un voyage fluide et magique.",
  serviceDescription: "Nous proposons des itinéraires de voyage détaillés (circuits du sud au nord), des réservations d'hôtel, des guides locaux professionnels, et un transport confortable et climatisé avec des chauffeurs fiables.",
  keywords: "transfert aéroport Marrakech, chauffeur privé Maroc, tour opérateur Maroc, réserver hôtels Maroc, guides locaux Marrakech, MarraGo, excursions Maroc, circuits Maroc, itinéraire de voyage détaillé Maroc, Maroc du sud au nord",
 // privacyPolicyContent: "{officialName} s'engage à protéger vos données... [Politique standard couvrant les informations de réservation, les coordonnées, les informations de paiement, l'utilisation des cookies pour les circuits et les transferts]. Contact : {email}",
 // termsOfUseContent: "La réservation d'un service auprès de {brandName} vaut acceptation de ces conditions... [Conditions standard couvrant les détails des transferts, les annulations de circuits, les modifications de réservation, la responsabilité du transport, les politiques de paiement]."
},
  luxuryHomepageSlides: [
    {
      image: '/images/slides/marrago-transfer-van.webp',
      title: 'Transport Professionnel',
      subtitle: 'Transport confortable et climatisé avec des chauffeurs professionnels et fiables à votre service.',
      buttonText: 'Réserver un Transfert',
      link: '/experiences#transfers',
    },
    {
      image: '/images/slides/marrago-atlas-4x4.webp',
      title: 'Itinéraires de Voyage Détaillés',
      subtitle: 'Nous planifions votre voyage complet du sud au nord à l\'avance, incluant toutes les étapes, hôtels et guides.',
      buttonText: 'Planifiez Votre Itinéraire',
      link: '/experiences#excursions',
    },
    {
      image: '/images/slides/marrago-guide-medina.webp',
      title: 'Guides Locaux Experts',
      subtitle: "Explorez la riche histoire du Maroc avec un guide professionnel dans chaque ville pour fournir toutes les informations nécessaires.",
      buttonText: 'Rencontrez Nos Guides',
      link: '/experiences#guides',
    },
  ],
  aboutPage: {
    title: "À Propos de MarraGo : Vos Planificateurs d'Itinéraires Marocains Complets",
    subtitle: "Découvrez la magie du Maroc, du sud au nord.",
    summary: "Votre partenaire local pour un transport fluide, des guides authentiques et des itinéraires complets au Maroc.",
    imageUrl: "/images/marrago/about-us-marrago.webp",
    paragraph1: "MarraGo est née d'une passion : offrir aux voyageurs un agréable périple à la découverte de la *vraie* magie du Maroc. Nous sommes une agence de services complets, et nous sommes là pour être votre point de contact unique pour tout votre voyage, du sud au nord.",
    paragraph2: "Notre processus est simple : nous travaillons avec vous pour préparer un itinéraire de voyage détaillé à l'avance, incluant tous les lieux que vous visiterez. Nous gérons toutes vos réservations d'hôtel, fournissons un transport confortable et climatisé, et vous accompagnons avec un guide touristique professionnel dans chaque ville pour explorer la riche histoire de la région. Votre seule tâche est de profiter du voyage.",
    valuesTitle: "Notre Promesse de Voyage",
    valuesSubtitle: "Ce à quoi vous pouvez vous attendre avec chaque réservation.",
    values: [
      { title: "Confort & Sécurité", description: "Véhicules confortables, climatisés et chauffeurs professionnels et fiables." },
      { title: "Expertise Historique", description: "Guides locaux certifiés qui partagent la riche histoire et la culture de chaque ville." },
      { title: "Planification Fluide", description: "Nous planifions votre itinéraire détaillé et gérons toute la logistique, les hôtels et le transport." },
    ],
    teamTitle: "Rencontrez Vos Guides & Chauffeurs",
    teamSubtitle: "L'équipe locale et professionnelle qui concrétise votre voyage.",
    teamMembers: [
      { image: "/images/marrago/driver-male.webp", name: "Hassan", title: "Chauffeur Principal & Responsable Transport", bio: "Avec plus de 15 ans d'expérience, Hassan veille à ce que chaque transfert d'aéroport et trajet interurbain soit sûr, confortable et ponctuel." },
      { image: "/images/marrago/guide-female.webp", name: "Fatima", title: "Guide Certifiée - Marrakech", bio: "Fatima est une guide agréée qui parle 4 langues et adore partager l'histoire cachée et la gastronomie de la médina de Marrakech." },
      { image: "/images/marrago/ops-manager-male.webp", name: "Omar (Votre Frère)", title: "Fondateur & Planificateur d'Itinéraires", bio: "Omar gère toute la logistique, de votre itinéraire détaillé aux réservations d'hôtel, s'assurant que chaque partie de votre voyage se connecte parfaitement." },
    ],
    ctaTitle: "Prêt pour Votre Aventure Marocaine ?",
    ctaButtonText: "Planifiez Votre Voyage Maintenant",
  },
  contactPage: {
    title: "Contacter MarraGo",
    infoTitle: "Prenez Contact Avec Notre Équipe",
    infoSubtitle: "Pour des itinéraires personnalisés, des circuits complets ou toute question, notre équipe est prête à construire votre voyage marocain parfait.",
  },
  experiencesPage: {
    title: "Nos Services : Itinéraires Complets, Transport & Guides",
    subtitle: "Explorez toutes les façons dont nous pouvons rendre votre voyage au Maroc fluide et authentique.",
  },
  blogPage: {
    title: "Journal de Voyage MarraGo",
    subtitle: "Conseils, astuces et récits de nos chauffeurs et guides pour vous aider à découvrir le vrai Maroc.",
  },
},
  ar: { // المحتوى العربي لـ MarraGo
  homepage: {
    heroTitle: "MarraGo",
    heroSubtitle: "اكتشف سحر المغرب من جنوبه إلى شماله. نحن نُعد خط سير رحلتك المفصل مسبقًا، ونتكفل بجميع وسائل النقل والفنادق والمرشدين للاستمتاع برحلة ممتعة.",
    heroCtaButtonText: "ابدأ رحلتك",
    featuredExperiencesTitle: "خدماتنا المتكاملة",
    whyChooseUsTitle: "لماذا تسافر مع MarraGo؟",
    whyChooseUsFeatures: [
      { title: "نقل احترافي", description: "نقل مريح ومكيف مع سائقين محترفين وموثوق بهم في خدمتك." },
      { title: "مرشدون محليون خبراء", description: "مرشد محترف في كل مدينة لمساعدتك على استكشاف تاريخ المنطقة الغني." },
      { title: "برامج رحلات مفصلة", description: "نتكفل بحجوزات الفنادق ونخطط لرحلتك بأكملها مسبقًا، بما في ذلك جميع المحطات." },
    ],
    blogHighlightsTitle: "من يومياتنا في المغرب",
    blogHighlightsSubtitle: "نصائح للسفر، أسرار محلية، وقصص مغامرات من مرشدينا.",
    socialProofTitle: "شركاؤنا الموثوقون",
    testimonialsTitle: "آراء مسافرينا",
    testimonialsSubtitle: "ما يقوله ضيوفنا عن مغامرتهم المغربية معنا.",
    newsletterTitle: "احصل على نصائح السفر إلى المغرب",
    newsletterSubtitle: "انضم إلى نشرتنا البريدية للحصول على عروض حصرية، وإلهام للسفر، ورؤى محلية."
  },
 global: {
  slogan: "سحر المغرب: برامج رحلات كاملة، نقل، مرشدون، وفنادق.",
  industrySpecifics: "منظم رحلات سياحية مغربي متكامل ينشئ برامج سفر مفصلة من الجنوب إلى الشمال. نحن متخصصون في النقل المريح والمكيف مع سائقين محترفين، ومرشدين محليين خبراء في كل مدينة، وحجوزات فندقية منسقة لرحلة سلسة وساحرة.",
  serviceDescription: "نحن نقدم برامج سفر مفصلة (جولات من الجنوب إلى الشمال)، حجوزات فندقية، مرشدين محليين محترفين، ونقل مريح ومكيف مع سائقين موثوقين.",
  keywords: "توصيل مطار مراكش, سائق خاص المغرب, منظم رحلات المغرب, حجز فنادق المغرب, مرشد سياحي محلي مراكش, MarraGo, جولات سياحية المغرب, جولات المغرب, برنامج سياحي مفصل المغرب, المغرب من الجنوب إلى الشمال",
 // privacyPolicyContent: "تلتزم {officialName} بحماية بياناتك... [سياسة قياسية تغطي معلومات الحجز، تفاصيل الاتصال، معلومات الدفع، استخدام ملفات تعريف الارتباط للجولات وعمليات النقل]. للتواصل: {email}",
 // termsOfUseContent: "يُعد حجز خدمة مع {brandName} قبولاً لهذه الشروط... [شروط قياسية تغطي تفاصيل النقل، إلغاء الجولات، تعديلات الحجز، المسؤولية عن النقل، سياسات الدفع]."
},
  luxuryHomepageSlides: [
    {
      image: '/images/slides/marrago-transfer-van.webp',
      title: 'نقل احترافي',
      subtitle: 'نقل مريح ومكيف مع سائقين محترفين وموثوق بهم في خدمتك.',
      buttonText: 'احجز خدمة نقل',
      link: '/experiences#transfers',
    },
    {
      image: '/images/slides/marrago-atlas-4x4.webp',
      title: 'برامج رحلات مفصلة',
      subtitle: 'نخطط لرحلتك الكاملة من الجنوب إلى الشمال مسبقًا، بما في ذلك جميع المحطات والفنادق والمرشدين.',
      buttonText: 'خطط لرحلتك',
      link: '/experiences#excursions',
    },
    {
      image: '/images/slides/marrago-guide-medina.webp',
      title: 'مرشدون محليون خبراء',
      subtitle: 'استكشف تاريخ المغرب الغني مع مرشد محترف في كل مدينة لتقديم جميع المعلومات اللازمة.',
      buttonText: 'تعرف على مرشدينا',
      link: '/experiences#guides',
    },
  ],
  aboutPage: {
    title: "عن MarraGo: مخططو برامج رحلاتكم المتكاملة في المغرب",
    subtitle: "اكتشف سحر المغرب، من جنوبه إلى شماله.",
    summary: "شريكك المحلي للنقل السلس، والمرشدين الموثوقين، وبرامج الرحلات المتكاملة في المغرب.",
    imageUrl: "/images/marrago/about-us-marrago.webp",
    paragraph1: "وُلِدت MarraGo من شغف لتقديم رحلة ممتعة للمسافرين لاكتشاف سحر المغرب *الحقيقي*. نحن وكالة خدمات متكاملة، وموجودون لنكون نقطة اتصالك الوحيدة لرحلتك بأكملها، من الجنوب إلى الشمال.",
    paragraph2: "عمليتنا بسيطة: نعمل معكم لإعداد برنامج رحلة مفصل مسبقًا، يشمل جميع الأماكن التي ستزورونها. نتكفل بجميع حجوزات الفنادق، ونوفر نقلاً مريحًا ومكيفًا، ونرافقكم بمرشد سياحي محترف في كل مدينة لاستكشاف تاريخ المنطقة الغني. مهمتكم الوحيدة هي الاستمتاع بالرحلة.",
    valuesTitle: "وعدنا لكم",
    valuesSubtitle: "ما يمكن أن تتوقعه مع كل حجز.",
    values: [
      { title: "الراحة والأمان", description: "مركبات مريحة ومكيفة وسائقون محترفون وموثوق بهم." },
      { title: "خبرة تاريخية", description: "مرشدون محليون معتمدون يشاركونكم التاريخ الغني وثقافة كل مدينة." },
      { title: "تخطيط سلس", description: "نخطط لبرنامج رحلتك المفصل ونتولى جميع الخدمات اللوجستية والفنادق والنقل." },
    ],
    teamTitle: "تعرف على مرشدينا وسائقينا",
    teamSubtitle: "الفريق المحلي المحترف الذي يجعل رحلتك ممكنة.",
    teamMembers: [
      { image: "/images/marrago/driver-male.webp", name: "حسن", title: "سائق رئيسي ومدير النقل", bio: "بأكثر من 15 عامًا من الخبرة، يضمن حسن أن كل عملية نقل من المطار ورحلة بين المدن آمنة ومريحة ودقيقة في مواعيدها." },
      { image: "/images/marrago/guide-female.webp", name: "فاطمة", title: "مرشدة معتمدة - مراكش", bio: "فاطمة مرشدة مرخصة تتحدث 4 لغات وتحب مشاركة التاريخ الخفي والطعام في مدينة مراكش القديمة." },
      { image: "/images/marrago/ops-manager-male.webp", name: "عمر (أخوك)", title: "المؤسس ومخطط الرحلات", bio: "يدير عمر جميع الخدمات اللوجستية، بدءًا من برنامج رحلتك المفصل وحتى حجوزات الفنادق، مما يضمن ترابط كل جزء من رحلتك بشكل مثالي." },
    ],
    ctaTitle: "هل أنت مستعد لمغامرتك المغربية؟",
    ctaButtonText: "خطط لرحلتك الآن",
  },
  contactPage: {
    title: "اتصل بـ MarraGo",
    infoTitle: "تواصل مع فريقنا",
    infoSubtitle: "للحصول على برامج رحلات مخصصة، أو جولات كاملة، أو لأي أسئلة، فريقنا مستعد لبناء رحلتك المغربية المثالية.",
  },
  experiencesPage: {
    title: "خدماتنا: برامج رحلات كاملة، نقل، ومرشدون",
    subtitle: "استكشف كل الطرق التي يمكننا من خلالها جعل سفرك إلى المغرب سلسًا وأصيلاً.",
  },
  blogPage: {
    title: "يوميات السفر من MarraGo",
    subtitle: "نصائح ورؤى وقصص من سائقينا ومرشدينا لمساعدتك على اكتشاف المغرب الحقيقي.",
  },
},
 es: { // Contenido en español para MarraGo
  homepage: {
    heroTitle: "MarraGo",
    heroSubtitle: "Descubre la magia de Marruecos de sur a norte. Preparamos tu itinerario detallado con antelación, gestionando todo el transporte, hoteles y guías para un viaje placentero.",
    heroCtaButtonText: "Comienza Tu Viaje",
    featuredExperiencesTitle: "Nuestros Servicios Todo Incluido",
    whyChooseUsTitle: "¿Por Qué Viajar Con MarraGo?",
    whyChooseUsFeatures: [
      { title: "Transporte Profesional", description: "Transporte cómodo, con aire acondicionado y conductores profesionales y fiables a tu servicio." },
      { title: "Guías Locales Expertos", description: "Un guía profesional en cada ciudad para ayudarte a explorar la rica historia de la región." },
      { title: "Itinerarios Detallados", description: "Gestionamos las reservas de hotel y planificamos todo tu viaje con antelación, incluidas todas las paradas." },
    ],
    blogHighlightsTitle: "De Nuestro Diario de Marruecos",
    blogHighlightsSubtitle: "Consejos de viaje, secretos locales e historias de aventuras de nuestros guías.",
    socialProofTitle: "Nuestros Socios de Confianza",
    testimonialsTitle: "Escucha a Nuestros Viajeros",
    testimonialsSubtitle: "Lo que nuestros huéspedes dicen sobre su aventura marroquí con nosotros.",
    newsletterTitle: "Obtén Tus Consejos de Viaje para Marruecos",
    newsletterSubtitle: "Únete a nuestro boletín para ofertas exclusivas, inspiración de viaje y perspectivas locales."
  },
  global: {
  slogan: "Magia de Marruecos: Itinerarios Completos, Transporte, Guías y Hoteles.",
  industrySpecifics: "Un touroperador marroquí de servicio completo que crea itinerarios de viaje detallados de sur a norte. Nos especializamos en transporte cómodo y con aire acondicionado con conductores profesionales, guías locales expertos en cada ciudad y reservas de hoteles seleccionadas para un viaje fluido y mágico.",
  serviceDescription: "Ofrecemos itinerarios de viaje detallados (circuitos de sur a norte), reservas de hotel, guías locales profesionales y transporte cómodo con aire acondicionado y conductores fiables.",
  keywords: "traslado aeropuerto Marrakech, conductor privado Marruecos, tour operador Marruecos, reservar hoteles Marruecos, guías locales Marrakech, MarraGo, excursiones Marruecos, circuitos Marruecos, itinerario de viaje detallado Marruecos, Marruecos de sur a norte",
 // privacyPolicyContent: "{officialName} se compromete a proteger sus datos... [Política estándar que cubre la información de reserva, detalles de contacto, información de pago, uso de cookies para tours y traslados]. Contacto: {email}",
 // termsOfUseContent: "Reservar un servicio con {brandName} constituye la aceptación de estos términos... [Términos estándar que cubren detalles de traslados, cancelaciones de tours, modificaciones de reservas, responsabilidad del transporte, políticas de pago]."
},
  luxuryHomepageSlides: [
    {
      image: '/images/slides/marrago-transfer-van.webp',
      title: 'Transporte Profesional',
      subtitle: 'Transporte cómodo, con aire acondicionado y conductores profesionales y fiables a tu servicio.',
      buttonText: 'Reservar un Traslado',
      link: '/experiences#transfers',
    },
    {
      image: '/images/slides/marrago-atlas-4x4.webp',
      title: 'Itinerarios de Viaje Detallados',
      subtitle: 'Planificamos tu viaje completo de sur a norte con antelación, incluyendo todas las paradas, hoteles y guías.',
      buttonText: 'Planifica Tu Itinerario',
      link: '/experiences#excursions',
    },
    {
      image: '/images/slides/marrago-guide-medina.webp',
      title: 'Guías Locales Expertos',
      subtitle: 'Explora la rica historia de Marruecos con un guía profesional en cada ciudad para proporcionar toda la información necesaria.',
      buttonText: 'Conoce a Nuestros Guías',
      link: '/experiences#guides',
    },
  ],
  aboutPage: {
    title: "Sobre MarraGo: Tus Planificadores de Itinerarios Marroquíes Completos",
    subtitle: "Descubre la magia de Marruecos, de sur a norte.",
    summary: "Su socio local para transporte fluido, guías auténticos e itinerarios completos en Marruecos.",
    imageUrl: "/images/marrago/about-us-marrago.webp",
    paragraph1: "MarraGo nació de la pasión por ofrecer a los viajeros un viaje placentero para descubrir la *verdadera* magia de Marruecos. Somos una agencia de servicios completos y estamos aquí para ser tu único punto de contacto para todo tu viaje, de sur a norte.",
    paragraph2: "Nuestro proceso es simple: trabajamos contigo para preparar un itinerario de viaje detallado con antelación, incluyendo todos los lugares que visitarás. Gestionamos todas tus reservas de hotel, proporcionamos transporte cómodo con aire acondicionado y te acompañamos con un guía turístico profesional en cada ciudad para explorar la rica historia de la región. Tu único trabajo es disfrutar del viaje.",
    valuesTitle: "Nuestra Promesa de Viaje",
    valuesSubtitle: "Lo que puedes esperar de cada reserva.",
    values: [
      { title: "Comodidad y Seguridad", description: "Vehículos cómodos, con aire acondicionado y conductores profesionales y fiables." },
      { title: "Experiencia Histórica", description: "Guías locales certificados que comparten la rica historia y cultura de cada ciudad." },
      { title: "Planificación Fluida", description: "Planificamos tu itinerario detallado y gestionamos toda la logística, hoteles y transporte." },
    ],
    teamTitle: "Conoce a Tus Guías y Conductores",
    teamSubtitle: "El equipo local y profesional que hace posible tu viaje.",
    teamMembers: [
      { image: "/images/marrago/driver-male.webp", name: "Hassan", title: "Conductor Principal y Gerente de Transporte", bio: "Con más de 15 años de experiencia, Hassan asegura que cada traslado al aeropuerto y viaje entre ciudades sea seguro, cómodo y puntual." },
      { image: "/images/marrago/guide-female.webp", name: "Fatima", title: "Guía Certificada - Marrakech", bio: "Fatima es una guía licenciada que habla 4 idiomas y le encanta compartir la historia oculta y la gastronomía de la medina de Marrakech." },
      { image: "/images/marrago/ops-manager-male.webp", name: "Omar (Tu Hermano)", title: "Fundador y Planificador de Itinerarios", bio: "Omar gestiona toda la logística, desde tu itinerario detallado hasta las reservas de hotel, asegurando que cada parte de tu viaje se conecte perfectamente." },
    ],
    ctaTitle: "¿Listo para Tu Aventura Marroquí?",
    ctaButtonText: "Planifica Tu Viaje Ahora",
  },
  contactPage: {
    title: "Contactar con MarraGo",
    infoTitle: "Ponte en Contacto Con Nuestro Equipo",
    infoSubtitle: "Para itinerarios personalizados, circuitos completos o cualquier pregunta, nuestro equipo está listo para construir tu viaje marroquí perfecto.",
  },
  experiencesPage: {
    title: "Nuestros Servicios: Itinerarios Completos, Transporte y Guías",
    subtitle: "Explora todas las formas en que podemos hacer que tu viaje a Marruecos sea fluido y auténtico.",
  },
  blogPage: {
    title: "Diario de Viaje MarraGo",
    subtitle: "Consejos, percepciones e historias de nuestros conductores y guías para ayudarte a descubrir el verdadero Marruecos.",
  },
}
};

// --- MANUAL CLIENT DATA (for Sahara Luxe Expeditions) ---
const manualClientData : ManualClientData = {
  // --- Core Business Info ---
  "clientId": "client-marrago",
  "officialName": "MarraGo Travel SARL", // Fictional official name
  "websiteDisplayName": "MarraGo",
  "ownerName": "Omar Ouazza", // Fictional owner name
 // "slogan": "Magic of Morocco: Full Itineraries, Transport, Guides & Hotels.", // <-- UPDATED
  "logoUrl": "/images/icons/icon-256x256.png", // (Using a placeholder path, you can change)
  "businessCategory": "TourOperator",
 // "industrySpecifics": "A full-service Moroccan tour operator creating detailed travel itineraries from south to north. We specialize in comfortable, air-conditioned transportation with professional drivers, expert local guides in every city, and curated hotel reservations for a seamless and magical journey.", // <-- UPDATED (Uses his exact words)

  // --- Branding & Theme ---
  // (Keeping the colors you set)
  "primaryColor": "#D97706", 
  "secondaryColor": "#083344", 
  "templateTheme": "adventure",

  // --- Contact Information ---
  // (Keeping the contact info you set)
  "email": "marragog@gmail.com", 
  "phone": "+212669761650", 
  "latitude": 31.60086, 
  "longitude": -8.0265,
  "address": "Sixt Aéroport Marrakech-Ménara, Marrakech, Morocco", 
  "whatsappNumber": "+212669761650", 

  // --- Social Media Links ---
  "facebook": "https://www.facebook.com/MarraGo", 
  "instagram": "https://www.instagram.com/marragotravel",
  "tiktok": "https://www.tiktok.com/@marragogo",
  "twitter": "https://twitter.com/MarraGo", 
  // ℹ️ You must find these numerical IDs using a tool like tweeterid.com
  "twitterHandle": "@MarraGo", // <-- ADD THIS
  "twitterSiteId": "123456789", // <-- ADD A PLACEHOLDER ID
  "twitterCreatorId": "123456789", // <-- ADD A PLACEHOLDER ID

  // --- About Us Content (Short version for config) ---
  // (This was already very good and matches his new description)
 /*  "aboutUsContent": {
    "title": "MarraGo is your local partner for a seamless Moroccan adventure. We handle all your logistics—from airport transfers to hotel bookings and expert local guides—so you can enjoy the magic.", 
    "imageUrl": "/images/mock/about-us-marrago.webp" 
  }, */

  // --- Service Description (Short version for config) ---
//  "serviceDescription": "We offer detailed travel itineraries (circuits from south to north), hotel reservations, professional local guides, and comfortable, air-conditioned transportation with reliable drivers.", // <-- UPDATED

  // --- Tour Locations Served (Key cities) ---
  // (This was already perfect for "south to north")
  "tourLocationsServed": "Marrakech, Agadir, Fes, Casablanca, Rabat, Tangier, Essaouira, Merzouga",

  // --- Payment & Language Options ---
  "paymentMethodsAccepted": ["bankTransfer", "onlinePaymentGateway", "creditCard"],
  "websiteLanguageOptions": ["en", "fr", "es"],

  // --- SEO Keywords & Social Share Image ---
  // "keywords": "Marrakech airport transfer, Morocco private driver, Morocco tour operator, book hotels Morocco, local guides Marrakech, MarraGo, excursions Morocco, transport touristique Maroc, Morocco circuits, detailed travel itinerary Morocco, Morocco south to north", // <-- UPDATED (Added new keywords)
  "socialShareImageUrl": "/images/og/og-marrago.webp", // (Placeholder path)

  // --- Feature Toggles ---
  "reviewsSystem": true,
  "blogSystem": true,
  "bookingEngine": true, 
  "experiencesSection": true, 
  "faqSection": true,

  // --- Legal Content (Placeholders) ---
 // "privacyPolicyContent": "MarraGo Travel SARL is committed to protecting your data... [Standard policy covering booking info, contact details, payment info, cookie usage for tours and transfers]. Contact: privacy@marraGo.com", 
 // "termsOfUseContent": "Booking a service with MarraGo constitutes acceptance of these terms... [Standard terms covering transfer details, tour cancellations, booking modifications, liability for transport, payment policies].", 

  // This will pull in the detailed text you'll provide later
  "clientTextContent": clientTextContent, 
};


// --- DYNAMIC `siteConfig` VARIABLE (using manual data for development) ---
// This uses the manualClientData to generate the final siteConfig.
export const siteConfig: SiteConfig = mergeClientDataWithTheme(manualClientData);

// --- EXPORT THE GENERATED PAGE-SPECIFIC SEO METADATA STORE ---
// This line was missing or commented out!
export const pageSeoMetadataStore: MetadataStore = generatePageMetadata(siteConfig); // <-- ADD/UNCOMMENT THIS LINE