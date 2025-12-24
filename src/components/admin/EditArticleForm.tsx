// src/components/admin/EditArticleForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, Tabs, Tab, Typography
} from '@mui/material';
import { CloudUpload, ContentCopy, DeleteSweep } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import toast, { Toaster } from 'react-hot-toast';

import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import Image from 'next/image';

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
  const router = useRouter();

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
    const toastId = toast.loading("Updating article...");

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

      toast.success("Article updated successfully!", { id: toastId });
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

      {/* TOP BAR */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <TextField 
            required 
            label="URL Slug" 
            size="small"
            value={formData.slug} 
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} 
            sx={{ width: '50%' }}
            helperText="Auto-generated from English title"
         />
         <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select 
                    value={formData.status} 
                    label="Status" 
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as any}))}
                >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                </Select>
            </FormControl>
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
         </Box>
      </Box>

      {/* COVER IMAGE */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Cover Image</Typography>
         
         {previewUrl ? (
             <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 250, borderRadius: 2, overflow: 'hidden', mb: 2, border: '1px solid #eee' }}>
   <Image 
      src={previewUrl} 
      alt="Cover Preview" 
      fill 
      style={{ objectFit: 'cover' }}
      priority // Loads immediately since it's the main image
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />                 <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s', '&:hover': { opacity: 1 } }}>
                    <Button variant="contained" component="label" size="small" startIcon={<CloudUpload />}>
                        Change Image
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                 </Box>
             </Box>
         ) : (
            <Button variant="outlined" component="label" fullWidth sx={{ height: 100, borderStyle: 'dashed' }}>
                Upload Cover Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
         )}
         
         {newImageFile ? (
             <Typography variant="caption" color="success.main">✅ New image selected (will upload on save)</Typography>
         ) : (
             <Typography variant="caption" color="text.secondary">Using saved image</Typography>
         )}
      </Box>

      {/* TABS WITH TOOLS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="English" value="en" />
            <Tab label="Français" value="fr" />
            <Tab label="Español" value="es" />
        </Tabs>

        {/* COPY & CLEAR TOOLS */}
        {currentTab !== 'en' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                    size="small" 
                    startIcon={<DeleteSweep />}
                    color="error"
                    onClick={() => {
                        if(!confirm("Are you sure you want to clear this language?")) return;
                        setFormData(prev => ({
                            ...prev,
                            translations: {
                                ...prev.translations,
                                [currentTab]: { title: '', content: '' }
                            }
                        }));
                        toast.success(`Cleared ${currentTab.toUpperCase()} content.`);
                    }}
                >
                    Clear
                </Button>
                <Button 
                    size="small" 
                    startIcon={<ContentCopy />}
                    color="secondary"
                    onClick={() => {
                        const enContent = formData.translations.en.content;
                        const enTitle = formData.translations.en.title;
                        
                        if (!enContent) {
                            toast.error("No English content to copy!");
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
                        toast.success(`Copied English layout to ${currentTab.toUpperCase()}!`);
                    }}
                >
                    Copy from English
                </Button>
            </Box>
        )}
      </Box>

      {/* EDITOR */}
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField 
            required={currentTab === 'en'} 
            label={`Article Title (${currentTab.toUpperCase()})`} 
            name="title" 
            value={formData.translations[currentTab].title} 
            onChange={handleTranslationChange} 
            fullWidth 
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputLabel sx={{ fontWeight: 'bold' }}>Article Content</InputLabel>
            
            {/* 🟢 THE MAGIC FIX: key={currentTab} */}
            {/* This forces React to destroy the editor and build a new one when you switch tabs */}
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