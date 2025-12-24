'use client';

import React from 'react';
import { Box, Typography, Container, Stack, Tooltip } from '@mui/material'; // Added Tooltip, Stack
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import Image from 'next/image';
import { WebsiteLanguage } from '@/config/types';
import VerifiedIcon from '@mui/icons-material/Verified'; // Verified Icon

export default function SocialProofSection() {
  const locale = useLocale() as WebsiteLanguage;
  const content = siteConfig.textContent[locale]?.homepage || siteConfig.textContent.en.homepage;

  const { trustBadges = [], partnerLogos = [] } = siteConfig;

  // LOGIC: Prefer Trust Badges (Static Authority) over Partners (Scrolling Social Proof)
  const isTrustMode = trustBadges.length > 0;
  const logosToShow = isTrustMode ? trustBadges : partnerLogos;

  if (logosToShow.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg"> {/* Widened container for static row */}
        
        {/* SECTION HEADER */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mb={6}>
            {isTrustMode && <VerifiedIcon color="primary" sx={{ fontSize: 20 }} />}
            <Typography
            sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 2,
                fontSize: '0.875rem'
            }}
            >
            {content.socialProofTitle}
            </Typography>
        </Stack>

        {/* --- MODE SWITCHER --- */}
        {isTrustMode ? (
            // === MODE A: STATIC TRUST (Viator/Gov Standard) ===
            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                alignItems="center" 
                justifyContent="center" 
                spacing={{ xs: 4, md: 8 }}
                flexWrap="wrap"
            >
                {logosToShow.map((logo, index) => (
                    <Tooltip key={`${logo.name}-${index}`} title={`Official Partner: ${logo.name}`} arrow>
                        <Box sx={{ 
                            position: 'relative', 
                            width: { xs: 140, sm: 160 }, 
                            height: { xs: 70, sm: 90 },
                            opacity: 0.9,
                            transition: 'all 0.3s ease',
                            '&:hover': { opacity: 1, transform: 'scale(1.05)' } 
                        }}>
                            <Image
                                src={logo.url}
                                alt={logo.name}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="160px"
                            />
                        </Box>
                    </Tooltip>
                ))}
            </Stack>
        ) : (
            // === MODE B: SCROLLING PARTNERS (SaaS Standard) ===
            <Box sx={{ width: '100%', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                <Box sx={{ display: 'flex', width: 'fit-content', animation: 'scroll 40s linear infinite', '&:hover': { animationPlayState: 'paused' }, '@keyframes scroll': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } }}>
                    {[...logosToShow, ...logosToShow].map((logo, index) => (
                        <Box key={`${logo.name}-${index}`} sx={{ position: 'relative', width: { xs: 130, sm: 160 }, height: { xs: 65, sm: 80 }, mx: { xs: 3, sm: 5 }, flexShrink: 0 }}>
                            <Image src={logo.url} alt={logo.name} fill loading='lazy' style={{ objectFit: 'contain' }} sizes="160px" />
                        </Box>
                    ))}
                </Box>
            </Box>
        )}

      </Container>
    </Box>
  );
}