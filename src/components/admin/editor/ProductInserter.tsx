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

// 🟢 HELPER: Strict Slug Cleaner
// Converts "Merveille : Roche" -> "merveille-roche"
const cleanSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents (é -> e)
    .replace(/:/g, '')        // Remove colons
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with dashes
    .replace(/^-+|-+$/g, ''); // Trim dashes
};

export default function ProductInserter({ open, onClose, onInsert, initialData }: ProductInserterProps) {
  const [values, setValues] = useState({
    title: '',
    price: '',
    slug: '',
    image: '',
    badge: ''
  });
  
  const [uploading, setUploading] = useState(false);

  // 🟢 UPDATED: Clean the slug immediately when opening
  useEffect(() => {
    if (open && initialData) {
      // Extract the raw slug from the full URL
      let rawSlug = initialData.link.replace('/experiences/', '').replace('/', '');
      
      // Auto-clean it!
      rawSlug = cleanSlug(rawSlug);

      setValues({
        title: initialData.title || '',
        price: initialData.price?.toString() || '',
        slug: rawSlug, // Set the clean version
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
    
    // Final clean check before saving
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
        {initialData ? '✏️ Edit Experience Card' : '🛍️ Insert Experience Card'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          
          <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
            {values.image ? (
               <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
<Image 
  src={values.image} 
  alt="Preview" 
  fill 
  style={{ objectFit: 'cover', borderRadius: '8px' }}
  sizes="(max-width: 768px) 100vw, 400px" // Optimization for performance
/>                  <IconButton 
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
                {uploading ? "Uploading..." : "Click to Upload Card Image"}
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
             <TextField label="Experience Title" size="small" fullWidth value={values.title} onChange={handleChange('title')} />
             <TextField label="Price (€)" size="small" type="number" sx={{ width: 120 }} value={values.price} onChange={handleChange('price')} />
          </Stack>

          <TextField 
            label="Link Slug" size="small" fullWidth value={values.slug} onChange={handleChange('slug')} 
            placeholder="camel-ride"
            helperText={`Will link to: /experiences/${values.slug}`}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LinkIcon color="action" fontSize="small" /> /experiences/</InputAdornment>) }}
          />

          <TextField label="Badge (Optional)" size="small" fullWidth value={values.badge} onChange={handleChange('badge')} />

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!values.title || !values.slug || uploading}>
          {initialData ? 'Update Card' : 'Insert Card'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}