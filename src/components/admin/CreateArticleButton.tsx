// 1. NEW FILE: /src/components/admin/CreateArticleButton.tsx
// Fixed: Now uses translations
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import AddIcon from '@mui/icons-material/Add';
import { useTranslations } from 'next-intl';

export default function CreateArticleButton() {
  // Access the 'admin' namespace defined in your JSON
  const t = useTranslations('admin.AdminBlogCreatePage');

  return (
    <Button
      variant="contained"
      component={Link}
      href="/admin/blog/create"
      startIcon={<AddIcon />}
    >
      {/* Renders "Create New Article" (EN), "Créer un nouvel article" (FR), etc. */}
      {t('createArticleTitle')}
    </Button>
  );
}