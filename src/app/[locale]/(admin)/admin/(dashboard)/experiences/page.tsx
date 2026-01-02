// src/app/[locale]/(admin)/admin/experiences/page.tsx
import React from 'react';
import { Box, Typography, Container } from "@mui/material";
import ExperiencesTable from "@/components/admin/ExperiencesTable";
import CreateExperience from "@/components/admin/CreateExperience";
import { adminDb } from "@/lib/firebase-admin";
import { Experience } from "@/types/experience";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// --- FETCH DATA (Server Side) ---
async function getExperiences(locale: string) {
  try {
    const experiencesSnapshot = await adminDb.collection('experiences').orderBy('createdAt', 'desc').get();
    
    const experiences = experiencesSnapshot.docs.map(doc => {
      const data = doc.data();
      const title = data.translations?.[locale]?.title || data.translations?.en?.title || 'No Title Available';
      
      return {
        id: doc.id,
        title,
        description: data.translations?.[locale]?.description || '',
        price: data.price || { amount: 0, currency: 'EUR' },
        locationId: data.locationId || 'unknown',
        tags: data.tags || [],
        durationValue: data.durationValue || 0,
        durationUnit: data.durationUnit || 'hours',
        duration: data.duration || 'N/A', 
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
        bookingPolicy: data.bookingPolicy || null,
        features: data.features || null,
      };
    }) as unknown as Experience[]; 

    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

// --- PAGE COMPONENT ---
type Params = Promise<{ locale: string }>;

export default async function AdminExperiencesPage({ params }: { params: Params }) { 
  const { locale } = await params;
  const experiences = await getExperiences(locale);
  const t = await getTranslations('admin.AdminExperiencesPage'); 

  return (
    <Container maxWidth="xl" disableGutters>
      {/* HEADER: Title + Add Button */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on desktop
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2,
        mb: 4 
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
          {t('manageExperiencesTitle') || 'All Experiences'} 
        </Typography>
        <CreateExperience />
      </Box>
      
      {/* THE TABLE (Will auto-switch to Cards on mobile) */}
      <ExperiencesTable experiences={experiences} />
    </Container>
  );
}