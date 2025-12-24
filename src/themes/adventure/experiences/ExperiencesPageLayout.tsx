'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { 
  Grid, Box, Typography, Container, CircularProgress, 
  SelectChangeEvent, Stack, Button, Drawer, Fab, useTheme, useMediaQuery 
} from "@mui/material";
import { useTranslations, useLocale } from 'next-intl'; // <--- Added useLocale
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';

import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Experience, ExperienceTag } from '@/types/experience';
import MainHeadingUserContent from '@/components/custom/MainHeadingUserContent';
import { useExperiences } from '@/hooks/useExperiences';

// --- TYPE DEFINITIONS ---
interface ExperienceCardProps {
  experience: Experience;
}

interface FilterControlsProps {
  selectedLocation: string;
  onLocationChange: (event: SelectChangeEvent) => void;
  selectedSort: string;
  onSortChange: (event: SelectChangeEvent) => void;
}

interface FilterSidebarProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  minPrice: number;
  maxPrice: number;
  minRating: number | null;
  setMinRating: (value: number | null) => void;
  features: {
    freeCancellation: boolean;
    likelyToSellOut: boolean;
    mobileTicket: boolean;
  };
  setFeatures: (value: any) => void;
}

// --- DYNAMIC IMPORTS ---
const theme = process.env.NEXT_PUBLIC_THEME || 'default';

const ExperienceCard = dynamic<ExperienceCardProps>(
  () => import(`@/themes/${theme}/cards/ExperienceCard`)
);

const FilterControls = dynamic<FilterControlsProps>(
  () => import(`@/themes/${theme}/experiences/FilterControls`)
);

const FilterSidebar = dynamic<FilterSidebarProps>(
  () => import(`@/themes/${theme}/experiences/FilterSidebar`)
);

const SmartExperienceRow = dynamic(() => import('@/components/experience/SmartExperienceRow'));

const SearchMap = dynamic(() => import('@/components/experience/SearchMap'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ height: 600, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
});

