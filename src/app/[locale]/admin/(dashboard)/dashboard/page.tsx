// src/app/[locale]/admin/(dashboard)/dashboard/page.tsx

import { Box, Typography } from "@mui/material";
import ExperiencesTable from "@/components/admin/ExperiencesTable";
import CreateExperience from "@/components/admin/CreateExperience";
import { adminDb } from "@/lib/firebase-admin";
import { Experience } from "@/types/experience";




// Define the comprehensive shape of our data that the child components need


// This function runs on the server to get all experiences
async function getExperiences(locale: string) {
  try {
    // Use the correct Admin SDK syntax to get and order the collection
    const experiencesSnapshot = await adminDb.collection('experiences').orderBy('createdAt', 'desc').get();
    
    const experiences = experiencesSnapshot.docs.map(doc => {
      const data = doc.data();
       // --- THIS IS THE KEY FIX ---
      // 1. Try to get the title for the current locale (e.g., 'fr').
      // 2. If it doesn't exist, fall back to the English title.
      // 3. If that also doesn't exist, show a default message.
      const title = data.translations?.[locale]?.title || data.translations?.en?.title || 'No Title Available';
      const description = data.translations?.[locale]?.description || data.translations?.en?.description || '';
      return {
        id: doc.id,
        // We pull the English title and description out for display in the admin table.
        title,
        description,

        // --- THIS IS THE KEY FIX ---
        // Pass the structured price object and the correct locationId
        price: data.price || { amount: 0, currency: 'MAD', prefix: 'from' },
        locationId: data.locationId || 'unknown', // Pass the ID, not a string 'N/A'
        tags: data.tags || [], // Ensure tags is an array
        duration: data.duration || 'N/A', // Ensure duration is present
        coverImage: data.coverImage || '',
        galleryImages: data.galleryImages || [], // Ensure galleryImages is an array
        translations: data.translations || {},
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
export default async function DashboardPage({ params }: { params: Params }) {
  // Await the params to get the locale
  const { locale } = await params;
  const experiences = await getExperiences(locale);

  return (
    <Box>
      
      {/* Improved layout for the header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Experiences
        </Typography>
        <CreateExperience />
      </Box>
      
      {/* Pass the fully prepared data to the table */}
      <ExperiencesTable experiences={experiences} />
    </Box>
  );
}
