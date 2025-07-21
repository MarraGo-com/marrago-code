// /src/components/admin/CreateExperience.tsx
'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, LinearProgress, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm';
import { GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations'; 

export default function CreateExperience() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    formData,
    setFormData,
    coverImageFile,
    newGalleryImageFiles,
    isCompressing,
    currentTab,
    setCurrentTab,
    handleNestedChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    removeNewGalleryImage,
    resetForm
  } = useExperienceForm(null);

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!coverImageFile) {
      setError("A cover image is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // STEP 1: Initiate creation and get the server-generated ID
      const initiateResponse = await fetch('/api/admin/experiences/initiate', { method: 'POST' });
      if (!initiateResponse.ok) throw new Error('Failed to get a new experience ID from the server.');
      
      const { id: experienceId } = await initiateResponse.json();
      if (!experienceId) throw new Error('Server did not return a valid experience ID.');

      // STEP 2: Use the new ID to upload files
      setUploadingFiles([{ name: coverImageFile.name, progress: 0 }]);
      const coverStoragePath = `experiences/${experienceId}/cover/${Date.now()}_${coverImageFile.name.split('.')[0]}.webp`;
      const coverUploadTask = uploadBytesResumable(ref(storage, coverStoragePath), coverImageFile);
      const coverImageUrl = await new Promise<string>((resolve, reject) => {
          coverUploadTask.on('state_changed',
              snapshot => setUploadingFiles([{ name: coverImageFile.name, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }]),
              error => reject(error),
              () => getDownloadURL(coverUploadTask.snapshot.ref).then(resolve)
          );
      });

      let newGalleryImagesData: GalleryImage[] = [];
      if (newGalleryImageFiles.length > 0) {
        setUploadingFiles(newGalleryImageFiles.map(f => ({ name: f.name, progress: 0 })));
        const uploadPromises = newGalleryImageFiles.map(file => {
          const storagePath = `experiences/${experienceId}/gallery/${Date.now()}_${file.name.split('.')[0]}.webp`;
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

      // STEP 3: Send a PUT request to update the document with the final data
      const finalData = { ...formData, coverImage: coverImageUrl, galleryImages: newGalleryImagesData };
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'PUT', // Use PUT to update the document we just initiated
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to finalize experience creation.');
      }

      handleClose();
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

  const handleOpen = () => {
    resetForm();
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Experience
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }} maxWidth="md" fullWidth>
        <DialogTitle>Create a New Experience</DialogTitle>
        <DialogContent>
            {/* The JSX remains unchanged */}
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
            <Divider sx={{ my: 2 }}><Chip label="Cover Image" /></Divider>
            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
                {isCompressing ? 'Compressing...' : 'Upload Cover Image (Required)'}
                <input type="file" hidden required accept="image/*" onChange={handleCoverImageChange} />
            </Button>
            {coverImageFile && !isCompressing && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Selected: {coverImageFile.name}</Typography>}

            <Divider sx={{ my: 2 }}><Chip label="Gallery Images" /></Divider>
            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
                {isCompressing ? 'Processing...' : 'Add Gallery Images'}
                <input type="file" hidden multiple accept="image/*" onChange={handleGalleryImagesChange} />
            </Button>

            <Paper variant="outlined" sx={{ mt: 2, p: 1, background: '#f7f7f7' }}>
                <List>
                    {newGalleryImageFiles.map((file) => (
                        <ListItem key={file.name} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeNewGalleryImage(file.name)}><DeleteIcon /></IconButton>}>
                            <ListItemAvatar><Avatar src={URL.createObjectURL(file)} variant="rounded"/></ListItemAvatar>
                            <ListItemText primary={file.name} secondary="Ready to upload" primaryTypographyProps={{ variant: 'body2', noWrap: true }} />
                        </ListItem>
                    ))}
                </List>
                {newGalleryImageFiles.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{p: 2}}>No gallery images selected.</Typography>
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
                <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}><Tab label="English" value="en" /><Tab label="French" value="fr" /></Tabs>
            </Box>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required name="title" label="Title" fullWidth value={formData.translations[currentTab].title} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField required name="description" label="Description" fullWidth multiline rows={4} value={formData.translations[currentTab].description} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <Divider sx={{ my: 2 }}><Chip label="Inclusions & Details" /></Divider>
                <TextField name="included" label="What's Included" fullWidth multiline rows={4} value={formData.translations[currentTab].included} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="notIncluded" label="What's Not Included" fullWidth multiline rows={4} value={formData.translations[currentTab].notIncluded} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="importantInfo" label="Important Information" fullWidth multiline rows={4} value={formData.translations[currentTab].importantInfo} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="itinerary" label="Detailed Itinerary" fullWidth multiline rows={10} value={formData.translations[currentTab].itinerary} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use Markdown for formatting." />
            </Box>

            {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || isCompressing}>
            {loading ? 'Creating...' : 'Create Experience'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
