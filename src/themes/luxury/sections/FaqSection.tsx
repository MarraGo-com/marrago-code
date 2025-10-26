// src/themes/luxury/sections/FaqSection.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslations } from 'next-intl';

export default function FaqSection() {
  const t = useTranslations('FaqPage'); // Assuming translations for FAQ content

  const faqs = [
    {
      question: t('faqLuxuryQuestion1'),
      answer: t('faqLuxuryAnswer1'),
    },
    {
      question: t('faqLuxuryQuestion2'),
      answer: t('faqLuxuryAnswer2'),
    },
    {
      question: t('faqLuxuryQuestion3'),
      answer: t('faqLuxuryAnswer3'),
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0d1117' /* Dark background */, color: '#f0f6fc' /* Light text */ }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#E0B64D' /* Gold-like color */ }}>
          {t('faqTitleLuxury')}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 6, color: '#d3d3d3' /* Lighter grey */ }}>
          Experience the **LUXURY** FAQ Section.
        </Typography>

        {faqs.map((faq, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#E0B64D' }} />} sx={{ px: 0 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#f0f6fc' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <Typography variant="body1" sx={{ color: '#a8b3cf' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', mt: 2 }} />
          </Box>
        ))}
      </Container>
    </Box>
  );
}