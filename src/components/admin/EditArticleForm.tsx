// src/components/admin/EditArticleForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, Tabs, Tab, Typography, useTheme, useMediaQuery
} from '@mui/material';
import { CloudUpload, ContentCopy, DeleteSweep } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import toast, { Toaster } from 'react-hot-toast';

import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Helper for slugs
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};

interface ArticleTranslation {
  title: string;
  content: any;
}

interface Article {
  id: string;
  slug: string;
  coverImage: string;
  status: 'draft' | 'published';
  translations: {
    en: ArticleTranslation;
    fr: ArticleTranslation;
    es?: ArticleTranslation;
    [key: string]: any;
  };
}

export default function EditArticleForm({ article }: { article: Article }) {
  const t = useTranslations('admin.blog');
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. FORM STATE
  const [formData, setFormData] = useState({
    slug: article.slug || '',
    status: article.status || 'draft',
    translations: {
      en: article.translations.en || { title: '', content: '' },
      fr: article.translations.fr || { title: '', content: '' },
      es: article.translations.es || { title: '', content: '' }
    }
  });

  // 2. IMAGE STATE
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(article.coverImage || '');

  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'en' | 'fr' | 'es'>('en');

  // 3. SYNC STATE
  useEffect(() => {
    setFormData({
        slug: article.slug || '',
        status: article.status || 'draft',
        translations: {
          en: article.translations.en || { title: '', content: '' },
          fr: article.translations.fr || { title: '', content: '' },
          es: article.translations.es || { title: '', content: '' }
        }
    });
    setPreviewUrl(article.coverImage || ''); 
    setNewImageFile(null); 
  }, [article]);

  // --- HANDLERS ---

  const handleTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [currentTab]: { ...prev.translations[currentTab], [name]: value }
      }
    }));

    if (name === 'title' && currentTab === 'en') {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleEditorChange = (newContentJson: any) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [currentTab]: { ...prev.translations[currentTab], content: newContentJson }
      }
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
      const compressedFile = await imageCompression(file, options);
      
      setNewImageFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
      toast.success("New image selected!");
    } catch {
      toast.error('Failed to process image.');
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t('buttons.saving'));

    try {
      let finalCoverImageUrl = article.coverImage;

      if (newImageFile) {
          const nameWithoutExtension = newImageFile.name.split('.').slice(0, -1).join('.');
          const newFileName = `${Date.now()}_${nameWithoutExtension}.webp`;
          const storageRef = ref(storage, `articles/${newFileName}`);
          const uploadTask = uploadBytesResumable(storageRef, newImageFile);
          finalCoverImageUrl = await getDownloadURL((await uploadTask).ref);
      }

      const payload = {
          ...formData,
          coverImage: finalCoverImageUrl
      };

      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update article.');

      toast.success(t('messages.updatedSuccess'), { id: toastId });
      router.refresh(); 

    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to update article.", { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Toaster position="top-center" />

      {/* TOP BAR: Responsive Stack */}
      <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
      }}>
         <TextField 
            required 
            label={t('labels.slug')}
            size="small"
            value={formData.slug} 
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} 
            sx={{ width: { xs: '100%', sm: '50%' } }}
            helperText={t('labels.slugHelper')}
         />
         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
                <InputLabel>{t('labels.status')}</InputLabel>
                <Select 
                    value={formData.status} 
                    label={t('labels.status')}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as any}))}
                >
                    <MenuItem value="draft">{t('statusOptions.draft')}</MenuItem>
                    <MenuItem value="published">{t('statusOptions.published')}</MenuItem>
                </Select>
            </FormControl>
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                sx={{ whiteSpace: 'nowrap', flex: { xs: 1, sm: 'initial' } }}
            >
                {loading ? t('buttons.saving') : t('buttons.save')}
            </Button>
         </Box>
      </Box>

      {/* COVER IMAGE */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{t('labels.coverImage')}</Typography>
         
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
         
         {newImageFile ? (
             <Typography variant="caption" color="success.main">✅ {t('labels.newSelected')}</Typography>
         ) : (
             <Typography variant="caption" color="text.secondary">{t('labels.usingSaved')}</Typography>
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
          pr: 1,
          gap: 2
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
            <Box sx={{ display: 'flex', gap: 1, mb: { xs: 1, sm: 0 } }}>
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
                                [currentTab]: { title: '', content: '' }
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

                        // Deep copy
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

      {/* EDITOR */}
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField 
            required={currentTab === 'en'} 
            label={`${t('labels.title')} (${currentTab.toUpperCase()})`}
            name="title" 
            value={formData.translations[currentTab].title} 
            onChange={handleTranslationChange} 
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
    </Box>
  );
}