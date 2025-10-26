/**
 * This file contains SEO keywords for the tourism platform.
 * Keywords are provided in both English and French to target a wider audience
 * searching for travel experiences in Morocco.
 */

// src/config/site.ts (Updated sharedKeywords)

// --- SHARED KEYWORDS (Good for all themes) ---
export const sharedKeywords: string[] = [
  // English Keywords - General Tourism
  'Morocco travel',
  'Morocco tours',
  'Morocco trips',
  'travel agency Morocco',
  'tour operator Morocco',
  'adventure travel Morocco',
  'cultural tours Morocco',
  'desert tours Morocco',
  'Atlas Mountains tours',
  'Sahara Desert experience',
  'Marrakech tours',
  'Fes tours',
  'Casablanca tours',
  'Agadir excursions',
  'private tours Morocco',
  'tailor-made Morocco trips',
  'bespoke travel Morocco',
  'Moroccan holidays',
  'discover Morocco',
  'explore Morocco',
  'authentic Morocco',
  'luxury Morocco tours',
  'budget Morocco travel',
  'family holidays Morocco',
  'solo travel Morocco',
  'group tours Morocco',
  'Moroccan desert camp',
  'camel trekking Sahara',
  'local guides Morocco',
  'Moroccan transport service',
  'airport transfer Morocco',
  'inter-city travel Morocco',
  'Moroccan experiences',
  'food tours Morocco',
  'cooking classes Marrakech',
  'wellness retreats Morocco',
  'historical tours Morocco',
  'city breaks Morocco',
  'beach holidays Morocco', // e.g., Essaouira, Agadir
  'eco-tourism Morocco',
  'sustainable travel Morocco',
  'Moroccan hospitality',
  'sightseeing Morocco',
  'travel guide Morocco',
  'Morocco vacation packages',

  
  'Upmerce Solutions', // Your brand keyword

  // Darija Keywords - General Tourism
  'سفر للمغرب', // Travel to Morocco
  'رحلات المغرب', // Morocco trips/journeys
  'وكالة أسفار المغرب', // Travel agency Morocco
  'جولات سياحية المغرب', // Tourist tours Morocco
  'رحلات صحراوية المغرب', // Desert trips Morocco
  'جبال الأطلس رحلات', // Atlas Mountains trips
  'مراكش سياحة', // Marrakech tourism
  'أكادير رحلات', // Agadir trips
  'النقل السياحي المغرب', // Tourist transport Morocco
  'دليل سياحي المغرب', // Morocco tourist guide
  'تأجير سيارات بسائق المغرب', // Car rental with driver Morocco
  'مغامرات المغرب', // Morocco adventures
  'المغرب الفاسي', // Fes Morocco
  'مكناس رحلات', // Meknes trips
  'شفشاون سياحة', // Chefchaouen tourism
  'الصويرة رحلات بحرية', // Essaouira sea trips

 
];

// --- THEME-SPECIFIC KEYWORDS ---

// Keywords for the "Default / Authentic" Theme
export const defaultKeywords: string[] = [
  'authentic moroccan adventures',
  'berber village tour',
  'imlil guide',
  'cultural immersion morocco',
  'local moroccan experiences',
];

// Keywords for the "Luxury & Serenity" Theme
export const luxuryKeywords: string[] = [
  'luxury riad marrakech',
  'serene atlas escapes',
  'bespoke morocco tours',
  'premium desert camp',
  'high-end moroccan travel',
];

// Keywords for the "Adventure & Action" Theme
export const adventureKeywords: string[] = [
  'morocco adventure travel',
  'atlas mountains trek',
  'sahara desert 4x4 tour',
  'agadir surf camp website',
  'active holidays morocco',
];
// --- English Keywords (25) ---
const englishKeywords: string[] = [
    'morocco travel',
    'visit morocco',
    'morocco tourism',
    'marrakech guide',
    'fes medina',
    'sahara desert tours',
    'atlas mountains hiking',
    'agadir beach holiday',
    'chefchaouen blue city',
    'essaouira surf',
    'morocco vacation packages',
    'riads in morocco',
    'moroccan food tour',
    'camel trekking sahara',
    'morocco adventure travel',
    'things to do in morocco',
    'morocco cultural tours',
    'luxury travel morocco',
    'budget travel morocco',
    'morocco historical sites',
    'shopping in moroccan souks',
    'rabat attractions',
    'casablanca travel',
    'morocco family vacation',
    'morocco desert camping',
];

// --- French Keywords (25) ---
const frenchKeywords: string[] = [
    'voyage maroc',
    'visiter le maroc',
    'tourisme maroc',
    'guide de marrakech',
    'médina de fès',
    'excursions désert sahara',
    'randonnée montagnes atlas',
    'vacances plage agadir',
    'chefchaouen la ville bleue',
    'surf à essaouira',
    'séjours au maroc',
    'riads au maroc',
    'tour gastronomique maroc',
    'randonnée chameau sahara',
    "voyage d'aventure maroc",
    'que faire au maroc',
    'circuits culturels maroc',
    'voyage de luxe maroc',
    'voyage pas cher maroc',
    'sites historiques maroc',
    'shopping souks marocains',
    'attractions de rabat',
    'voyager à casablanca',
    'vacances en famille maroc',
    'bivouac désert maroc',
];

/**
 * A combined list of keywords for use in the <meta name="keywords"> tag.
 * While major search engines like Google place little to no weight on this tag for ranking,
 * it can still be used by other systems and for internal site search.
 */
export const keywords: string[] = [...englishKeywords, ...frenchKeywords];