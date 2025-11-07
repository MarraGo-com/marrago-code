// /src/components/admin/CreateArticleForm.tsx
'use client';

import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, Alert, Tabs, Tab 
} from '@mui/material';
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

// A simple function to generate a URL-friendly slug from a title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
    .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
};

export default function CreateArticleForm() {
  const router = useAppRouter();
  
  // --- 1. STATE UPDATED to match the new multilingual structure ---
  const [formData, setFormData] = useState({
    slug: '',
    status: 'draft' as 'draft' | 'published',
    translations: {
      en: { title: '', content: '' },
      fr: { title: '', content: '' },
      es: { title: '', content: '' } // <-- ADDED THIS LINE
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'en' | 'fr' | 'es'>('en'); // To manage which language tab is active

  // --- 2. UPDATED HANDLERS for the new data structure ---
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    // Update the title for the current language tab
    const newTranslations = {
      ...formData.translations,
      [currentTab]: { ...formData.translations[currentTab], title: newTitle }
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));

    // Auto-generate slug only when editing the English title for consistency
    if (currentTab === 'en') {
      setFormData(prev => ({ ...prev, slug: generateSlug(newTitle) }));
    }
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = event.target.value;
    const newTranslations = {
      ...formData.translations,
      [currentTab]: { ...formData.translations[currentTab], content: newContent }
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
    try {
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
    } catch {
      setError('Failed to compress image.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile || !formData.translations.en.title || !formData.slug) {
      setError("English Title, Slug, and a Cover Image are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const nameWithoutExtension = imageFile.name.split('.').slice(0, -1).join('.');
      const newFileName = `${Date.now()}_${nameWithoutExtension}.webp`;
      const storageRef = ref(storage, `articles/${newFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      const coverImage = await getDownloadURL((await uploadTask).ref);

      // We now send the entire formData object which has the correct structure
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coverImage }),
      });

      if (!response.ok) {
        throw new Error('Failed to create article.');
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
      {/* --- 3. NON-TRANSLATABLE FIELDS --- */}
      <TextField
        required
        label="URL Slug"
        value={formData.slug}
        onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
        fullWidth
        helperText="Auto-generated from English title. Can be edited."
      />
      <FormControl fullWidth>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          value={formData.status}
          label="Status"
          onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as 'draft' | 'published'}))}
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" component="label">
        Upload Cover Image
        <input type="file" hidden required accept="image/*" onChange={handleFileChange} />
      </Button>
      {imageFile && <Typography variant="body2">{imageFile.name}</Typography>}
      
      {/* --- 4. TRANSLATABLE FIELDS WITH TABS --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="English Content" value="en" />
            <Tab label="French Content" value="fr" />
            <Tab label="Spanish Content" value="es" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          required={currentTab === 'en'} // English title is required
          label="Article Title"
          value={formData.translations[currentTab].title}
          onChange={handleTitleChange}
          fullWidth
        />
        <TextField
          required={currentTab === 'en'} // English content is required
          label="Article Content"
          value={formData.translations[currentTab].content}
          onChange={handleContentChange}
          fullWidth
          multiline
          rows={15}
          helperText="You can use Markdown for formatting."
        />
      </Box>
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Article'}
        </Button>
      </Box>
    </Box>
  );
}
