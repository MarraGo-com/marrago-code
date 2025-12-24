// src/components/sections/AboutPageManifesto.tsx
'use client';

import React, { useRef } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Stack
} from '@mui/material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

// --- ICONS ---
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SpaIcon from '@mui/icons-material/Spa'; // Leaf icon replacement

// --- DATA IMPORTS ---
import { siteConfig } from '@/config/client-data';
import { AboutPageContent } from '@/config/types';

// --- VISUAL CONSTANTS (Market Leader Theme) ---
const COLORS = {
  terracotta: '#C86B52',
  sand: '#F2E8DC',
  text: '#1A1A1A',
  white: '#FFFFFF',
  sage: '#8DA399',
  overlay: 'rgba(0,0,0,0.3)'
};

// --- COMPONENT: ANIMATED STAT ---
const AnimatedStat = ({ number, label }: { number: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Box ref={ref} textAlign="center">
      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: { xs: '3.5rem', md: '6rem' }, 
          fontWeight: 200, 
          fontFamily: '"Playfair Display", serif',
          color: COLORS.terracotta,
          lineHeight: 1,
          mb: 1
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {number}
      </Typography>
      <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 'bold', color: COLORS.text }}>
        {label}
      </Typography>
    </Box>
  );
};

export default function AboutPageManifesto() {
  const locale = useLocale() as 'en' | 'fr' | 'ar';
  // Fallback to English if translation is missing, ensuring the page never breaks
  const content: AboutPageContent = siteConfig.textContent?.[locale]?.aboutPage || siteConfig.textContent.en.aboutPage;

  // Scroll Animations for Hero
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);

  return (
    <Box sx={{ bgcolor: COLORS.white, color: COLORS.text, overflowX: 'hidden' }}>

      {/* 1. HERO SECTION (Stick & Fade) */}
      <Box 
        ref={containerRef}
        sx={{ 
          height: '90vh', 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Background Layer */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image 
            src="/images/sahara-expedition-sunset.webp" // Keeping your existing high-quality asset
            alt="Moroccan Landscape"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: COLORS.overlay }} />
        </Box>

        {/* Text Layer (Animated) */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, zIndex: 1, textAlign: 'center', padding: '0 20px' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: '"Playfair Display", serif', 
              color: 'white', 
              fontSize: { xs: '2.5rem', md: '5rem' },
              maxWidth: '1000px',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)',
              fontWeight: 600
            }}
          >
            {content.title || "Born Between the Atlas and the Atlantic."}
          </Typography>
          
          {siteConfig.slogan && (
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mt: 2, letterSpacing: 1, textTransform: 'uppercase' }}>
              {siteConfig.slogan}
            </Typography>
          )}
        </motion.div>
      </Box>

      {/* 2. NARRATIVE BLOCK (The "Why") */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 15 } }}>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontFamily: '"Playfair Display", serif', 
            lineHeight: 1.6, 
            fontSize: { xs: '1.4rem', md: '2rem' },
            textAlign: 'center',
            color: COLORS.text
          }}
        >
           {/* Using paragraph1 as the "Manifesto" text */}
          "{content.paragraph1}"
        </Typography>
        
        {content.paragraph2 && (
          <Typography variant="body1" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            {content.paragraph2}
          </Typography>
        )}
      </Container>

      {/* 3. IMPACT SECTION (Static Stats for Trust) */}
      {/* Note: If these numbers aren't in your DB yet, we hardcode them as 'Marketing Assets' based on the report */}
      <Box sx={{ bgcolor: COLORS.sand, py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="center">
            <Grid  size={{xs: 12, md: 4}}>
              <AnimatedStat number="15k+" label="Travelers Guided" />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <AnimatedStat number="100%" label="Local Partners" />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <AnimatedStat number="4.9" label="Average Rating" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. TEAM GRID (The Curators) */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 15 } }}>
        <Box mb={8} textAlign="center">
          <Typography variant="overline" color="textSecondary" letterSpacing={3} fontWeight="bold">
            THE CURATORS
          </Typography>
          <Typography variant="h3" fontFamily='"Playfair Display", serif' sx={{ mt: 1 }}>
            {content.teamTitle || "Meet the Locals"}
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {content.teamMembers.map((member, idx) => (
            <Grid  key={idx} size={{xs: 12, sm: 6, md: 4}}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  height: 450, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: 3,
                  cursor: 'pointer',
                  '&:hover .reveal-overlay': { opacity: 1 },
                  '&:hover .member-img': { transform: 'scale(1.05)' }
                }}
              >
                {/* Image */}
                <Box 
                  className="member-img"
                  sx={{ width: '100%', height: '100%', position: 'relative', transition: 'transform 0.5s ease' }}
                >
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Box>

                {/* Info Card (Always Visible) */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    p: 3,
                    zIndex: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    color: 'white'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">{member.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{member.title}</Typography>
                </Box>

                {/* Secret Overlay (Hover Only) */}
                <Box 
                  className="reveal-overlay"
                  sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    bgcolor: 'rgba(200, 107, 82, 0.95)', // Terracotta overlay
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    p: 4,
                    textAlign: 'center',
                    color: 'white'
                  }}
                >
                  <FormatQuoteIcon sx={{ fontSize: 40, mb: 2, opacity: 0.8 }} />
                  {/* Using 'bio' as the secret/quote for now, as 'secret' might not exist in your DB yet */}
                  <Typography variant="h6" fontStyle="italic" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    "{member.bio ? member.bio.substring(0, 120) + "..." : "Ask me about the hidden dunes of Tamri."}"
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. SUSTAINABILITY (The Values) */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1, position: 'relative', minHeight: 400 }}>
          <Image 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?w=800" // Argan Tree Generic
            alt="Argan Tree Preservation"
            fill
            style={{ objectFit: 'cover' }} 
            loading="lazy"
          />
        </Box>
        <Box sx={{ flex: 1, bgcolor: '#f9f9f9', p: { xs: 6, md: 10 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ width: 60, height: 60, bgcolor: COLORS.sage, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
             <SpaIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h3" fontFamily='"Playfair Display", serif' gutterBottom>
            Preserving Paradise.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 500, lineHeight: 1.7 }}>
            We believe tourism should heal, not harm. That is why 1% of every booking goes directly to the Argan Biosphere Reserve protection fund.
          </Typography>
          {/* If you have specific values text in DB, you could map it here, but this static text is stronger for the 'Manifesto' vibe */}
          <Button 
            component={Link}
            href="/sustainability" 
            variant="outlined" 
            sx={{ 
                alignSelf: 'start', 
                borderColor: COLORS.text, 
                color: COLORS.text,
                '&:hover': { borderColor: COLORS.terracotta, color: COLORS.terracotta }
            }}
          >
            Read Our Impact Report
          </Button>
        </Box>
      </Box>

      {/* 6. FOOTER CTA */}
      <Box sx={{ bgcolor: COLORS.terracotta, color: 'white', py: 12, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h3" fontFamily='"Playfair Display", serif' gutterBottom>
            {content.ctaTitle || "You know our story. Let's write yours."}
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={5}>
            <Button 
              component={Link}
              href="/planning" // New Wizard Link
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: COLORS.terracotta, 
                px: 5, py: 1.5, 
                fontWeight: 'bold', 
                fontSize: '1rem',
                borderRadius: 50,
                '&:hover': { bgcolor: '#f0f0f0', transform: 'translateY(-2px)' } 
              }}
              endIcon={<ArrowForwardIcon />}
            >
              Start Planning
            </Button>
            
            <Button 
               component={Link}
               href="/contact"
               variant="outlined" 
               size="large"
               sx={{ 
                 borderColor: 'white', 
                 color: 'white', 
                 px: 5, py: 1.5, 
                 borderRadius: 50,
                 fontSize: '1rem',
                 '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } 
               }}
            >
              Chat with a Guide
            </Button>
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}