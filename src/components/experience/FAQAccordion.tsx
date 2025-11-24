// /src/components/experience/FAQAccordion.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// Import the FAQItem type
import { FAQItem } from '@/types/experience';
// ▼▼▼ NEW IMPORT ▼▼▼
import { useTranslations } from 'next-intl';

// Define the props to accept real data
interface FAQAccordionProps {
  faqs?: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const theme = useTheme();
  // ▼▼▼ GET TRANSLATIONS ▼▼▼
  const t = useTranslations('ExperienceDetailsNew');
  const [expanded, setExpanded] = useState<string | false>(false);

  // Global Check: If no FAQs are provided, don't render anything
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ my: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <HelpOutlineIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: '2rem' }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          {/* ▼▼▼ TRANSLATED ▼▼▼ */}
          {t('faqTitle')}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
        {/* Map over the passed FAQs prop */}
        {faqs.map((faq, index) => {
          // Create a unique ID for each panel
          const panelId = `panel${index}`;
          return (
            <Accordion
              key={index}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
              disableGutters
              elevation={0}
              sx={{
                '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` },
                '&:before': { display: 'none' }, // Removes default MUI separator
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                aria-controls={`${panelId}bh-content`}
                id={`${panelId}bh-header`}
                sx={{
                  py: 1,
                  '& .MuiAccordionSummary-content': { my: 2 },
                  '&.Mui-expanded': { minHeight: 64, bgcolor: theme.palette.action.hover }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, pt: 1, bgcolor: 'background.default' }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}