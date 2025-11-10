'use client'; // This is a Client Component

import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import { Box, Container, Typography } from '@mui/material';

// --- Helper Component for Lists ---
type ListPoint = {
  label?: string;
  text: string;
};

// This component is a bit smarter to handle different list types
const RenderList = ({ items }: { items: (string | ListPoint)[] }) => (
  <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
    {items.map((item, index) => {
      // Check if item is a simple string or a label/text object
      const isString = typeof item === 'string';
      const label = isString ? undefined : (item as ListPoint).label;
      const text = isString ? item : (item as ListPoint).text;

      return (
      <li key={label || index} style={{ marginBottom: '0.5rem' }}>
        {label && <Typography component="span" sx={{ fontWeight: 'bold' }}>{label} </Typography>}
        {text}
      </li>
      );
    })}
  </ul>
);

// --- Main Page Component ---
export default function TermsOfUseClient() {
  const t = useTranslations('TermsPage');
  
  // Get dynamic values from siteConfig
  const dynamicValues = {
    officialName: siteConfig.brandName, // e.g., "MarraGo Travel SARL"
    brandName: siteConfig.siteName, // e.g., "MarraGo"
    email: siteConfig.contact.email
  };

  // Define the order of sections
  const sections = [
    'agreement',
    'services',
    'bookingsPayments',
    'cancellationsRefunds',
    'yourResponsibilities',
    'liability',
    'itineraryChanges',
    'governingLaw',
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box component="header" sx={{ mb: 4, borderBottom: 1, borderColor: 'divider', pb: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom>
          {t('title')}
        </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        {t('lastUpdated')}
      </Typography>
      </Box>

      {sections.map((sectionKey) => {
        const title = t(`sections.${sectionKey}.title`, dynamicValues);
        const sectionContent = t.raw(`sections.${sectionKey}`);

        // Check *if* the keys exist in the JSON
        const hasText = sectionContent.hasOwnProperty('text');
        const hasIntro = sectionContent.hasOwnProperty('intro');
        const hasOutro = sectionContent.hasOwnProperty('outro');
        const hasPoints = sectionContent.hasOwnProperty('points');
        const hasSubsections = sectionContent.hasOwnProperty('subsections');

        return (
          <Box component="section" key={sectionKey} sx={{ mb: 3 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {title}
            </Typography>
            
            {hasIntro && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.intro`, dynamicValues)}</Typography>}
            {hasText && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.text`, dynamicValues)}</Typography>}
            
            {/* Render 'points' (e.g., for Bookings & Payments) */}
            {hasPoints && (
              <RenderList 
                items={Object.values(t.raw(`sections.${sectionKey}.points`))} 
              />
            )}

            {/* Render 'subsections' (e.g., for Cancellations) */}
            {hasSubsections && (
              Object.values(t.raw(`sections.${sectionKey}.subsections`)).map((sub: any, index: number) => (
                <Box key={index} sx={{ mt: 2, pl: 2 }}>
                  <Typography variant="h6" component="h4" gutterBottom>{sub.title}</Typography>
                  {sub.text && <Typography variant="body1" paragraph>{sub.text}</Typography>}
                  {sub.points && <RenderList items={sub.points} />}
                </Box>
              ))
            )}

            {hasOutro && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.outro`, dynamicValues)}</Typography>}
          </Box>
        );
      })}
    </Container>
  );
}