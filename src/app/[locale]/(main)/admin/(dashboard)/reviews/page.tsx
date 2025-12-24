// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/app/[locale]/admin/(dashboard)/reviews/page.tsx
// This is the main page for managing customer reviews, now conditionally
// rendered based on siteConfig.hasReviewsSystem.
// -------------------------------------------------------------------------
import { Box, Typography } from "@mui/material";
import ReviewsTable from "@/components/admin/ReviewsTable";
import { Review } from "@/types/review";
import { getAllAdminReviews } from "@/lib/data";
import { notFound } from "next/navigation"; // <-- NEW: Import notFound
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server"; // <-- NEW: Import getTranslations

export default async function ReviewsAdminPage() {
  // RECTIFICATION: If review system is globally disabled, show 404
  if (!siteConfig.hasReviewsSystem) {
    notFound(); 
  }

  const reviews = (await getAllAdminReviews()) as Review[];
  const t = await getTranslations('admin.AdminReviewsPage'); // Assuming you'd add this namespace

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('manageReviewsTitle') || 'Manage Customer Reviews'} {/* RECTIFICATION: Use translation */}
      </Typography>
      
      <ReviewsTable reviews={reviews} />
    </Box>
  );
}