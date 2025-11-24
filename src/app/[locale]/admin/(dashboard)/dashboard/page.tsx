// src/app/[locale]/admin/(dashboard)/dashboard/page.tsx
// This file is now conditioned based on siteConfig.hasExperiencesSection.

import { Box, Typography } from "@mui/material";
import ExperiencesTable from "@/components/admin/ExperiencesTable";
import CreateExperience from "@/components/admin/CreateExperience";
import { adminDb } from "@/lib/firebase-admin";
import { Experience } from "@/types/experience";
import { notFound } from "next/navigation"; // <-- NEW: Import notFound
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server"; // <-- NEW: Import getTranslations

// This function runs on the server to get all experiences
async function getExperiences(locale: string) {
  try {
    const experiencesSnapshot = await adminDb.collection('experiences').orderBy('createdAt', 'desc').get();
    
    const experiences = experiencesSnapshot.docs.map(doc => {
      const data = doc.data();
      const title = data.translations?.[locale]?.title || data.translations?.en?.title || 'No Title Available';
      const description = data.translations?.[locale]?.description || data.translations?.en?.description || '';
    return {
    id: doc.id,
    title,
    description,
    price: data.price || { amount: 0, currency: 'EUR', prefix: 'from' },
    locationId: data.locationId || 'unknown',
    tags: data.tags || [],
    duration: data.duration || 'N/A',
    coverImage: data.coverImage || '',
    galleryImages: data.galleryImages || [],
    translations: data.translations || {},
    
    // 👇 ADD THESE LINES
    // Check if data.createdAt exists, convert Firestore Timestamp to string (or Date)
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
    
    // Add any other missing fields required by your type (e.g., isActive, maxGuests)
    maxGuests: data.maxGuests || null, 
    startTimes: data.startTimes || [],
    languages: data.languages || [],
    latitude: data.latitude || null,
    longitude: data.longitude || null
  };
}) as Experience[];

    return experiences;
  } catch (error) {
    console.error("Error fetching experiences for admin:", error);
    return [];
  }
}

// The page component is async
type Params = Promise<{ locale: string }>;
export default async function AdminExperiencesDashboardPage({ params }: { params: Params }) { // Renamed for clarity
  // RECTIFICATION: If experiences section is globally disabled, show 404
  if (
    !siteConfig.hasExperiencesSection &&
    !siteConfig.hasBlogSystem &&
    !siteConfig.hasBookingEngine &&
    !siteConfig.hasReviewsSystem 
    
  ) {
    notFound(); 
  }

  // Await the params to get the locale
  const { locale } = await params;
  const experiences = await getExperiences(locale);
  const t = await getTranslations('admin.AdminExperiencesPage'); // Assuming you'd add this namespace

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {t('manageExperiencesTitle') || 'Manage Experiences'} {/* RECTIFICATION: Use translation */}
        </Typography>
        <CreateExperience />
      </Box>
      
      <ExperiencesTable experiences={experiences} />
    </Box>
  );
}