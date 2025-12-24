// -------------------------------------------------------------------------
// 3. UPDATED FILE: /src/app/[locale]/booking-cancelled/page.tsx
// This page is also updated to use the new button component.
// -------------------------------------------------------------------------

import { Box as CancelBox, Typography as CancelTypography, Container as CancelContainer, Paper as CancelPaper } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const theme = process.env.NEXT_PUBLIC_THEME || 'default';
// Dynamically import Header and Footer components  
const BackToExperiencesButton = dynamic(() => import(`@/themes/${theme}/ui/BackToExperiencesButton`));

export default async function BookingCancelledPage() {
  const t = await getTranslations('BookingStatusPage');

  return (
    <CancelBox sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* <Header /> */}
      <main className="flex-grow">
        <CancelContainer maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
          <CancelPaper sx={{ p: 4 }}>
            <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <CancelTypography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {t('cancelledTitle')}
            </CancelTypography>
            <CancelTypography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              {t('cancelledSubtitle')}
            </CancelTypography>
            <BackToExperiencesButton /> {/* <-- Use the new button component */}
          </CancelPaper>
        </CancelContainer>
      </main>
      {/* <Footer /> */}
    </CancelBox>
  );
}