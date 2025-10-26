// src/config/client-data.ts (Client-Specific Data & Final SiteConfig Export)

import { mergeClientDataWithTheme, SiteConfig } from './site'; // Import from the core site.ts
import { SiteClientTextContent} from './types'; // Import necessary types
import { generatePageMetadata, MetadataStore } from './page-seo-metadata'; // <-- ADD THIS IMPORT

// --- Client-Specific Textual Content ---
const clientTextContent: SiteClientTextContent = {
  en: { // English client-specific content for Les Palais Chérifiens
    homepage: {
      heroTitle: "Les Palais Chérifiens", // Keep the elegant name
      heroSubtitle: "An intimate collection of restored riads and palaces in Morocco's historic hearts. Discover timeless elegance and bespoke hospitality.",
      heroCtaButtonText: "Explore Our Palaces",
      featuredExperiencesTitle: "Signature Suites & Experiences", // Changed from "Journeys"
      whyChooseUsTitle: "The Art of Moroccan Luxury",
      whyChooseUsFeatures: [
        { title: "Architectural Masterpieces", description: "Stay within authentically restored palaces showcasing exquisite Moroccan craftsmanship." },
        { title: "Intimate & Serene Settings", description: "Find tranquility in lush courtyards and private terraces, away from the bustle." },
        { title: "Personalized Concierge Service", description: "Allow us to curate bespoke cultural experiences and dining reservations just for you." },
      ],
      blogHighlightsTitle: "From Our Heritage Journal",
      blogHighlightsSubtitle: "Stories of Moroccan art, culture, and timeless elegance.",
      socialProofTitle: "Preferred by Connoisseurs of Luxury",
      testimonialsTitle: "Voices from Our Palaces",
      testimonialsSubtitle: "Reflections from guests who experienced our unique hospitality.",
      newsletterTitle: "An Invitation to Elegance",
      newsletterSubtitle: "Receive exclusive updates and insights into Moroccan luxury.",
    },
    luxuryHomepageSlides: [ // Tailored slides for the luxury theme and hotel concept
      {
        image: '/images/mock/palais-cherifiens-marrakech-courtyard.webp', // Suggestion: Stunning courtyard of Marrakech property
        title: 'Marrakech: Medina Majesty',
        subtitle: 'Discover serene luxury within the vibrant heart of the Red City. Your private oasis awaits.',
        buttonText: 'Explore Marrakech Palace',
        link: '/locations/marrakech', // Example link structure
      },
      {
        image: '/images/mock/palais-cherifiens-fes-suite.webp', // Suggestion: Exquisite suite interior in Fes property
        title: 'Fes: Artisanal Elegance',
        subtitle: 'Immerse yourself in history and craftsmanship within our meticulously restored palace in the ancient city of Fes.',
        buttonText: 'Discover Fes Palace',
        link: '/locations/fes', // Example link structure
      },
      {
        image: '/images/mock/palais-cherifiens-rooftop-dining.webp', // Suggestion: Elegant rooftop dining with city view
        title: 'Dining Under the Stars',
        subtitle: 'Experience refined Moroccan gastronomy on our private rooftop terraces, overlooking the historic cityscape.',
        buttonText: 'View Dining Experiences',
        link: '/dining', // Example link structure
      },
    ],
    aboutPage: {
      title: "Our Heritage: The Soul of Les Palais Chérifiens",
      subtitle: "Preserving Moroccan elegance, offering unparalleled hospitality.",
      paragraph1: "Les Palais Chérifiens represents more than just luxury accommodation; it's a curated collection of historically significant riads and palaces, each meticulously restored to honor its past while offering contemporary comfort. Our properties, located in the heart of Morocco's most captivating cities, serve as intimate gateways to the rich tapestry of Moroccan culture, art, and history.",
      paragraph2: "Founded on the principles of preserving heritage and providing deeply personalized service, our mission is to offer discerning travelers an authentic and serene sanctuary. From the intricate Zellij tilework to the tranquil courtyards and bespoke concierge services, every detail is designed to create an atmosphere of timeless elegance and unforgettable Moroccan experiences.",
      valuesTitle: "Our Pillars of Hospitality",
      valuesSubtitle: "Guiding the experience within our walls.",
      values: [
        { title: "Heritage Preservation", description: "Celebrating and maintaining authentic Moroccan architecture and craftsmanship." },
        { title: "Personalized Service", description: "Anticipating needs and tailoring experiences with discreet, attentive care." },
        { title: "Serenity & Privacy", description: "Creating tranquil havens for relaxation and reflection within vibrant cities." },
      ],
      teamTitle: "Meet Our Curators of Experience",
      teamSubtitle: "Passionate individuals dedicated to your comfort and discovery.",
      teamMembers: [
         // --- SUGGESTED MOCK TEAM MEMBERS ---
        { image: "/images/mock/hotel-manager-female.webp", name: "Leila Alami", title: "General Manager - Marrakech", bio: "With years of experience in luxury hospitality, Leila oversees our Marrakech palace, ensuring every guest experience is flawless and memorable." },
        { image: "/images/mock/hotel-concierge-male.webp", name: "Youssef Karim", title: "Head Concierge - Fes", bio: "Youssef possesses an unparalleled knowledge of Fes. He delights in crafting bespoke itineraries and revealing the city's hidden gems to our guests." },
        { image: "/images/mock/hotel-chef-male.webp", name: "Chef Rashid Boujida", title: "Executive Chef", bio: "Chef Rashid masterfully blends traditional Moroccan flavors with modern culinary techniques, creating exquisite dining experiences across our properties." },
      ],
      ctaTitle: "Experience Timeless Moroccan Elegance?",
      ctaButtonText: "Inquire About Your Stay",
    },
    contactPage: {
      title: "Contact Les Palais Chérifiens",
      infoTitle: "Connect With Our Reservations Team",
      infoSubtitle: "For inquiries about availability, bespoke stays, or specific property details, please reach out. We look forward to welcoming you.",
    },
    experiencesPage: { // Renamed from Tours to Suites/Experiences for a hotel
      title: "Our Suites & Signature Experiences",
      subtitle: "Discover uniquely designed accommodations and curated activities within our palaces.",
    },
    blogPage: {
      title: "Les Palais Chérifiens Journal",
      subtitle: "Insights into Moroccan art, culture, design, and the heritage preserved within our walls.",
    },
  },
 "fr": {
    "homepage": {
      "heroTitle": "Les Palais Chérifiens",
      "heroSubtitle": "Une collection intime de riads et palais restaurés au cœur des villes historiques du Maroc. Découvrez une élégance intemporelle et une hospitalité sur mesure.",
      "heroCtaButtonText": "Explorez Nos Palais",
      "featuredExperiencesTitle": "Suites & Expériences Signature",
      "whyChooseUsTitle": "L'Art du Luxe Marocain",
      "whyChooseUsFeatures": [
        {
          "title": "Chefs-d'œuvre Architecturaux",
          "description": "Séjournez dans des palais authentiquement restaurés, véritables vitrines de l'artisanat marocain raffiné."
        },
        {
          "title": "Cadres Intimes & Sereins",
          "description": "Trouvez la tranquillité dans des patios luxuriants et des terrasses privées, loin de l'agitation."
        },
        {
          "title": "Service de Conciergerie Personnalisé",
          "description": "Laissez-nous orchestrer des expériences culturelles et des réservations de restaurants sur mesure, juste pour vous."
        }
      ],
      "blogHighlightsTitle": "Extrait de Notre Journal du Patrimoine",
      "blogHighlightsSubtitle": "Récits sur l'art, la culture et l'élégance intemporelle du Maroc.",
      "socialProofTitle": "Préféré des Connaisseurs du Luxe",
      "testimonialsTitle": "Voix de Nos Palais",
      "testimonialsSubtitle": "Témoignages de clients ayant vécu notre hospitalité unique.",
      "newsletterTitle": "Une Invitation à l'Élégance",
      "newsletterSubtitle": "Recevez des actualités exclusives et des perspectives sur le luxe marocain."
    },
    "luxuryHomepageSlides": [
      {
        "image": "/images/mock/palais-cherifiens-marrakech-courtyard.webp",
        "title": "Marrakech : Majesté de la Médina",
        "subtitle": "Découvrez un luxe serein au cœur vibrant de la Ville Rouge. Votre oasis privée vous attend.",
        "buttonText": "Explorer le Palais de Marrakech",
        "link": "/locations/marrakech"
      },
      {
        "image": "/images/mock/palais-cherifiens-fes-suite.webp",
        "title": "Fès : Élégance Artisanale",
        "subtitle": "Plongez dans l'histoire et l'artisanat au sein de notre palais méticuleusement restauré dans l'ancienne ville de Fès.",
        "buttonText": "Découvrir le Palais de Fès",
        "link": "/locations/fes"
      },
      {
        "image": "/images/mock/palais-cherifiens-rooftop-dining.webp",
        "title": "Dîner Sous les Étoiles",
        "subtitle": "Découvrez une gastronomie marocaine raffinée sur nos terrasses privées, surplombant le paysage urbain historique.",
        "buttonText": "Voir les Expériences Culinaires",
        "link": "/dining"
      }
    ],
    "aboutPage": {
      "title": "Notre Héritage : L'Âme des Palais Chérifiens",
      "subtitle": "Préserver l'élégance marocaine, offrir une hospitalité inégalée.",
      "paragraph1": "Les Palais Chérifiens représentent plus qu'un simple hébergement de luxe ; c'est une collection de riads et de palais d'importance historique, chacun méticuleusement restauré pour honorer son passé tout en offrant un confort contemporain. Nos propriétés, situées au cœur des villes les plus captivantes du Maroc, servent de portails intimes vers la riche tapisserie de la culture, de l'art et de l'histoire du Maroc.",
      "paragraph2": "Fondée sur les principes de préservation du patrimoine et d'un service profondément personnalisé, notre mission est d'offrir aux voyageurs exigeants un sanctuaire authentique et serein. Du Zellige complexe aux cours tranquilles et aux services de conciergerie sur mesure, chaque détail est conçu pour créer une atmosphère d'élégance intemporelle et d'expériences marocaines inoubliables.",
      "valuesTitle": "Nos Piliers de l'Hospitalité",
      "valuesSubtitle": "Guidant l'expérience entre nos murs.",
      "values": [
        {
          "title": "Préservation du Patrimoine",
          "description": "Célébrer et entretenir l'architecture et l'artisanat marocains authentiques."
        },
        {
          "title": "Service Personnalisé",
          "description": "Anticiper les besoins et personnaliser les expériences avec un soin discret et attentif."
        },
        {
          "title": "Sérénité & Intimité",
          "description": "Créer des havres de paix pour la détente et la réflexion au sein de villes dynamiques."
        }
      ],
      "teamTitle": "Rencontrez Nos Créateurs d'Expériences",
      "teamSubtitle": "Des individus passionnés dévoués à votre confort et à votre découverte.",
      "teamMembers": [
        {
          "image": "/images/mock/hotel-manager-female.webp",
          "name": "Leila Alami",
          "title": "Directrice Générale - Marrakech",
          "bio": "Forte de plusieurs années d'expérience dans l'hôtellerie de luxe, Leila supervise notre palais de Marrakech, veillant à ce que chaque expérience client soit impeccable et mémorable."
        },
        {
          "image": "/images/mock/hotel-concierge-male.webp",
          "name": "Youssef Karim",
          "title": "Chef Concierge - Fès",
          "bio": "Youssef possède une connaissance inégalée de Fès. Il prend plaisir à créer des itinéraires sur mesure et à révéler les joyaux cachés de la ville à nos clients."
        },
        {
          "image": "/images/mock/hotel-chef-male.webp",
          "name": "Chef Rashid Boujida",
          "title": "Chef Exécutif",
          "bio": "Le Chef Rashid marie avec brio les saveurs traditionnelles marocaines aux techniques culinaires modernes, créant des expériences gastronomiques exquises dans nos propriétés."
        }
      ],
      "ctaTitle": "Vivre l'Élégance Marocaine Intemporelle ?",
      "ctaButtonText": "Renseignez-vous sur Votre Séjour"
    },
    "contactPage": {
      "title": "Contacter Les Palais Chérifiens",
      "infoTitle": "Contactez Notre Équipe de Réservation",
      "infoSubtitle": "Pour toute demande de disponibilité, de séjours sur mesure ou de détails spécifiques sur une propriété, n'hésitez pas à nous contacter. Au plaisir de vous accueillir."
    },
    "experiencesPage": {
      "title": "Nos Suites & Expériences Signature",
      "subtitle": "Découvrez des hébergements au design unique et des activités organisées au sein de nos palais."
    },
    "blogPage": {
      "title": "Journal des Palais Chérifiens",
      "subtitle": "Perspectives sur l'art, la culture, le design marocains et le patrimoine préservé entre nos murs."
    }
  },
 "ar": {
    "homepage": {
      "heroTitle": "Les Palais Chérifiens",
      "heroSubtitle": "مجموعة حصرية من الرياضات والقصور المرممة في قلب المدن التاريخية للمغرب. اكتشفوا أناقة خالدة وضيافة مصممة خصيصًا لكم.",
      "heroCtaButtonText": "اكتشفوا قصورنا",
      "featuredExperiencesTitle": "الأجنحة والتجارب المميزة",
      "whyChooseUsTitle": "فن الفخامة المغربية",
      "whyChooseUsFeatures": [
        {
          "title": "روائع معمارية",
          "description": "أقيموا في قصور مرممة بشكل أصيل، تعكس براعة الصناعة التقليدية المغربية الراقية."
        },
        {
          "title": "أجواء حميمية وهادئة",
          "description": "تلقاو الهدوء فالرياضات الخضراء والتراسات الخاصة، بعيدًا عن ضجيج المدينة."
        },
        {
          "title": "خدمة كونسيرج شخصية",
          "description": "خليونا ننظم ليكم تجارب ثقافية وحجوزات عشاء مصممة خصيصًا ليكم."
        }
      ],
      "blogHighlightsTitle": "من دفتر تراثنا",
      "blogHighlightsSubtitle": "حكايات عن الفن، الثقافة، والأناقة المغربية الخالدة.",
      "socialProofTitle": "الاختيار المفضل لخبراء الفخامة",
      "testimonialsTitle": "أصداء من قصورنا",
      "testimonialsSubtitle": "انطباعات الضيوف اللي جربو ضيافتنا الفريدة.",
      "newsletterTitle": "دعوة للأناقة",
      "newsletterSubtitle": "توصلوا بآخر المستجدات الحصرية وأفكار عن الفخامة المغربية."
    },
    "luxuryHomepageSlides": [
      {
        "image": "/images/mock/palais-cherifiens-marrakech-courtyard.webp",
        "title": "مراكش: فخامة المدينة القديمة",
        "subtitle": "اكتشفوا الفخامة الهادئة في قلب المدينة الحمراء النابض بالحياة. واحتكم الخاصة كتسناكم.",
        "buttonText": "اكتشفوا قصر مراكش",
        "link": "/locations/marrakech"
      },
      {
        "image": "/images/mock/palais-cherifiens-fes-suite.webp",
        "title": "فاس: الأناقة الحرفية",
        "subtitle": "غوصوا في التاريخ والصناعة التقليدية داخل قصرنا المرمم بعناية في مدينة فاس العتيقة.",
        "buttonText": "اكتشفوا قصر فاس",
        "link": "/locations/fes"
      },
      {
        "image": "/images/mock/palais-cherifiens-rooftop-dining.webp",
        "title": "عشاء تحت النجوم",
        "subtitle": "جربوا فن الطبخ المغربي الراقي على تراساتنا الخاصة، المطلة على منظر المدينة التاريخي.",
        "buttonText": "شوفو تجارب العشاء",
        "link": "/dining"
      }
    ],
    "aboutPage": {
      "title": "تراثنا: روح 'Les Palais Chérifiens'",
      "subtitle": "الحفاظ على الأناقة المغربية، وتقديم ضيافة لا مثيل لها.",
      "paragraph1": "تمثل 'Les Palais Chérifiens' أكثر من مجرد إقامة فاخرة؛ إنها مجموعة منتقاة من الرياضات والقصور ذات الأهمية التاريخية، كل واحد منها تم ترميمه بدقة ليحترم ماضيه ويقدم الراحة العصرية. ممتلكاتنا، الموجودة في قلب أكثر المدن المغربية سحرًا، هي بوابات حميمية للنسيج الغني للثقافة والفن والتاريخ المغربي.",
      "paragraph2": "تأسست على مبادئ الحفاظ على التراث وتقديم خدمة شخصية عميقة، مهمتنا هي أن نقدم للمسافرين المميزين ملاذًا أصيلًا وهادئًا. من الزليج المعقد إلى الأفنية الهادئة وخدمات الكونسيرج المصممة خصيصًا، كل تفصيل مصمم لخلق جو من الأناقة الخالدة والتجارب المغربية التي لا تُنسى.",
      "valuesTitle": "أعمدة ضيافتنا",
      "valuesSubtitle": "توجيه التجربة داخل أسوارنا.",
      "values": [
        {
          "title": "الحفاظ على التراث",
          "description": "الاحتفاء بالهندسة المعمارية والصناعة التقليدية المغربية الأصيلة والحفاظ عليها."
        },
        {
          "title": "خدمة شخصية",
          "description": "استباق الاحتياجات وتصميم التجارب بعناية فائقة وسرية."
        },
        {
          "title": "الهدوء والخصوصية",
          "description": "خلق ملاذات هادئة للاسترخاء والتأمل داخل المدن النابضة بالحياة."
        }
      ],
      "teamTitle": "تعرفوا على صانعي التجارب لدينا",
      "teamSubtitle": "أشخاص شغوفون مكرسون لراحتكم ولاكتشافكم.",
      "teamMembers": [
        {
          "image": "/images/mock/hotel-manager-female.webp",
          "name": "ليلى العلمي",
          "title": "المديرة العامة - مراكش",
          "bio": "بسنوات من الخبرة في الضيافة الفاخرة، ليلى تشرف على قصرنا في مراكش، وتضمن أن تكون كل تجربة ضيف مثالية ولا تُنسى."
        },
        {
          "image": "/images/mock/hotel-concierge-male.webp",
          "name": "يوسف كريم",
          "title": "رئيس الكونسيرج - فاس",
          "bio": "يوسف عندو معرفة لا مثيل لها بمدينة فاس. كيستمتع بابتكار برامج مصممة خصيصًا وكشف الجواهر الخفية للمدينة لضيوفنا."
        },
        {
          "image": "/images/mock/hotel-chef-male.webp",
          "name": "الشيف رشيد بوجيدة",
          "title": "الشيف التنفيذي",
          "bio": "الشيف رشيد كيمزج ببراعة بين النكهات المغربية التقليدية وتقنيات الطهي الحديثة، خالقًا تجارب طعام راقية في جميع ممتلكاتنا."
        }
      ],
      "ctaTitle": "هل تودون تجربة الأناقة المغربية الخالدة؟",
      "ctaButtonText": "استفسروا عن إقامتكم"
    },
    "contactPage": {
      "title": "الاتصال بـ 'Les Palais Chérifiens'",
      "infoTitle": "تواصلوا مع فريق الحجوزات لدينا",
      "infoSubtitle": "للاستفسار عن التوافر، الإقامات المصممة خصيصًا، أو تفاصيل محددة عن ممتلكاتنا، يرجى التواصل معنا. نتطلع للترحيب بكم."
    },
    "experiencesPage": {
      "title": "أجنحتنا وتجاربنا المميزة",
      "subtitle": "اكتشفوا أماكن إقامة مصممة بشكل فريد وأنشطة منسقة داخل قصورنا."
    },
    "blogPage": {
      "title": "يوميات 'Les Palais Chérifiens'",
      "subtitle": "أفكار حول الفن، الثقافة، التصميم المغربي، والتراث المحفوظ داخل أسوارنا."
    }
  },
};

