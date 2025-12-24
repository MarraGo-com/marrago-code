
// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/app/[locale]/booking-success/page.tsx
// This page now imports and uses our new Client Component.
// -------------------------------------------------------------------------
import { Box, Typography, Container, Paper } from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// Dynamically import Header and Footer components  
const BackToExperiencesButton = dynamic(() => import(`@/themes/${theme}/ui/BackToExperiencesButton`));

export default async function BookingSuccessPage() {
  const t = await getTranslations('BookingStatusPage');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
     {/*  <Header /> */}
      <main className="flex-grow">
        <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
          <Paper sx={{ p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('successTitle')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              {t('successSubtitle')}
            </Typography>
            <BackToExperiencesButton /> {/* <-- Use the new button component */}
          </Paper>
        </Container>
      </main>
     {/*  <Footer /> */}
    </Box>
  );
}