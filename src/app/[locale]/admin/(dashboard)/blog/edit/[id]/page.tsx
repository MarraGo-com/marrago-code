// /src/app/[locale]/admin/(dashboard)/blog/edit/[id]/page.tsx
import { Box, Typography, Paper } from "@mui/material";
import EditArticleForm from "@/components/admin/EditArticleForm";
import { adminDb } from "@/lib/firebase-admin";
import { notFound } from "next/navigation"; // <-- NEW: Import notFound
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server"; // <-- NEW: Import getTranslations

// This server-side function fetches the data for the specific article we want to edit.
async function getArticle(id: string) {
  try {
    const docRef = adminDb.collection('articles').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }
    
    const data = docSnap.data();
    if (!data) return null;

    // We must serialize any Timestamps to strings before passing to a Client Component
    const createdAt = data.createdAt ? data.createdAt.toDate().toISOString() : null;
    const updatedAt = data.updatedAt ? data.updatedAt.toDate().toISOString() : null;

    // --- THIS IS THE KEY FIX ---
    // We now spread the original `data` object to include all fields
    // like slug, status, translations, etc., before overriding the timestamps.
    return {
      id: docSnap.id,
      ...data,
      slug: data.slug ?? "",
      status: data.status ?? "",
      translations: data.translations ?? {},
      createdAt,
      updatedAt,
    };
  } catch (error) {
    console.error("Error fetching single article:", error);
    return null;
  }
}

// We define the types for the props directly in the function signature.
type Params = Promise<{ id: string}>;
export default async function EditArticlePage({ 
  params 
}: { 
  params: Params
}) {
  // RECTIFICATION: If blog system is globally disabled, show 404
  if (!siteConfig.hasBlogSystem) {
    notFound(); 
  }

  const { id } = await params; 
  const article = await getArticle(id);
  const t = await getTranslations('admin.AdminBlogEditPage'); // Assuming you'd add this namespace

  if (!article) {
    return (
      <Box>
        <Typography variant="h4">{t('articleNotFound') || 'Article not found.'}</Typography> {/* RECTIFICATION: Use translation */}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('editArticleTitle') || 'Edit Article'} {/* RECTIFICATION: Use translation */}
      </Typography>
      <Paper sx={{ p: 4, bgcolor: 'background.paper' }}>
        <EditArticleForm article={article} />
      </Paper>
    </Box>
  );
}