// --- MANUAL CLIENT DATA (for Sahara Luxe Expeditions) ---
const manualClientData = {
  "clientId": "client-palais-cherifiens", // Unique ID

  // --- Core Business Info ---
  "officialName": "Les Palais Chérifiens SARL", // Fictional official name
  "websiteDisplayName": "Les Palais Chérifiens",
  "slogan": "Authentic Luxury Moroccan Hospitality.",
  "logoUrl": "/favicon.ico", // <-- SUGGESTION: Path to an elegant, perhaps calligraphic logo
  "businessCategory": "Hotel", // CHANGED from TourOperator
  "industrySpecifics": "A collection of luxury boutique hotels/riads in key Moroccan cities (Marrakech, Fes), specializing in authentic heritage, intimate settings, and personalized concierge services for discerning international travelers.",

  // --- Branding & Theme ---
  "primaryColor": "#8B4513", // Suggestion: A rich SaddleBrown, evoking wood and leather
  "secondaryColor": "#D4AF37", // Suggestion: A soft Gold, for luxury accents
  "templateTheme": "default", // <-- Set to 'luxury'

  // --- Contact Information (More generic for a collection) ---
  "email": "reservations@palaischerifiens.ma", // Fictional central reservations email
  "phone": "05XX-XXXXXX", // Fictional central phone number (e.g., Casablanca area code)
  "latitude": 33.5731, // Casablanca latitude (example central office)
  "longitude": -7.5898, // Casablanca longitude (example central office)
  "address": "Central Reservations Office, Boulevard d'Anfa, Casablanca, Morocco", // Fictional central office address
  "whatsappNumber": "06XX-XXXXXX", // Fictional central WhatsApp

  // --- Social Media Links ---
  "facebook": "https://www.facebook.com/PalaisCherifiens", // Fictional
  "instagram": "https://www.instagram.com/palaischerifiens/", // Fictional
  "twitter": "", // Assume no X/Twitter

  // --- About Us Content (Short version for config) ---
  "aboutUsContent": {
    "title": "Les Palais Chérifiens offers intimate luxury stays within meticulously restored riads and palaces in Morocco's historic hearts. We blend heritage preservation with bespoke hospitality.",
    "imageUrl": "/images/mock/about-us-palais-cherifiens.webp" // <-- SUGGESTION: Elegant image of one of the riads or a courtyard
  },

  // --- Service Description (Short version for config) ---
  "serviceDescription": "Luxury boutique hotel collection in Marrakech & Fes. Features include individually designed suites, serene courtyards, rooftop terraces, refined dining, intimate spas, and personalized concierge services.",

  // --- Tour Locations Served (Now Property Locations) ---
  "tourLocationsServed": "Marrakech, Fes", // Cities where they have properties

  // --- Payment & Language Options ---
  "paymentMethodsAccepted": ["bankTransfer", "onlinePaymentGateway", "creditCard"], // Standard for luxury hotels
  "websiteLanguageOptions": ["en", "fr", "es"], // Common languages for luxury travel

  // --- SEO Keywords & Social Share Image ---
  "keywords": "luxury riad Morocco, boutique hotel Marrakech, luxury hotel Fes, Moroccan palace hotel, authentic Morocco luxury stay, Les Palais Chérifiens, Medina luxury riad, bespoke Morocco travel, heritage hotel Morocco",
  "socialShareImageUrl": "/images/mock/og-palais-cherifiens.webp", // <-- SUGGESTION: Stunning OG image (e.g., beautiful riad courtyard detail)

  // --- Feature Toggles ---
  "reviewsSystem": true,
  "blogSystem": true,
  "bookingEngine": true, // Essential for a hotel
  "experiencesSection": true, // To showcase suites & experiences
  "faqSection": true,

  // --- Legal Content ---
  "privacyPolicyContent": "Les Palais Chérifiens values your privacy... [Standard hotel privacy policy text regarding guest data, booking information, data security, GDPR/local compliance]. Contact: privacy@palaischerifiens.ma", // Placeholder
  "termsOfUseContent": "Booking a stay at Les Palais Chérifiens constitutes acceptance of these terms... [Standard hotel terms covering reservations, deposits, cancellation policies, check-in/out, liability, guest conduct].", // Placeholder

  "clientTextContent": clientTextContent,
};


// --- DYNAMIC `siteConfig` VARIABLE (using manual data for development) ---
// This uses the manualClientData to generate the final siteConfig.
export const siteConfig: SiteConfig = mergeClientDataWithTheme(manualClientData);

// --- EXPORT THE GENERATED PAGE-SPECIFIC SEO METADATA STORE ---
// This line was missing or commented out!
export const pageSeoMetadataStore: MetadataStore = generatePageMetadata(siteConfig); // <-- ADD/UNCOMMENT THIS LINE