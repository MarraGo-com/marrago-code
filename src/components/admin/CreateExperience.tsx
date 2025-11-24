// /src/components/admin/CreateExperience.tsx
'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, LinearProgress, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm';
import { GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations'; 

// Helper function to split comma-separated string into array
const splitStringToArray = (str: string | undefined): string[] => {
  return str ? str.split(',').map(s => s.trim()).filter(s => s !== '') : [];
};

export default function CreateExperience() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Note: currentTab needs to be typed as one of the valid language codes
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
    resetForm,
    // Get new FAQ handlers from hook
    handleAddFaq,
    handleFaqChange,
    handleRemoveFaq
  } = useExperienceForm(null);

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Handler for root-level text/number fields
  const handleRootChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({
        ...prev,
        // Convert number inputs correctly, handle empty string as undefined for optional numbers
        [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!coverImageFile) {
      setError("A cover image is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // STEP 1: Initiate creation and get ID
      const initiateResponse = await fetch('/api/admin/experiences/initiate', { method: 'POST' });
      if (!initiateResponse.ok) throw new Error('Failed to get a new experience ID from the server.');
      const { id: experienceId } = await initiateResponse.json();
      if (!experienceId) throw new Error('Server did not return a valid experience ID.');

      // STEP 2: Upload cover image
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

      // Upload gallery images
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

      // STEP 3: Prepare final data and send PUT request
      const finalData = { 
          ...formData, 
          coverImage: coverImageUrl, 
          galleryImages: newGalleryImagesData,
          tags: splitStringToArray(formData.tags),
          languages: splitStringToArray(formData.languages),
          startTimes: splitStringToArray(formData.startTimes),
          // Ensure maxGuests is either a number or null (not undefined) for Firestore
          maxGuests: formData.maxGuests === undefined ? null : formData.maxGuests,
          // ▼▼▼ NEW: Add Meeting Point Coordinates ▼▼▼
          latitude: formData.latitude === undefined ? null : formData.latitude,
          longitude: formData.longitude === undefined ? null : formData.longitude
          // ▲▲▲
      };

      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'PUT',
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
            {/* General Information Section */}
            <Divider sx={{ my: 2 }}><Chip label="General Information" /></Divider>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="price-amount">Price Amount</InputLabel>
                  <OutlinedInput id="price-amount" name="amount" type="number" value={formData.price.amount} onChange={handleNestedChange('price')} startAdornment={<InputAdornment position="start">EUR</InputAdornment>} label="Price Amount" />
                </FormControl>
                <FormControl fullWidth required>
                
                <InputLabel id="location-select-label">Location</InputLabel>
                <Select labelId="location-select-label" name="locationId" value={formData.locationId} label="Location" onChange={(e) => setFormData(p => ({...p, locationId: e.target.value}))}>
                    {locations.map((loc) => (<MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>))}
                </Select>
                </FormControl>
                {/* ▼▼▼ NEW DURATION FIELD ▼▼▼ */}
                <TextField
                    required
                    name="duration"
                    label="Duration"
                    fullWidth
                    value={formData.duration ?? ''}
                    onChange={handleRootChange}
                    helperText="e.g., '3-4 hours', 'Full Day', '2 Days'"
                />
                {/* ▲▲▲ END NEW FIELD ▲▲▲ */}
            </Box>

            <TextField name="tags" label="Tags (comma-separated)" fullWidth value={formData.tags} onChange={handleRootChange} helperText="e.g., Best Seller, New" sx={{ mb: 2 }} />

            {/* Quick Facts Fields */}
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Quick Facts Details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField name="maxGuests" label="Max Guests" type="number" fullWidth value={formData.maxGuests === undefined ? '' : formData.maxGuests} onChange={handleRootChange} />
                <TextField name="tourCode" label="Tour Code" fullWidth value={formData.tourCode} onChange={handleRootChange} />
                <TextField name="languages" label="Languages (comma-separated)" fullWidth value={formData.languages} onChange={handleRootChange} helperText="e.g., English, French" />
                <TextField name="startTimes" label="Start Times (comma-separated)" fullWidth value={formData.startTimes} onChange={handleRootChange} helperText="e.g., 09:00, 14:00" />
            </Box>
            {/* ▼▼▼ NEW Meeting Point Section ▼▼▼ */}
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Meeting Point Coordinates (Optional)</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                 <TextField 
                    name="latitude" 
                    label="Latitude (e.g., 31.6295)" 
                    type="number" 
                    fullWidth 
                    // Important: Handle undefined value to avoid React warnings
                    value={formData.latitude === undefined ? '' : formData.latitude} 
                    onChange={handleRootChange} 
                    inputProps={{ step: "any" }} // Allow decimals
                />
                 <TextField 
                    name="longitude" 
                    label="Longitude (e.g., -7.9811)" 
                    type="number" 
                    fullWidth 
                    value={formData.longitude === undefined ? '' : formData.longitude} 
                    onChange={handleRootChange} 
                    inputProps={{ step: "any" }} // Allow decimals
                />
            </Box>
            {/* ▲▲▲ END New Section ▲▲▲ */}
            {/* Images Section */}
            <Divider sx={{ my: 2 }}><Chip label="Images" /></Divider>
            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading} sx={{ mb: 2 }}>
                {isCompressing ? 'Compressing...' : 'Upload Cover Image (Required)'}
                <input type="file" hidden required accept="image/*" onChange={handleCoverImageChange} />
            </Button>
            {coverImageFile && !isCompressing && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Selected: {coverImageFile.name}</Typography>}

            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
                {isCompressing ? 'Processing...' : 'Add Gallery Images'}
                <input type="file" hidden multiple accept="image/*" onChange={handleGalleryImagesChange} />
            </Button>

            <Paper variant="outlined" sx={{ mt: 2, p: 1 }}>
                <List dense>
                    {newGalleryImageFiles.map((file) => (
                        <ListItem key={file.name} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeNewGalleryImage(file.name)}><DeleteIcon /></IconButton>}>
                            <ListItemAvatar><Avatar src={URL.createObjectURL(file)} variant="rounded"/></ListItemAvatar>
                            <ListItemText primary={file.name} secondary="Ready to upload" primaryTypographyProps={{ variant: 'body2', noWrap: true }} />
                        </ListItem>
                    ))}
                    {newGalleryImageFiles.length === 0 && <Typography variant="body2" color="text.secondary" align="center" sx={{p: 2}}>No gallery images selected.</Typography>}
                </List>
            </Paper>

            {/* Translations & Content Section */}
            <Divider sx={{ my: 3 }}><Chip label="Translations & Content" /></Divider>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                 <Tab label="English" value="en" />
                 <Tab label="French" value="fr" />
                 <Tab label="Spanish" value="es" />
              </Tabs>
            </Box>
            <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required name="title" label="Title" fullWidth value={formData.translations[currentTab].title} onChange={handleNestedChange(`translations.${currentTab}`)} />
                                         {/* ▼▼▼ NEW FIELD ▼▼▼ */}
    <TextField 
      name="shortDescription" 
      label="Short Description (Card Summary)" 
      fullWidth 
      multiline 
      rows={2} 
      value={formData.translations[currentTab].shortDescription ?? ''} 
      onChange={handleNestedChange(`translations.${currentTab}`)} 
      helperText="A brief summary shown on the experience card (2-3 lines)."
    />
    {/* ▲▲▲ END NEW FIELD ▲▲▲ */}
                <TextField required name="description" label="Description (Markdown)" fullWidth multiline rows={4} value={formData.translations[currentTab].description} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use Markdown for formatting."/>
                
                {/* Highlights Field */}
                <TextField name="highlights" label="Highlights (Markdown list)" fullWidth multiline rows={4} value={formData.translations[currentTab].highlights} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use * for bullet points. e.g., * Sunset camel ride" />

                <Divider sx={{ my: 1 }} />
                <TextField name="included" label="What's Included" fullWidth multiline rows={3} value={formData.translations[currentTab].included} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="notIncluded" label="What's Not Included" fullWidth multiline rows={3} value={formData.translations[currentTab].notIncluded} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="importantInfo" label="Important Information" fullWidth multiline rows={3} value={formData.translations[currentTab].importantInfo} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="itinerary" label="Detailed Itinerary (Markdown)" fullWidth multiline rows={6} value={formData.translations[currentTab].itinerary} onChange={handleNestedChange(`translations.${currentTab}`)} />

                {/* ▼▼▼ FAQ Manager Section (Now inside translations) ▼▼▼ */}
                <Divider sx={{ my: 2 }}><Chip label={`FAQs (${currentTab.toUpperCase()})`} /></Divider>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {/* Iterate over FAQs for the current tab */}
                  {formData.translations[currentTab].faqs?.map((faq, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, p: 2, bg: 'white', borderRadius: 1, border: '1px solid #eee' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {/* Pass currentTab to handlers */}
                        <TextField label={`Question ${index + 1}`} fullWidth value={faq.question} onChange={(e) => handleFaqChange(currentTab, index, 'question', e.target.value)} sx={{ mb: 1 }} size="small" />
                        <TextField label="Answer" fullWidth multiline rows={2} value={faq.answer} onChange={(e) => handleFaqChange(currentTab, index, 'answer', e.target.value)} size="small" />
                      </Box>
                      <IconButton onClick={() => handleRemoveFaq(currentTab, index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  {/* Pass currentTab to add handler */}
                  <Button startIcon={<AddIcon />} onClick={() => handleAddFaq(currentTab)} variant="outlined" size="small">
                    Add FAQ ({currentTab.toUpperCase()})
                  </Button>
                </Paper>
                {/* ▲▲▲ END FAQ Manager ▲▲▲ */}
            </Box>

            {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
            
            {/* Upload Progress */}
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

        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || isCompressing} size="large">
            {loading ? 'Creating...' : 'Create Experience'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}