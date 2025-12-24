// src/components/admin/CreateArticleForm.tsx
'use client';

import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Select, MenuItem, InputLabel, 
  FormControl, CircularProgress, Tabs, Tab
} from '@mui/material';
import { CloudUpload, ContentCopy, DeleteSweep } from '@mui/icons-material';
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import TipTapEditor from '@/components/admin/editor/TipTapEditor';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};

export default function CreateArticleForm() {
  const router = useAppRouter();
  
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

  // 2. IMAGE STATE (Enhanced with Preview)
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
      setPreviewUrl(URL.createObjectURL(compressedFile)); // 🟢 Show preview immediately
      toast.success("Image uploaded & compressed!");
    } catch {
      toast.error('Failed to compress image.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
        toast.error("⚠️ Cover Image is required!", { duration: 4000 });
        return; 
    }
    if (!formData.translations.en.title) {
        toast.error("⚠️ English Title is required!", { duration: 4000 });
        return;
    }
    if (!formData.slug) {
        toast.error("⚠️ URL Slug is required!", { duration: 4000 });
        return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating article...");

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

      toast.success("Article created successfully!", { id: toastId });
      
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

      {/* TOP SECTION: SLUG & STATUS */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
            required
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
            fullWidth
            helperText="Auto-generated from English title."
        />
        <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
            value={formData.status}
            label="Status"
            onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as 'draft' | 'published'}))}
            >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            </Select>
        </FormControl>
      </Box>

      {/* 🟢 ENHANCED IMAGE UPLOAD UI (Matches Edit Form) */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
         <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Cover Image *</Typography>
         
         {previewUrl ? (
             <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, height: 250, borderRadius: 2, overflow: 'hidden', mb: 2, border: '1px solid #eee' }}>
                <Image 
      src={previewUrl} 
      alt="Cover Preview" 
      fill 
      style={{ objectFit: 'cover' }}
      priority // Loads immediately since it's the main image
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
                 <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s', '&:hover': { opacity: 1 } }}>
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
      </Box>
      
      {/* TABS WITH TOOLS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="English" value="en" />
            <Tab label="Français" value="fr" />
            <Tab label="Español" value="es" />
        </Tabs>

        {/* 🟢 COPY & CLEAR TOOLS */}
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
                                [currentTab]: { title: '', content: null }
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

      {/* EDITING AREA */}
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          required={currentTab === 'en'}
          label={`Article Title (${currentTab.toUpperCase()})`}
          value={formData.translations[currentTab].title}
          onChange={handleTitleChange}
          fullWidth
        />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputLabel sx={{ fontWeight: 'bold' }}>Article Content</InputLabel>
            
            {/* 🟢 ADDED KEY PROP FOR STABILITY */}
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
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Creating...' : 'Create Article'}
        </Button>
      </Box>
    </Box>
  );
}