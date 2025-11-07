// -------------------------------------------------------------------------
// STEP 2: Create the "Edit Article" Form Component
// File Path: /src/components/admin/EditArticleForm.tsx
// -------------------------------------------------------------------------
'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { useAppRouter } from '@/hooks/router/useAppRouter';

const generateSlug = (title: string) => {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
};

interface ArticleTranslation {
  title: string;
  content: string;
}

interface Article {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  translations: {
    en: ArticleTranslation;
    fr: ArticleTranslation;
    es?: ArticleTranslation;
  };
}

export default function EditArticleForm({ article }: { article: Article }) {
  const router = useAppRouter();
  
  const [formData, setFormData] = useState({
    slug: '',
    status: 'draft' as 'draft' | 'published',
    translations: {
      en: { title: '', content: '' },
      fr: { title: '', content: '' },
      es: { title: '', content: '' } // <-- ADDED THIS LINE
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'en' | 'fr' | 'es'>('en');

  useEffect(() => {
    if (article) {
      setFormData({
        slug: article.slug || '',
        status: article.status || 'draft',
        translations: {
          en: article.translations.en || { title: '', content: '' },
          fr: article.translations.fr || { title: '', content: '' },
          es: article.translations.es || { title: '', content: ''} // <-- ADDED THIS LINE
        }
      });
    }
  }, [article]);

  const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newTranslations = { ...formData.translations, [currentTab]: { ...formData.translations[currentTab], [name]: value } };
    setFormData(prev => ({ ...prev, translations: newTranslations }));

    if (name === 'title' && currentTab === 'en') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.translations.en.title || !formData.slug) {
      setError("English Title and Slug are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update article.');
      }

      router.push('/admin/blog');

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField required label="URL Slug" value={formData.slug} onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} fullWidth />
      <FormControl fullWidth>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select labelId="status-select-label" value={formData.status} label="Status" onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as 'draft' | 'published'}))}>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="English Content" value="en" />
            <Tab label="French Content" value="fr" />
            <Tab label="Spanish Content" value="es" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField required={currentTab === 'en'} label="Article Title" name="title" value={formData.translations[currentTab].title} onChange={handleTranslationChange} fullWidth />
        <TextField required={currentTab === 'en'} label="Article Content" name="content" value={formData.translations[currentTab].content} onChange={handleTranslationChange} fullWidth multiline rows={15} />
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}