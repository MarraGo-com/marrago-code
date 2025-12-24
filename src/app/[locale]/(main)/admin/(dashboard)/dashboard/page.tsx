// src/app/[locale]/admin/(dashboard)/dashboard/page.tsx
import { Box, Typography } from "@mui/material";
import ExperiencesTable from "@/components/admin/ExperiencesTable";
import CreateExperience from "@/components/admin/CreateExperience";
import { adminDb } from "@/lib/firebase-admin";
import { Experience } from "@/types/experience";
import { notFound } from "next/navigation";
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server";

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
        
        // ▼▼▼ FIX: Add the Missing Strict Fields ▼▼▼
        durationValue: data.durationValue || 0,
        durationUnit: data.durationUnit || 'hours',
        // ▲▲▲
        
        duration: data.duration || 'N/A', // Keep if your type still has the optional string
        coverImage: data.coverImage || '',
        galleryImages: data.galleryImages || [],
        translations: data.translations || {},
        
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
        
        status: data.status || 'draft',
        
        maxGuests: data.maxGuests || null, 
        startTimes: data.startTimes || [],
        languages: data.languages || [],
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        
        // Ensure complex objects are at least null if missing
        bookingPolicy: data.bookingPolicy || null,
        scarcity: data.scarcity || null,
        features: data.features || null,
      };
    }) as unknown as Experience[]; // <--- FIX: Double cast solves the overlap error

    return experiences;
  } catch (error) {
    console.error("Error fetching experiences for admin:", error);
    return [];
  }
}

// The page component is async
type Params = Promise<{ locale: string }>;

export default async function AdminExperiencesDashboardPage({ params }: { params: Params }) { 
  if (
    !siteConfig.hasExperiencesSection &&
    !siteConfig.hasBlogSystem &&
    !siteConfig.hasBookingEngine &&
    !siteConfig.hasReviewsSystem 
  ) {
    notFound(); 
  }

  const { locale } = await params;
  const experiences = await getExperiences(locale);
  const t = await getTranslations('admin.AdminExperiencesPage'); 

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {t('manageExperiencesTitle') || 'Manage Experiences'} 
        </Typography>
        <CreateExperience />
      </Box>
      
      <ExperiencesTable experiences={experiences} />
    </Box>
  );
}