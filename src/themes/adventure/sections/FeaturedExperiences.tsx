'use client';

import React, { useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useExperiences } from '@/hooks/useExperiences';
import SmartExperienceRow from '@/components/experience/SmartExperienceRow';
import { Experience } from '@/types/experience';
import { useTranslations } from 'next-intl'; // <--- NEW IMPORT

export default function FeaturedExperiences() {
  const t = useTranslations('FeaturedExperiences'); // <--- HOOK INTO TRANSLATIONS
  const { data: experiences, isLoading } = useExperiences();

  // --- THE BRAIN: Smart Exclusive Bucketing (4-4-4 Strategy) ---
  const { bestSellers, sellingFast, bestValue, showFallback } = useMemo(() => {
    if (!experiences) return { bestSellers: [], sellingFast: [], bestValue: [], showFallback: false };
    
    // Track IDs we have already assigned to a row to prevent duplicates
    const assignedIds = new Set<string>();

    // 1. PRIORITY 1: Selling Fast (Scarcity Badge)
    // STRICTLY 4 ITEMS
    const sellingFast = experiences
        .filter((e: Experience) => e.scarcity?.isLikelyToSellOut === true)
        .slice(0, 4); // <--- Changed to 4
    
    sellingFast.forEach((e: Experience) => assignedIds.add(e.id));

    // 2. PRIORITY 2: Best Value (Price < 60 EUR)
    // STRICTLY 4 ITEMS
    const bestValue = experiences
        .filter((e: Experience) => 
            e.price.amount < 60 && 
            !assignedIds.has(e.id)
        )
        .sort((a: Experience, b: Experience) => a.price.amount - b.price.amount)
        .slice(0, 4); // <--- Changed to 4

    bestValue.forEach((e: Experience) => assignedIds.add(e.id));

    // 3. PRIORITY 3: Travelers' Choice (High Rating)
    // STRICTLY 4 ITEMS
    const bestSellers = experiences
        .filter((e: Experience) => 
            !assignedIds.has(e.id)
        )
        .sort((a: Experience, b: Experience) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 4); // <--- Changed to 4

    // 4. Fallback Check
    const hasSpecialCategories = bestSellers.length > 0 || sellingFast.length > 0 || bestValue.length > 0;

    return { bestSellers, sellingFast, bestValue, showFallback: !hasSpecialCategories };
  }, [experiences]);

  if (isLoading) {
    return <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (!experiences || experiences.length === 0) return null;

  return (
    <Box>
      {/* ROW 1: Selling Fast */}
      {sellingFast.length > 0 && (
          <SmartExperienceRow 
            title={t('sellingFastTitle')} 
            subtitle={t('sellingFastSubtitle')}
            experiences={sellingFast} 
            variant="default"
            viewAllLabel={t('viewAll')}
            viewAllLink="/experiences?sort=popular"
          />
      )}

      {/* ROW 2: Travelers' Choice */}
      {/* variant="alternate" enables the Grey/Dark stripe for contrast */}
      {bestSellers.length > 0 && (
          <SmartExperienceRow 
            title={t('travelersChoiceTitle')} 
            subtitle={t('travelersChoiceSubtitle')}
            experiences={bestSellers} 
            variant="alternate" 
            viewAllLabel={t('viewAll')}
            viewAllLink="/experiences?sort=rating_desc"
          />
      )}

      {/* ROW 3: Best Value */}
      {bestValue.length > 0 && (
          <SmartExperienceRow 
            title={t('bestValueTitle')} 
            subtitle={t('bestValueSubtitle')}
            experiences={bestValue}
            variant="default"
            viewAllLabel={t('viewAll')}
            viewAllLink="/experiences?sort=price_asc"
          />
      )}

      {/* FALLBACK */}
      {showFallback && (
          <SmartExperienceRow 
            title={t('featuredTitle')} 
            subtitle={t('featuredSubtitle')}
            experiences={experiences.slice(0, 8)}
            variant="default"
            viewAllLabel={t('viewAll')}
            viewAllLink="/experiences"
          />
      )}
    </Box>
  );
}