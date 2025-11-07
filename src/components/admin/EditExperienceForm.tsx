// /src/components/admin/EditExperienceForm.tsx
'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, LinearProgress, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm'; // Import the hook and types
import { Experience, GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations';

interface EditExperienceFormProps {
  open: boolean;
  onClose: () => void;
  experience: Experience | null;
}

export default function EditExperienceForm({ open, onClose, experience }: EditExperienceFormProps) {
  const router = useRouter();
  
  // Use the custom hook for all state and handlers
  const {
    formData,
    initialGalleryImages, // ✅ **FIX 1**: Destructure the correct variable for existing images
    coverImageFile,
    newGalleryImageFiles,
    isCompressing,
    currentTab,
    setCurrentTab,
    handleNestedChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    removeInitialGalleryImage, // ✅ **FIX 2**: Destructure the correct removal function
    removeNewGalleryImage,
    setFormData
  } = useExperienceForm(experience);

  // State for this component's specific UI needs
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- 1. NEW HANDLER for the tags field ---
  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(p => ({...p, tags: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!experience) return;

    setLoading(true);
    setError(null);

    try {
      // Upload logic is now self-contained in the submit handler
      let coverImageUrl = formData.coverImage;
      if (coverImageFile) {
        setUploadingFiles([{ name: coverImageFile.name, progress: 0 }]);
        const storagePath = `experiences/${experience.id}/cover/${Date.now()}_${coverImageFile.name.split('.')[0]}.webp`;
        const uploadTask = uploadBytesResumable(ref(storage, storagePath), coverImageFile);
        coverImageUrl = await new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                snapshot => setUploadingFiles([{ name: coverImageFile.name, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }]),
                error => reject(error),
                () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
            );
        });
      }

      let newGalleryImagesData: GalleryImage[] = [];
      if (newGalleryImageFiles.length > 0) {
        setUploadingFiles(newGalleryImageFiles.map(f => ({ name: f.name, progress: 0 })));
        const uploadPromises = newGalleryImageFiles.map(file => {
          const storagePath = `experiences/${experience.id}/gallery/${Date.now()}_${file.name.split('.')[0]}.webp`;
          const uploadTask = uploadBytesResumable(ref(storage, storagePath), file);
          return new Promise<GalleryImage>((resolve, reject) => {
            uploadTask.on('state_changed',
              snapshot => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress } : f));
              },
              error => reject(error),
              async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve({ path: downloadURL, hidden: false });
              }
            );
          });
        });
        newGalleryImagesData = await Promise.all(uploadPromises);
      }
      setUploadingFiles([]);

      // ✅ **FIX 3**: Combine the correct 'initial' images with the new ones
      const finalGalleryImages = [...initialGalleryImages, ...newGalleryImagesData];
      const finalData = { ...formData, coverImage: coverImageUrl, galleryImages: finalGalleryImages };

      const response = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to update experience.');
      }

      onClose();
      router.refresh();

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
      setUploadingFiles([]);
    }
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }} maxWidth="md" fullWidth>
      <DialogTitle>Edit Experience</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>General Information</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="price-amount">Price Amount</InputLabel>
              <OutlinedInput id="price-amount" name="amount" type="number" value={formData.price.amount} onChange={handleNestedChange('price')} startAdornment={<InputAdornment position="start">MAD</InputAdornment>} label="Price Amount" required />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select labelId="location-select-label" name="locationId" value={formData.locationId} label="Location" onChange={(e) => setFormData(p => ({...p, locationId: e.target.value}))}>
                {locations.map((loc) => (<MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>))}
              </Select>
            </FormControl>
        </Box>
        {/* --- 2. NEW TEXTFIELD for tags --- */}
        <TextField
            name="tags"
            label="Tags (comma-separated)"
            fullWidth
            value={formData.tags}
            onChange={handleTagsChange}
            helperText="e.g., Best Seller, New, Popular"
            sx={{ mb: 2 }}
        />
        
        <Divider sx={{ my: 2 }}><Chip label="Cover Image" /></Divider>
        <TextField disabled margin="dense" label="Current Cover Image URL" type="text" fullWidth value={formData.coverImage} sx={{ mb: 1 }} />
        <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
          {isCompressing ? 'Compressing...' : 'Upload New Cover Image'}
          <input type="file" hidden accept="image/*" onChange={handleCoverImageChange} />
        </Button>
        {coverImageFile && !isCompressing && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>New cover selected: {coverImageFile.name}</Typography>}

        <Divider sx={{ my: 2 }}><Chip label="Gallery Images" /></Divider>
        <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
          {isCompressing ? 'Processing...' : 'Add More Gallery Images'}
          <input type="file" hidden multiple accept="image/*" onChange={handleGalleryImagesChange} />
        </Button>
        
        <Paper variant="outlined" sx={{ mt: 2, p: 1, background: '#f7f7f7' }}>
            <List>
                {/* ✅ **FIX 4**: Map over the correct 'initialGalleryImages' variable to render the list */}
                {initialGalleryImages.map((image) => (
                    <ListItem key={image.path} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeInitialGalleryImage(image.path)}><DeleteIcon /></IconButton>}>
                        <ListItemAvatar><Avatar src={image.path} variant="rounded"/></ListItemAvatar>
                        <ListItemText primary="Existing image" primaryTypographyProps={{ variant: 'body2', noWrap: true, color: 'text.secondary' }} />
                    </ListItem>
                ))}
                {newGalleryImageFiles.map((file) => (
                    <ListItem key={file.name} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeNewGalleryImage(file.name)}><DeleteIcon /></IconButton>}>
                        <ListItemAvatar><Avatar src={URL.createObjectURL(file)} variant="rounded"/></ListItemAvatar>
                        <ListItemText primary={file.name} secondary="Ready to upload" primaryTypographyProps={{ variant: 'body2', noWrap: true }} />
                    </ListItem>
                ))}
            </List>
             {initialGalleryImages.length === 0 && newGalleryImageFiles.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{p: 2}}>No gallery images yet.</Typography>
             )}
        </Paper>

        {uploadingFiles.length > 0 && (
            <Box sx={{mt: 2}}>
                {uploadingFiles.map(file => (
                    <Box key={file.name} sx={{mb: 1}}>
                        <Typography variant="body2" color="text.secondary">{`Uploading ${file.name}...`}</Typography>
                        <LinearProgress variant="determinate" value={file.progress} />
                    </Box>
                ))}
            </Box>
        )}
        
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Translations</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
             <Tab label="English" value="en" />
             <Tab label="French" value="fr" />
             <Tab label="Spanish" value="es" />
          </Tabs>
        </Box>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField required name="title" label="Title" fullWidth value={formData.translations[currentTab]?.title || ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField required name="description" label="Description" fullWidth multiline rows={4} value={formData.translations[currentTab]?.description || ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <Divider sx={{ my: 2 }}><Chip label="Inclusions & Details" /></Divider>
            <TextField name="included" label="What's Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.included || ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="notIncluded" label="What's Not Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.notIncluded || ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="importantInfo" label="Important Information" fullWidth multiline rows={4} value={formData.translations[currentTab]?.importantInfo || ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="itinerary" label="Detailed Itinerary" fullWidth multiline rows={10} value={formData.translations[currentTab]?.itinerary || ''} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use Markdown for formatting." />
        </Box>

        {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading || isCompressing}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
      
    </Dialog>
  );
}
