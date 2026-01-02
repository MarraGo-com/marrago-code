// src/components/admin/CreateArticleForm.tsx
'use client';

import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, Tabs, Tab, useMediaQuery, useTheme
} from '@mui/material';
import { CloudUpload, ContentCopy, DeleteSweep } from '@mui/icons-material';
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};

export default function CreateArticleForm() {
  const t = useTranslations('admin.blog');
  const router = useAppRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // 1. FORM STATE
  const [formData, setFormData] = useState({
    slug: '',
    status: 'draft' as 'draft' | 'published',
    translations: {
      en: { title: '', content: null as any },
      fr: { title: '', content: null as any },
      es: { title: '', content: null as any }
    }
  });

  // 2. IMAGE STATE
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'en' | 'fr' | 'es'>('en');

  // --- HANDLERS ---

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    const newTranslations = {
      ...formData.translations,
      [currentTab]: { ...formData.translations[currentTab], title: newTitle }
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));

    if (currentTab === 'en') {
      setFormData(prev => ({ ...prev, slug: generateSlug(newTitle) }));
    }
  };

  const handleEditorChange = (newContentJson: any) => {
    const newTranslations = {
      ...formData.translations,
      [currentTab]: { ...formData.translations[currentTab], content: newContentJson }
    };
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
      const compressedFile = await imageCompression(file, options);
      
      setImageFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile)); 
      toast.success("Image uploaded & compressed!");
    } catch {
      toast.error('Failed to compress image.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
        toast.error(`⚠️ ${t('messages.imageRequired')}`, { duration: 4000 });
        return; 
    }
    if (!formData.translations.en.title) {
        toast.error(`⚠️ ${t('messages.titleRequired')}`, { duration: 4000 });
        return;
    }
    if (!formData.slug) {
        toast.error(`⚠️ ${t('messages.slugRequired')}`, { duration: 4000 });
        return;
    }

    setLoading(true);
    const toastId = toast.loading(t('buttons.creating'));

    try {
      // 1. Upload Image
      const nameWithoutExtension = imageFile.name.split('.').slice(0, -1).join('.');
      const newFileName = `${Date.now()}_${nameWithoutExtension}.webp`;
      const storageRef = ref(storage, `articles/${newFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      const coverImage = await getDownloadURL((await uploadTask).ref);

      // 2. Send to API
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coverImage }),
      });

      if (!response.ok) {
        throw new Error('Failed to create article.');
      }

      toast.success(t('messages.createdSuccess'), { id: toastId });
      
      setTimeout(() => {
          router.push('/admin/blog');
      }, 1000);

    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to create article.", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Toaster position="top-center" />

      {/* TOP SECTION: SLUG & STATUS (Stacked on Mobile) */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
            required
            label={t('labels.slug')}
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
            fullWidth
            helperText={t('labels.slugHelper')}
        />
        <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('labels.status')}</InputLabel>
            <Select
                value={formData.status}
                label={t('labels.status')}
                onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as 'draft' | 'published'}))}
            >
                <MenuItem value="draft">{t('statusOptions.draft')}</MenuItem>
                <MenuItem value="published">{t('statusOptions.published')}</MenuItem>
            </Select>
        </FormControl>
      </Box>

      {/* IMAGE UPLOAD UI */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{t('labels.coverImage')} *</Typography>
         
         {previewUrl ? (
             <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 250, borderRadius: 2, overflow: 'hidden', mb: 2, border: '1px solid #eee' }}>
                <Image 
                  src={previewUrl} 
                  alt="Cover Preview" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  priority 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
                 <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s', '&:hover': { opacity: 1 } }}>
                    <Button variant="contained" component="label" size="small" startIcon={<CloudUpload />}>
                        {t('labels.changeImage')}
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                 </Box>
             </Box>
         ) : (
            <Button variant="outlined" component="label" fullWidth sx={{ height: 100, borderStyle: 'dashed' }}>
                {t('labels.uploadImage')}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
         )}
      </Box>
      
      {/* TABS WITH TOOLS */}
      <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          pr: 1 
      }}>
        <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ maxWidth: { xs: '100%', sm: '60%' } }}
        >
            <Tab label="English" value="en" />
            <Tab label="Français" value="fr" />
            <Tab label="Español" value="es" />
        </Tabs>

        {/* COPY & CLEAR TOOLS */}
        {currentTab !== 'en' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: { xs: 1, sm: 0 } }}>
                <Button 
                    size="small" 
                    startIcon={<DeleteSweep />}
                    color="error"
                    onClick={() => {
                        if(!confirm(t('messages.confirmClear'))) return;
                        setFormData(prev => ({
                            ...prev,
                            translations: {
                                ...prev.translations,
                                [currentTab]: { title: '', content: null }
                            }
                        }));
                        toast.success(t('messages.cleared', { lang: currentTab.toUpperCase() }));
                    }}
                >
                    {t('buttons.clear')}
                </Button>
                <Button 
                    size="small" 
                    startIcon={<ContentCopy />}
                    color="secondary"
                    onClick={() => {
                        const enContent = formData.translations.en.content;
                        const enTitle = formData.translations.en.title;
                        
                        if (!enContent) {
                            toast.error(t('messages.copyError'));
                            return;
                        }

                        // Deep copy to prevent linking
                        const deepClone = JSON.parse(JSON.stringify(enContent));

                        setFormData(prev => ({
                            ...prev,
                            translations: {
                                ...prev.translations,
                                [currentTab]: { 
                                    title: prev.translations[currentTab].title || enTitle,
                                    content: deepClone
                                }
                            }
                        }));
                        toast.success(t('messages.copied', { lang: currentTab.toUpperCase() }));
                    }}
                >
                   {isMobile ? t('buttons.copyFromEn').replace('English', 'EN') : t('buttons.copyFromEn')}
                </Button>
            </Box>
        )}
      </Box>

      {/* EDITING AREA */}
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          required={currentTab === 'en'}
          label={`${t('labels.title')} (${currentTab.toUpperCase()})`}
          value={formData.translations[currentTab].title}
          onChange={handleTitleChange}
          fullWidth
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputLabel sx={{ fontWeight: 'bold' }}>{t('labels.content')}</InputLabel>
            <TipTapEditor
                key={currentTab}
                content={formData.translations[currentTab].content}
                onChange={handleEditorChange}
            />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          size="large"
          fullWidth={isMobile}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? t('buttons.creating') : t('buttons.create')}
        </Button>
      </Box>
    </Box>
  );
}