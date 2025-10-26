// src/themes/default/sections/FaqSection.tsx
'use client';

import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslations } from 'next-intl';

export default function FaqSection() {
  const t = useTranslations('FaqPage'); // Assuming translations for FAQ content

  const faqs = [
    {
      question: t('faqDefaultQuestion1'),
      answer: t('faqDefaultAnswer1'),
    },
    {
      question: t('faqDefaultQuestion2'),
      answer: t('faqDefaultAnswer2'),
    },
    {
      question: t('faqDefaultQuestion3'),
      answer: t('faqDefaultAnswer3'),
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          {t('faqTitleDefault')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 6 }}>
          This is the **DEFAULT** FAQ Section.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 2, boxShadow: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}