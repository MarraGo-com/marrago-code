// src/themes/adventure/sections/FaqSection.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslations } from 'next-intl';

export default function FaqSection() {
  const t = useTranslations('FaqPage'); // Assuming translations for FAQ content

  const faqs = [
    {
      question: t('faqAdventureQuestion1'),
      answer: t('faqAdventureAnswer1'),
    },
    {
      question: t('faqAdventureQuestion2'),
      answer: t('faqAdventureAnswer2'),
    },
    {
      question: t('faqAdventureQuestion3'),
      answer: t('faqAdventureAnswer3'),
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F0F4C3' /* Light Greenish background */ }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#689F38' /* Dark Green */ }}>
            {t('faqTitleAdventure')}
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 6, color: '#8BC34A' /* Medium Green */ }}>
            Explore the **ADVENTURE** FAQ Section!
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2, boxShadow: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FFB300' /* Amber */ }} />} sx={{ bgcolor: '#FFFDE7' /* Light Yellow */, borderRadius: 2, borderBottom: '1px solid #FFECB3' }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#689F38' /* Dark Green */ }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#F9FBE7' /* Very Light Green */, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }}>
                <Typography variant="body1" sx={{ color: '#7CB342' /* Green */ }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}