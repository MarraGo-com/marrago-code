'use client'; // This is a Client Component

import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data';
import { Box, Container, Typography } from '@mui/material';

// --- Helper Component for Lists ---
type ListPoint = {
  label: string;
  text: string;
};

const RenderList = ({ points }: { points: ListPoint[] }) => (
  <ul style={{ marginTop: '0.5rem', paddingLeft: '2rem' }}>
    {points.map((point) => (
      <li key={point.label} style={{ marginBottom: '0.5rem' }}>
        <Typography component="span" sx={{ fontWeight: 'bold' }}>{point.label}</Typography> {point.text}
      </li>
    ))}
  </ul>
);

// --- Main Page Component ---
export default function PrivacyPolicyClient() {
  const t = useTranslations('PrivacyPage');
  
  // Get dynamic values from siteConfig
  const dynamicValues = {
    officialName: siteConfig.brandName, // e.g., "MarraGo Travel SARL"
    brandName: siteConfig.siteName, // e.g., "MarraGo"
    email: siteConfig.contact.email
  };

  // Define the order of sections
  const sections = [
    'introduction',
    'dataController',
    'dataCollected',
    'howWeUseData',
    'dataSharing',
    'dataRetention',
    'yourRights',
    'cookies',
    'policyUpdates',
    'contactUs',
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

      {/* --- UPDATED RENDERING LOGIC --- */}
      {sections.map((sectionKey) => {
        // Get the title (this is always present)
        const title = t(`sections.${sectionKey}.title`, dynamicValues);
        
        // Get the raw content for this section
        const sectionContent = t.raw(`sections.${sectionKey}`);

        // Check *if* the keys exist in the JSON
        const hasText = sectionContent.hasOwnProperty('text');
        const hasIntro = sectionContent.hasOwnProperty('intro');
        const hasOutro = sectionContent.hasOwnProperty('outro');
        const hasPoints = sectionContent.hasOwnProperty('points');
        
        const pointsArray: ListPoint[] = hasPoints 
          ? Object.keys(sectionContent.points).map(key => {
              const p = t.raw(`sections.${sectionKey}.points.${key}`);
              // Manually replace placeholders in 'points' text
              return {
                label: p.label,
                text: p.text.replace(/{email}/g, dynamicValues.email)
              };
            })
          : [];

        return (
          <Box component="section" key={sectionKey} sx={{ mb: 3 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              {title}
            </Typography>
            
            {/* Only render the key if it exists in the JSON */}
            {hasIntro && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.intro`, dynamicValues)}</Typography>}
            {hasText && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.text`, dynamicValues)}</Typography>}
            {hasPoints && <RenderList points={pointsArray} />}
            {hasOutro && <Typography variant="body1" paragraph>{t(`sections.${sectionKey}.outro`, dynamicValues)}</Typography>}
          </Box>
        );
      })}
    </Container>
  );
}