// src/components/admin/editor/ProductInserter.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Stack, Box, CircularProgress, 
  InputAdornment, IconButton
} from '@mui/material';
import { CloudUpload, Delete, Link as LinkIcon } from '@mui/icons-material';
import { compressAndUploadImage } from '@/utils/upload-helper';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProductData {
  title: string;
  price: number;
  link: string;
  image: string;
  badge: string;
}

interface ProductInserterProps {
  open: boolean;
  onClose: () => void;
  onInsert: (data: ProductData) => void;
  initialData?: ProductData | null;
}

// Helper: Strict Slug Cleaner
const cleanSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/:/g, '')        // Remove colons
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with dashes
    .replace(/^-+|-+$/g, ''); // Trim dashes
};

export default function ProductInserter({ open, onClose, onInsert, initialData }: ProductInserterProps) {
  const t = useTranslations('admin.editor.productCard');
  const [values, setValues] = useState({
    title: '',
    price: '',
    slug: '',
    image: '',
    badge: ''
  });
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      let rawSlug = initialData.link.replace('/experiences/', '').replace('/', '');
      rawSlug = cleanSlug(rawSlug);

      setValues({
        title: initialData.title || '',
        price: initialData.price?.toString() || '',
        slug: rawSlug, 
        image: initialData.image || '',
        badge: initialData.badge || ''
      });
    } else if (open && !initialData) {
      setValues({ title: '', price: '', slug: '', image: '', badge: '' });
    }
  }, [open, initialData]);

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (prop === 'slug') {
        setValues({ ...values, slug: cleanSlug(val) });
    } else {
        setValues({ ...values, [prop]: val });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await compressAndUploadImage(file, 'product-cards');
      setValues((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!values.title) return;
    
    const finalSlug = cleanSlug(values.slug);

    onInsert({
      title: values.title,
      price: parseFloat(values.price) || 0,
      link: `/experiences/${finalSlug}`, 
      image: values.image || '/images/default-placeholder.jpg',
      badge: values.badge
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {initialData ? `✏️ ${t('edit')}` : `🛍️ ${t('insert')}`}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          
          {/* Image Uploader */}
          <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
            {values.image ? (
               <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                 <Image 
                    src={values.image} 
                    alt="Preview" 
                    fill 
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    sizes="(max-width: 768px) 100vw, 400px" 
                 />                  
                 <IconButton 
                    size="small" onClick={() => setValues({ ...values, image: '' })}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'error.main' } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
               </Box>
            ) : (
              <Button
                component="label" variant="text" fullWidth disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                sx={{ height: 100, flexDirection: 'column', gap: 1 }}
              >
                {uploading ? t('uploading') : t('uploadImage')}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
            )}
          </Box>

          {/* Title & Price Stack */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
             <TextField label={t('titleLabel')} size="small" fullWidth value={values.title} onChange={handleChange('title')} />
             <TextField label={t('priceLabel')} size="small" type="number" sx={{ width: { xs: '100%', sm: 120 } }} value={values.price} onChange={handleChange('price')} />
          </Stack>

          <TextField 
            label={t('slugLabel')} size="small" fullWidth value={values.slug} onChange={handleChange('slug')} 
            placeholder="camel-ride"
            helperText={t('slugHelper', { slug: values.slug || '...' })}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LinkIcon color="action" fontSize="small" /> /experiences/</InputAdornment>) }}
          />

          <TextField label={t('badgeLabel')} size="small" fullWidth value={values.badge} onChange={handleChange('badge')} />

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!values.title || !values.slug || uploading}>
          {initialData ? t('update') : t('insertBtn')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}