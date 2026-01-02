// -------------------------------------------------------------------------
// 3. UPDATED FILE: /src/app/[locale]/admin/(dashboard)/blog/create/page.tsx
// This file now conditionally renders based on siteConfig.hasBlogSystem.
// -------------------------------------------------------------------------
import CreateArticleForm from "@/components/admin/CreateArticleForm";
import { Box, Typography, Paper } from "@mui/material";
import { notFound } from "next/navigation"; // <-- NEW: Import notFound
import { siteConfig } from '@/config/client-data';
import { getTranslations } from "next-intl/server"; // <-- NEW: Import getTranslations (for potential future error message)

export default async function CreateArticlePage() { // Make component async
  // RECTIFICATION: If blog system is globally disabled, show 404
  if (!siteConfig.hasBlogSystem) {
    notFound(); 
  }

  // You might fetch translations for "Create New Article" here if needed
  const t = await getTranslations('admin.AdminBlogCreatePage'); // Assuming you'd add this namespace

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('createArticleTitle') || 'Create New Article'} {/* RECTIFICATION: Use translation */}
      </Typography>
      <Paper sx={{ p: 4, bgcolor: 'background.paper' }}>
        <CreateArticleForm />
      </Paper>
    </Box>
  );
}