export default function ExperiencesPageLayout() {
  const t = useTranslations('ExperiencesPage');
  const locale = useLocale(); // <--- 1. Get Active Locale
  const themeUi = useTheme();
  const isDesktop = useMediaQuery(themeUi.breakpoints.up('md'));
  const searchParams = useSearchParams();

  const { data: experiences, isLoading } = useExperiences();

  // States
  const [showMap, setShowMap] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('default');
  
  // Search Query State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Filter States
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [minRating, setMinRating] = useState<number | null>(0);
  const [features, setFeatures] = useState({
    freeCancellation: false,
    likelyToSellOut: false,
    mobileTicket: false
  });

  // --- 1. SYNC URL PARAMS WITH STATE ---
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const loc = searchParams.get('location');

    if (q) setSearchQuery(q);
    if (cat) setActiveCategory(cat);
    if (loc) setSelectedLocation(loc);
  }, [searchParams]);

  // Calculate Min/Max Price
  const { minDataPrice, maxDataPrice } = useMemo(() => {
    if (!experiences) return { minDataPrice: 0, maxDataPrice: 500 };
    const prices = (experiences as Experience[]).map((e: Experience) => e.price.amount);
    return { 
        minDataPrice: Math.min(...prices, 0), 
        maxDataPrice: Math.max(...prices, 500) 
    };
  }, [experiences]);

  // --- 2. UPDATED FILTER LOGIC (Strict Schema) ---
  const processedExperiences: Experience[] = useMemo(() => {
    if (!experiences) return [];
    let items = experiences as Experience[];

    // A. Location Filter (Strict ID Match)
    if (selectedLocation && selectedLocation !== 'all') {
      items = items.filter((e) => e.locationId === selectedLocation);
    }

    // B. Search Text Filter (Locale Aware)
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        items = items.filter(e => {
            // Get content for current locale (fallback to English)
            const translation = e.translations?.[locale] || e.translations?.en;
            return (
                translation?.title?.toLowerCase().includes(lowerQ) ||
                translation?.description?.toLowerCase().includes(lowerQ) ||
                e.locationId.toLowerCase().includes(lowerQ)
            );
        });
    }

   // C. Category/Tag Filter (Strict Tags + Smart Keywords)
   if (activeCategory) {
    const lowerCat = activeCategory.toLowerCase();
    
    // 1. Check if it matches a known STRICT TAG
    const validTags = ['new', 'popular', 'bestseller', 'likelytosellout'];
    
    if (validTags.includes(lowerCat)) {
         // STRICT ARRAY CHECK: Cast lowerCat to ExperienceTag
         items = items.filter(e => e.tags?.includes(lowerCat as ExperienceTag)); // <--- FIX HERE
    } else {
             // 2. Fallback to Keyword Matching (for topics like "Desert", "Food")
             const keywords: Record<string, string[]> = {
                'desert': ['desert', 'dune', 'camel', 'agafay', 'sahara'],
                'food': ['food', 'dinner', 'lunch', 'tasting', 'cooking', 'culinary'],
                'city': ['city', 'medina', 'tour', 'walk', 'souk'],
                'adventure': ['hike', 'hiking', 'trek', 'atlas', 'mountain', 'quad', 'buggy'],
                'transfers': ['transfer', 'driver', 'airport', 'shuttle']
             };

             const targetKeywords = keywords[lowerCat] || [lowerCat];
             
             items = items.filter(e => {
                const translation = e.translations?.[locale] || e.translations?.en;
                const content = (translation?.title + ' ' + translation?.description).toLowerCase();
                return targetKeywords.some(k => content.includes(k));
             });
        }
    }

    // D. Standard Filters (Numeric & Boolean)
    items = items.filter(e => e.price.amount >= priceRange[0] && e.price.amount <= priceRange[1]);
    
    if (minRating && minRating > 0) {
        items = items.filter(e => (e.rating || 0) >= minRating);
    }
    
    if (features.freeCancellation) {
        // Strict check on cancellationHours
        items = items.filter(e => (e.bookingPolicy?.cancellationHours || 0) > 0);
    }
    
    if (features.likelyToSellOut) {
        // Strict Boolean check on scarcity
        items = items.filter(e => e.scarcity?.isLikelyToSellOut === true);
    }
    
    if (features.mobileTicket) {
        // Strict Boolean check on features
        items = items.filter(e => e.features?.mobileTicket === true);
    }

    // E. Sorting (Numeric)
    if (selectedSort === 'price_asc') {
        items = items.slice().sort((a, b) => a.price.amount - b.price.amount);
    } else if (selectedSort === 'price_desc') {
        items = items.slice().sort((a, b) => b.price.amount - a.price.amount);
    } else if (selectedSort === 'rating_desc') {
        items = items.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return items;
  }, [experiences, selectedLocation, selectedSort, priceRange, minRating, features, searchQuery, activeCategory, locale]);

  const onLocationChange = (e: SelectChangeEvent) => setSelectedLocation(e.target.value);
  const onSortChange = (e: SelectChangeEvent) => setSelectedSort(e.target.value);
  
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 4, borderBottom: `1px solid ${themeUi.palette.divider}` }}>
        <Container maxWidth="xl">
            {searchQuery || activeCategory ? (
                <Box sx={{ mb: 2 }}>
                      <Typography variant="overline" color="primary" fontWeight="bold">
                        {t('searchResultsLabel') || "Search Results"}
                      </Typography>
                      <Typography variant="h3" component="h1" fontWeight="800">
                        {searchQuery ? `"${searchQuery}"` : (activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1))}
                      </Typography>
                </Box>
            ) : (
                <MainHeadingUserContent title={t('title')} sx={{ mb: 2 }} />
            )}
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                {t('subtitle')}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                 <FilterControls 
                    selectedLocation={selectedLocation}
                    onLocationChange={onLocationChange}
                    selectedSort={selectedSort}
                    onSortChange={onSortChange}
                 />
                 {!isDesktop && (
                     <Button 
                        startIcon={<FilterListIcon />} 
                        variant="outlined" 
                        onClick={() => setMobileFiltersOpen(true)} 
                        fullWidth
                      >
                        {t('filters.title')}
                      </Button>
                 )}
            </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
            
            {/* LEFT SIDEBAR (Desktop) */}
            {isDesktop && (
                <Grid size={{xs:12, md:3, lg: 2.5}}>
                    <Box sx={{ position: 'sticky', top: 100 }}>
                        <FilterSidebar 
                            priceRange={priceRange} setPriceRange={setPriceRange}
                            minPrice={minDataPrice} maxPrice={maxDataPrice}
                            minRating={minRating} setMinRating={setMinRating}
                            features={features} setFeatures={setFeatures}
                        />
                    </Box>
                </Grid>
            )}

            {/* MAIN CONTENT */}
            <Grid size={{xs:12, md:9, lg: 9.5}}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
                ) : (
                    <>
                        {showMap ? (
                             <Box sx={{ display: 'block', width: '100%', minHeight: '600px', borderRadius: 2, overflow: 'hidden', border: `1px solid ${themeUi.palette.divider}` }}>
                                <SearchMap experiences={processedExperiences} />
                             </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {processedExperiences.map((exp) => (
                                    <Grid key={exp.id} size={{xs:12, sm:6, lg: 4}}>
                                        <ExperienceCard experience={exp} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        
                        {/* --- 3. "NO RESULTS" UPSELL STRATEGY --- */}
                        {processedExperiences.length === 0 && (
                            <Box sx={{ py: 10 }}>
                                <Box sx={{ textAlign: 'center', mb: 8 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {t('noResults') || "No matches found"}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Try adjusting your search or filters to find what you're looking for.
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => { 
                                            setPriceRange([0,500]); 
                                            setMinRating(0); 
                                            setSearchQuery('');
                                            setActiveCategory('');
                                            window.history.pushState({}, '', window.location.pathname);
                                        }} 
                                    >
                                        {t('resetFilters')}
                                    </Button>
                                </Box>

                                {/* THE UPSELL: Show popular tours anyway */}
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                                    You might still enjoy...
                                </Typography>
                                <SmartExperienceRow 
                                    title="Travelers' Top Choice" 
                                    experiences={(experiences as Experience[] || []).slice(0, 4)} 
                                    variant="alternate"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Grid>
        </Grid>
      </Container>

      {/* FLOATING TOGGLE */}
      <Box sx={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
         <Fab 
            variant="extended" 
            onClick={() => setShowMap(!showMap)}
            sx={{ 
                fontWeight: 'bold', 
                px: 3, 
                bgcolor: 'text.primary', 
                color: 'background.default',
                '&:hover': { bgcolor: 'text.secondary' } 
            }}
         >
            {showMap ? <ViewListIcon sx={{ mr: 1 }} /> : <MapIcon sx={{ mr: 1 }} />}
            {showMap ? t('showList') : t('showMap')}
         </Fab>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
            anchor="bottom"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            PaperProps={{ sx: { p: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
      >
            <Typography variant="h6" sx={{ mb: 3 }}>{t('filters_')}</Typography>
            <FilterSidebar 
                priceRange={priceRange} setPriceRange={setPriceRange}
                minPrice={minDataPrice} maxPrice={maxDataPrice}
                minRating={minRating} setMinRating={setMinRating}
                features={features} setFeatures={setFeatures}
            />
            <Button variant="contained" fullWidth size="large" onClick={() => setMobileFiltersOpen(false)} sx={{ mt: 4 }}>
                {t('showResults')}
            </Button>
      </Drawer>

    </Box>
  );
}