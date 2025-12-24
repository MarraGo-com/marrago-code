// scripts/seed-experiences.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  const projectId = process.env.ADMIN_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.ADMIN_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.ADMIN_FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("❌ Error: Missing Admin credentials.");
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// --- THE 11 EXPERIENCES (TUNED FOR 4-4-4 LAYOUT) ---
const experiences = [
  // =========================================================
  // BUCKET 1: SELLING FAST (Scarcity = true)
  // =========================================================
  {
    id: 'agafay-luxury-sunset',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'marrakech', 
    rating: 4.9, reviewCount: 320,
    price: { amount: 85, currency: 'EUR', prefix: '€' },
    duration: '6 Hours',
    coverImage: 'https://images.unsplash.com/photo-1542052603-51978430a5c4?q=80&w=2070',
    maxGuests: 10, tourCode: 'AGF-VIP', startTimes: ['16:00'],
    languages: ['English', 'French'],
    latitude: 31.4234, longitude: -8.1345,
    scarcity: { isLikelyToSellOut: true }, // <--- FORCED BUCKET 1
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true },
    translations: {
      en: {
        title: "Agafay Desert Luxury Sunset: Camel Ride & Berber Dinner",
        shortDescription: "Escape the city for a magical evening in the stone desert. Enjoy a private sunset camel trek followed by a gourmet 3-course dinner.",
        description: "Experience the mystic silence of the Agafay Desert... (Full text)",
        highlights: ["VIP Private Transfer", "Sunset Camel Trek", "3-Course Gourmet Dinner", "Live Gnawa Music"],
        included: ["Transport", "Dinner", "Camel Ride", "Tea"],
        notIncluded: ["Alcoholic Drinks", "Tips"],
        program: [
            { title: "Hotel Pickup", type: "transport", duration: "45 min", description: "Luxury 4x4 pickup." },
            { title: "Camel Trek", type: "activity", duration: "1 Hour", description: "Ride across the stone dunes." },
            { title: "Dinner & Show", type: "meal", duration: "2 Hours", description: "Candlelit dinner." }
        ]
      },
      fr: {
        title: "Désert d'Agafay : Coucher de Soleil de Luxe et Dîner",
        shortDescription: "Évadez-vous dans le désert de pierre pour une soirée magique avec balade à dos de chameau et dîner gastronomique.",
        description: "Découvrez le silence mystique du désert d'Agafay... (Texte complet)",
        highlights: ["Transfert VIP", "Coucher de soleil", "Dîner Gastronomique", "Musique Gnawa"],
        included: ["Transport", "Dîner", "Balade à chameau", "Thé"],
        notIncluded: ["Alcool", "Pourboires"],
        program: [
            { title: "Prise en charge", type: "transport", duration: "45 min", description: "Pickup en 4x4 de luxe." },
            { title: "Balade à Chameau", type: "activity", duration: "1 Heure", description: "Sur les dunes de pierre." },
            { title: "Dîner et Spectacle", type: "meal", duration: "2 Heures", description: "Dîner aux chandelles." }
        ]
      }
    }
  },
  {
    id: 'chefchaouen-tangier-daytrip',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'tangier',
    rating: 4.8, reviewCount: 295,
    price: { amount: 85, currency: 'EUR', prefix: '€' },
    duration: '8 Hours',
    coverImage: 'https://images.unsplash.com/photo-1563456075-802c65074d30?q=80&w=2070',
    maxGuests: 8, tourCode: 'CHF-TGR', startTimes: ['08:00'],
    languages: ['English', 'French', 'Spanish'],
    latitude: 35.1688, longitude: -5.2684,
    scarcity: { isLikelyToSellOut: true }, // <--- FORCED BUCKET 1
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "Chefchaouen Blue City: Private Day Trip from Tangier",
        shortDescription: "Journey through the Rif Mountains to the 'Blue Pearl'. A photographer's dream of cobalt alleyways.",
        description: "Leave the bustle of Tangier for the scenic Rif Mountains. Founded in 1471, Chefchaouen offers a calm atmosphere unlike any other. Your guide will navigate the winding blue streets, visiting the Kasbah and the Spanish Mosque.",
        highlights: ["Scenic Rif Drive", "Blue Medina Walk", "Ras El Ma Spring", "Spanish Mosque View"],
        included: ["Private Transport", "Guide", "Water"],
        notIncluded: ["Lunch", "Tips"],
        program: [
          { title: "Rif Drive", type: "transport", duration: "2 Hours", description: "Scenic drive from Tangier." },
          { title: "Medina Walk", type: "activity", duration: "2 Hours", description: "Guided photo tour." },
          { title: "Ras El Ma", type: "stop", duration: "30 min", description: "Visit the spring." },
          { title: "Return", type: "transport", duration: "2 Hours", description: "Drive back to Tangier." }
        ]
      },
      fr: {
        title: "Chefchaouen la Ville Bleue : Excursion Privée depuis Tanger",
        shortDescription: "Voyagez à travers le Rif vers la 'Perle Bleue'. Le rêve des photographes avec ses ruelles cobalt.",
        description: "Quittez l'agitation de Tanger pour les montagnes du Rif. Chefchaouen offre une atmosphère calme unique. Votre guide vous fera découvrir les ruelles bleues, la Kasbah et la Mosquée Espagnole.",
        highlights: ["Route du Rif", "Médina Bleue", "Source Ras El Ma", "Mosquée Espagnole"],
        included: ["Transport Privé", "Guide", "Eau"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
          { title: "Route du Rif", type: "transport", duration: "2 Heures", description: "Route panoramique." },
          { title: "Marche Médina", type: "activity", duration: "2 Heures", description: "Tour photo guidé." },
          { title: "Ras El Ma", type: "stop", duration: "30 min", description: "Visite de la source." },
          { title: "Retour", type: "transport", duration: "2 Heures", description: "Retour à Tanger." }
        ]
      }
    }
  },
  {
    id: 'atlas-3-valleys',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'marrakech', 
    rating: 4.8, reviewCount: 410,
    price: { amount: 55, currency: 'EUR', prefix: '€' }, // bumped to 55 to avoid Best Value bucket
    duration: '8 Hours',
    coverImage: 'https://images.unsplash.com/photo-1547990428-2f80c6198f7e?q=80&w=2070',
    maxGuests: 12, tourCode: 'ATL-3V', startTimes: ['09:00'],
    languages: ['English', 'French'],
    latitude: 31.3426, longitude: -7.7663,
    scarcity: { isLikelyToSellOut: true }, // <--- FORCED BUCKET 1
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true },
    translations: {
      en: {
        title: "Atlas Mountains & 3 Valleys: Berber Villages & Tea",
        shortDescription: "Immerse yourself in Berber culture. Visit a traditional home, hike to waterfalls, and explore 3 valleys.",
        description: "This comprehensive tour takes you deep into the High Atlas...",
        highlights: ["Berber Tea Ceremony", "3 Valleys", "Waterfall Hike", "River Lunch"],
        included: ["Transport", "Guide", "Tea"],
        notIncluded: ["Lunch", "Tips"],
        program: [
            { title: "Berber House", type: "activity", duration: "45 min", description: "Tea with locals." },
            { title: "Sidi Fares", type: "transport", duration: "1 Hour", description: "Off-road drive." },
            { title: "Waterfall Hike", type: "activity", duration: "1 Hour", description: "Hike to falls." }
        ]
      },
      fr: {
        title: "Montagnes de l'Atlas et 3 Vallées",
        shortDescription: "Culture berbère, maison traditionnelle et randonnée vers les cascades.",
        description: "Excursion complète au cœur du Haut Atlas...",
        highlights: ["Cérémonie du Thé", "3 Vallées", "Randonnée", "Déjeuner Rivière"],
        included: ["Transport", "Guide", "Thé"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
            { title: "Maison Berbère", type: "activity", duration: "45 min", description: "Thé avec les locaux." },
            { title: "Sidi Fares", type: "transport", duration: "1 Heure", description: "Route panoramique." },
            { title: "Randonnée", type: "activity", duration: "1 Heure", description: "Vers les cascades." }
        ]
      }
    }
  },
  {
    id: 'fes-merzouga-luxury-3day',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'fes',
    rating: 5.0, reviewCount: 155,
    price: { amount: 280, currency: 'EUR', prefix: '€' },
    duration: '3 Days',
    coverImage: 'https://images.unsplash.com/photo-1512554707267-393279930864?q=80&w=2072',
    maxGuests: 6, tourCode: 'FES-MRZ', startTimes: ['07:30'],
    languages: ['English', 'French', 'Spanish'],
    latitude: 34.0333, longitude: -5.0000,
    scarcity: { isLikelyToSellOut: true }, // <--- FORCED BUCKET 1
    bookingPolicy: { cancellationHours: 48, isPayLater: false, instantConfirmation: false },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "3-Day Luxury Desert Expedition: Fes to Merzouga Dunes",
        shortDescription: "A trans-Atlas odyssey. Journey through 'Little Switzerland' and the Ziz Valley to the Sahara.",
        description: "Departing Fes, ascend into the Middle Atlas to Ifrane and the Cedar Forests to feed wild monkeys. The landscape shifts to the dramatic Ziz Valley palm groves before reaching Merzouga. Experience a sunset camel trek and luxury glamping.",
        highlights: ["Ifrane & Cedar Forest", "Feed Wild Monkeys", "Ziz Valley Oasis", "Luxury Glamping"],
        included: ["Transport", "Luxury Camp", "Half Board"],
        notIncluded: ["Lunches", "Drinks"],
        program: [
          { title: "Ifrane", type: "stop", duration: "1 Hour", description: "Little Switzerland stop." },
          { title: "Ziz Valley", type: "stop", duration: "30 min", description: "Panoramic view." },
          { title: "Camel Trek", type: "activity", duration: "1 Hour", description: "Sunset ride to camp." }
        ]
      },
      fr: {
        title: "Expédition Désert de Luxe 3 Jours : Fès à Merzouga",
        shortDescription: "Une odyssée trans-Atlas. De la 'Petite Suisse' à la Vallée du Ziz jusqu'au Sahara.",
        description: "Au départ de Fès, montez vers Ifrane et les forêts de cèdres pour voir les singes. Le paysage change vers la vallée du Ziz avant d'atteindre Merzouga. Profitez d'une méharée au coucher du soleil et d'un bivouac de luxe.",
        highlights: ["Ifrane & Forêt de Cèdres", "Singes Sauvages", "Vallée du Ziz", "Bivouac Luxe"],
        included: ["Transport", "Camp Luxe", "Demi-pension"],
        notIncluded: ["Déjeuners", "Boissons"],
        program: [
          { title: "Ifrane", type: "stop", duration: "1 Heure", description: "Arrêt Petite Suisse." },
          { title: "Vallée du Ziz", type: "stop", duration: "30 min", description: "Vue panoramique." },
          { title: "Méharée", type: "activity", duration: "1 Heure", description: "Vers le camp." }
        ]
      }
    }
  },

  // =========================================================
  // BUCKET 2: TRAVELERS' CHOICE (Reviews > 800)
  // =========================================================
  {
    id: 'merzouga-grand-expedition',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'merzouga', 
    rating: 5.0, reviewCount: 942, // <--- WINNER (Bucket 2)
    price: { amount: 240, currency: 'EUR', prefix: '€' },
    duration: '3 Days',
    coverImage: 'https://images.unsplash.com/photo-1539651044670-5c742c0e788b?q=80&w=2070',
    maxGuests: 6, tourCode: 'MRZ-LUX', startTimes: ['07:00'],
    languages: ['English', 'French', 'Spanish'],
    latitude: 31.0802, longitude: -4.0133,
    scarcity: { isLikelyToSellOut: false },
    bookingPolicy: { cancellationHours: 48, isPayLater: false, instantConfirmation: false },
    features: { mobileTicket: true },
    translations: {
      en: {
        title: "The Grand Sahara: 3-Day Luxury Expedition to Merzouga",
        shortDescription: "The ultimate road trip. Cross the Atlas, sleep in Dades, and glamp in the Erg Chebbi dunes.",
        description: "Embark on a once-in-a-lifetime journey...",
        highlights: ["Luxury Glamping", "Ait Ben Haddou", "Sunset Camel Trek", "Dades Valley"],
        included: ["Accommodation", "Half Board", "Transport", "Guide"],
        notIncluded: ["Lunches", "Drinks"],
        program: [
            { title: "Atlas Crossing", type: "transport", duration: "4 Hours", description: "Tizi n'Tichka pass." },
            { title: "Dades Valley", type: "accommodation", duration: "Overnight", description: "Night in Riad." },
            { title: "Erg Chebbi", type: "activity", duration: "1.5 Hours", description: "Camel trek to camp." }
        ]
      },
      fr: {
        title: "Le Grand Sahara : Expédition de Luxe 3 Jours",
        shortDescription: "L'ultime road trip. Traversez l'Atlas et dormez dans les dunes de Merzouga.",
        description: "Embarquez pour un voyage unique...",
        highlights: ["Bivouac de Luxe", "Aït Ben Haddou", "Coucher de soleil", "Vallée du Dadès"],
        included: ["Hébergement", "Demi-pension", "Transport", "Guide"],
        notIncluded: ["Déjeuners", "Boissons"],
        program: [
            { title: "Traversée de l'Atlas", type: "transport", duration: "4 Heures", description: "Col de Tizi n'Tichka." },
            { title: "Vallée du Dadès", type: "accommodation", duration: "Nuitée", description: "Riad de charme." },
            { title: "Erg Chebbi", type: "activity", duration: "1.5 Heures", description: "Randonnée chamelière." }
        ]
      }
    }
  },
  {
    id: 'casablanca-rabat-imperial-daytrip',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'casablanca',
    rating: 4.6, reviewCount: 888, // <--- WINNER (Bucket 2)
    price: { amount: 120, currency: 'EUR', prefix: '€' },
    duration: '12 Hours',
    coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070',
    maxGuests: 15, tourCode: 'CAS-RBT', startTimes: ['07:00'],
    languages: ['English', 'French'],
    latitude: 33.6086, longitude: -7.6327,
    scarcity: { isLikelyToSellOut: false },
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "Imperial Cities: Casablanca & Rabat Full-Day Tour",
        shortDescription: "Visit two capitals in one day. Marvel at the Hassan II Mosque and Royal monuments of Rabat.",
        description: "Experience the modern grandeur of Casablanca and historic Rabat. Visit the masterpiece Hassan II Mosque (inside tour included). Continue to Rabat to explore the Hassan Tower, Mohammed V Mausoleum, and the Udayas Kasbah.",
        highlights: ["Hassan II Mosque Tour", "Casablanca Corniche", "Hassan Tower", "Kasbah Udayas"],
        included: ["Transport", "Mosque Ticket", "Guide"],
        notIncluded: ["Lunch", "Tips"],
        program: [
          { title: "Hassan II Mosque", type: "activity", duration: "1 Hour", description: "Interior tour." },
          { title: "Rabat Monuments", type: "activity", duration: "1.5 Hours", description: "Hassan Tower & Mausoleum." },
          { title: "Kasbah Udayas", type: "activity", duration: "45 min", description: "Blue fortress walk." }
        ]
      },
      fr: {
        title: "Villes Impériales : Casablanca et Rabat (Journée Complète)",
        shortDescription: "Deux capitales en un jour. Admirez la Mosquée Hassan II et les monuments de Rabat.",
        description: "Découvrez la grandeur de Casablanca et l'histoire de Rabat. Visitez la Mosquée Hassan II (intérieur inclus). Continuez vers Rabat pour voir la Tour Hassan et la Kasbah des Oudayas.",
        highlights: ["Mosquée Hassan II", "Corniche Casablanca", "Tour Hassan", "Kasbah Oudayas"],
        included: ["Transport", "Ticket Mosquée", "Guide"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
          { title: "Mosquée Hassan II", type: "activity", duration: "1 Heure", description: "Visite intérieure." },
          { title: "Monuments Rabat", type: "activity", duration: "1.5 Heures", description: "Tour Hassan & Mausolée." },
          { title: "Kasbah Oudayas", type: "activity", duration: "45 min", description: "Promenade forteresse." }
        ]
      }
    }
  },
  {
    id: 'tangier-food-history-tour',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'tangier',
    rating: 4.7, reviewCount: 875, // <--- WINNER (Bucket 2)
    price: { amount: 65, currency: 'EUR', prefix: '€' },
    duration: '6 Hours',
    coverImage: 'https://images.unsplash.com/photo-1598525068697-744357c919d7?q=80&w=2070',
    maxGuests: 10, tourCode: 'TGR-FOOD', startTimes: ['10:00'],
    languages: ['English', 'French', 'Spanish'],
    latitude: 35.7595, longitude: -5.8340,
    scarcity: { isLikelyToSellOut: false },
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "Tangier: Gateway to Africa Food, History & Hercules Caves",
        shortDescription: "Explore the Kasbah, taste street food, and visit the mythical Caves of Hercules.",
        description: "Tangier has long been a gateway between continents. Explore the Kasbah and Medina tasting local treats. Drive to Cap Spartel, where the Atlantic meets the Mediterranean, and enter the legendary Caves of Hercules shaped like the map of Africa.",
        highlights: ["Caves of Hercules", "Cap Spartel", "Kasbah Walking Tour", "Street Food Tasting"],
        included: ["Transport", "Guide", "Food Tastings"],
        notIncluded: ["Lunch", "Tips"],
        program: [
          { title: "Kasbah Walk", type: "activity", duration: "2 Hours", description: "History & Food." },
          { title: "Cap Spartel", type: "stop", duration: "45 min", description: "Atlantic meets Mediterranean." },
          { title: "Caves of Hercules", type: "activity", duration: "1 Hour", description: "Mythical cave visit." }
        ]
      },
      fr: {
        title: "Tanger : Porte de l'Afrique, Histoire et Grottes d'Hercule",
        shortDescription: "Explorez la Kasbah, goûtez la cuisine de rue et visitez les grottes mythiques.",
        description: "Tanger est la porte entre les continents. Explorez la Kasbah en dégustant des spécialités. Roulez vers le Cap Spartel, point de rencontre des océans, et visitez les Grottes d'Hercule.",
        highlights: ["Grottes d'Hercule", "Cap Spartel", "Tour Kasbah", "Dégustations"],
        included: ["Transport", "Guide", "Dégustations"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
          { title: "Marche Kasbah", type: "activity", duration: "2 Heures", description: "Histoire & Cuisine." },
          { title: "Cap Spartel", type: "stop", duration: "45 min", description: "Rencontre des océans." },
          { title: "Grottes d'Hercule", type: "activity", duration: "1 Heure", description: "Visite des grottes." }
        ]
      }
    }
  },

  // =========================================================
  // BUCKET 3: BEST VALUE (Price < 60)
  // =========================================================
  {
    id: 'ouzoud-falls-hike',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'azilal', 
    rating: 4.6, reviewCount: 215,
    price: { amount: 45, currency: 'EUR', prefix: '€' },
    duration: '9 Hours',
    coverImage: 'https://images.unsplash.com/photo-1589133465492-44a6cb1b9b21?q=80&w=1974',
    maxGuests: 15, tourCode: 'OZD-NAT', startTimes: ['08:30'],
    languages: ['English', 'French'],
    latitude: 32.0142, longitude: -6.7186,
    scarcity: { isLikelyToSellOut: false }, // <--- BUCKET 3
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true },
    translations: {
      en: {
        title: "Ouzoud Waterfalls: Guided Hike, Boat Ride & Wild Monkeys",
        shortDescription: "Hike to North Africa's highest waterfalls, spot wild monkeys, and enjoy a boat ride.",
        description: "Located in the Middle Atlas Mountains...",
        highlights: ["110m Waterfalls", "Wild Monkeys", "Boat Ride", "Olive Groves"],
        included: ["Transport", "Guide", "Boat Ticket"],
        notIncluded: ["Lunch", "Tips"],
        program: [
            { title: "The Descent", type: "activity", duration: "1 Hour", description: "Guided hike." },
            { title: "Wild Monkeys", type: "stop", duration: "20 min", description: "Meet the Barbary apes." },
            { title: "Boat Ride", type: "activity", duration: "30 min", description: "Row boat at the falls." }
        ]
      },
      fr: {
        title: "Cascades d'Ouzoud : Randonnée, Bateau et Singes",
        shortDescription: "Randonnée vers les plus hautes chutes d'Afrique du Nord, avec singes et bateau.",
        description: "Situées dans le Moyen Atlas...",
        highlights: ["Chutes de 110m", "Singes Sauvages", "Bateau", "Oliveraies"],
        included: ["Transport", "Guide", "Bateau"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
            { title: "La Descente", type: "activity", duration: "1 Heure", description: "Randonnée guidée." },
            { title: "Singes Sauvages", type: "stop", duration: "20 min", description: "Rencontre avec les singes." },
            { title: "Bateau", type: "activity", duration: "30 min", description: "Balade au pied des chutes." }
        ]
      }
    }
  },
  {
    id: 'essaouira-coastal-trip',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'essaouira',
    rating: 4.7, reviewCount: 310,
    price: { amount: 25, currency: 'EUR', prefix: '€' },
    duration: '10 Hours',
    coverImage: 'https://images.unsplash.com/photo-1575891783049-7c82c686e9e4?q=80&w=2070',
    maxGuests: 20, tourCode: 'ESS-CTY', startTimes: ['08:00'],
    languages: ['English', 'French'],
    latitude: 31.5085, longitude: -9.7595,
    scarcity: { isLikelyToSellOut: false }, // <--- BUCKET 3
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true },
    translations: {
      en: {
        title: "Essaouira Coastal Escape: Medina History & Atlantic Breezes",
        shortDescription: "A relaxed day trip to the 'Windy City'. Explore the Portuguese fortress and enjoy fresh seafood.",
        description: "Leave the chaos of Marrakech behind...",
        highlights: ["Skala Ramparts", "UNESCO Medina", "Argan Cooperative", "Fresh Seafood"],
        included: ["Transport", "Guide"],
        notIncluded: ["Lunch", "Monuments"],
        program: [
            { title: "Argan Stop", type: "stop", duration: "30 min", description: "Women's cooperative." },
            { title: "The Ramparts", type: "activity", duration: "1 Hour", description: "Walk the fortress." },
            { title: "Free Time", type: "activity", duration: "4 Hours", description: "Shopping and beach." }
        ]
      },
      fr: {
        title: "Escapade Côtière à Essaouira : Histoire et Brise Marine",
        shortDescription: "Une journée détendue dans la 'Cité des Vents'. Forteresse portugaise et fruits de mer.",
        description: "Laissez le chaos de Marrakech derrière vous...",
        highlights: ["Remparts Skala", "Médina UNESCO", "Coopérative Argan", "Fruits de Mer"],
        included: ["Transport", "Guide"],
        notIncluded: ["Déjeuner", "Monuments"],
        program: [
            { title: "Arrêt Argan", type: "stop", duration: "30 min", description: "Coopérative féminine." },
            { title: "Les Remparts", type: "activity", duration: "1 Heure", description: "Promenade sur les murs." },
            { title: "Temps Libre", type: "activity", duration: "4 Heures", description: "Shopping et plage." }
        ]
      }
    }
  },
  {
    id: 'fes-medina-secrets-tour',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'fes',
    rating: 4.9, reviewCount: 210,
    price: { amount: 40, currency: 'EUR', prefix: '€' },
    duration: '5 Hours',
    coverImage: 'https://images.unsplash.com/photo-1549448103-68f7601934c9?q=80&w=2070',
    maxGuests: 12, tourCode: 'FES-WALK', startTimes: ['09:30'],
    languages: ['English', 'French'],
    latitude: 34.0608, longitude: -4.9786,
    scarcity: { isLikelyToSellOut: false }, // <--- BUCKET 3
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "Hidden Secrets of Fes: Private Cultural Walking Tour",
        shortDescription: "Lost yourself in the world's largest car-free urban zone. Discover ancient tanneries and artisans.",
        description: "Fes el Bali is a sensory labyrinth. This premium tour helps you navigate the chaos with a historian. Visit the Al-Attarine Madrasa, watch coppersmiths, and witness the iconic Chouara Tanneries from a private terrace.",
        highlights: ["Al-Attarine Madrasa", "Chouara Tanneries View", "Weaving Workshop", "Souk Navigation"],
        included: ["Guide", "Madrasa Ticket"],
        notIncluded: ["Lunch", "Tips"],
        program: [
          { title: "Blue Gate", type: "stop", duration: "20 min", description: "History intro." },
          { title: "Tanneries", type: "activity", duration: "45 min", description: "View dyeing vats." },
          { title: "Souks", type: "activity", duration: "1 Hour", description: "Spice and copper markets." }
        ]
      },
      fr: {
        title: "Secrets Cachés de Fès : Visite Culturelle Privée",
        shortDescription: "Perdez-vous dans la plus grande zone piétonne du monde. Découvrez les tanneries et artisans.",
        description: "Fès el Bali est un labyrinthe sensoriel. Cette visite vous aide à naviguer avec un historien. Visitez la médersa Al-Attarine et admirez les tanneries Chouara depuis une terrasse privée.",
        highlights: ["Médersa Al-Attarine", "Tanneries Chouara", "Atelier Tissage", "Souks"],
        included: ["Guide", "Ticket Médersa"],
        notIncluded: ["Déjeuner", "Pourboires"],
        program: [
          { title: "Porte Bleue", type: "stop", duration: "20 min", description: "Intro historique." },
          { title: "Tanneries", type: "activity", duration: "45 min", description: "Vue sur les bassins." },
          { title: "Souks", type: "activity", duration: "1 Heure", description: "Marchés aux épices." }
        ]
      }
    }
  },
  {
    id: 'agadir-paradise-valley-nature',
    isActive: true, status: 'published',
    createdAt: new Date(), updatedAt: new Date(),
    locationId: 'agadir',
    rating: 4.5, reviewCount: 150,
    price: { amount: 35, currency: 'EUR', prefix: '€' },
    duration: '5 Hours',
    coverImage: 'https://images.unsplash.com/photo-1542118318-692383c480b8?q=80&w=2070',
    maxGuests: 20, tourCode: 'AGA-PAR', startTimes: ['09:00', '14:00'],
    languages: ['English', 'French', 'German'],
    latitude: 30.5891, longitude: -9.5298,
    scarcity: { isLikelyToSellOut: false }, // <--- BUCKET 3
    bookingPolicy: { cancellationHours: 24, isPayLater: true, instantConfirmation: true },
    features: { mobileTicket: true, pickupIncluded: true },
    translations: {
      en: {
        title: "Paradise Valley & Sand Dunes: Nature Swimming & Honey Road",
        shortDescription: "Discover the hidden oasis. Swim in rock pools, jump from cliffs, and surf sand dunes.",
        description: "Just an hour from Agadir lies Paradise Valley, a canyon filled with palms and emerald pools. Stop at an Argan Cooperative on the 'Honey Road'. Hike to the pools to swim or cliff jump, then visit the Taboga Sand Dunes.",
        highlights: ["Emerald Rock Pools", "Argan Cooperative", "Honey Road Drive", "Taboga Dunes"],
        included: ["Transport", "Guide"],
        notIncluded: ["Lunch", "Drinks"],
        program: [
          { title: "Argan Stop", type: "stop", duration: "45 min", description: "Oil & Honey tasting." },
          { title: "Swimming", type: "activity", duration: "2 Hours", description: "Free time in pools." },
          { title: "Taboga Dunes", type: "stop", duration: "30 min", description: "Coastal dunes photo." }
        ]
      },
      fr: {
        title: "Vallée du Paradis et Dunes : Baignade et Route du Miel",
        shortDescription: "Découvrez l'oasis cachée. Nagez dans des piscines naturelles et surfez sur les dunes.",
        description: "À une heure d'Agadir se trouve la Vallée du Paradis. Arrêtez-vous sur la 'Route du Miel'. Randonnez vers les piscines pour nager, puis visitez les dunes de Taboga.",
        highlights: ["Piscines Naturelles", "Coopérative Argan", "Route du Miel", "Dunes Taboga"],
        included: ["Transport", "Guide"],
        notIncluded: ["Déjeuner", "Boissons"],
        program: [
          { title: "Arrêt Argan", type: "stop", duration: "45 min", description: "Dégustation miel & huile." },
          { title: "Baignade", type: "activity", duration: "2 Heures", description: "Temps libre." },
          { title: "Dunes Taboga", type: "stop", duration: "30 min", description: "Photo dunes côtières." }
        ]
      }
    }
  }
];

async function seedDatabase() {
  console.log('🚀 Balancing Experience Data (4-4-4 Layout)...');
  for (const exp of experiences) {
    // We update everything to ensure the correct layout properties are set
    const docRef = db.collection('experiences').doc(exp.id);
    await docRef.set(exp, { merge: true });
    console.log(`✅ Balanced: ${exp.translations.en.title}`);
  }
  console.log('🎉 Data rearranged for perfect 4x3 grid!');
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });