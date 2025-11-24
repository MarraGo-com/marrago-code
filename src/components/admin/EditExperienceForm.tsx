// /src/components/admin/EditExperienceForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Stack,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm';
import { Experience, GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations';

// Helper function to split comma-separated string into array
const splitStringToArray = (str: string | undefined): string[] => {
  return str ? str.split(',').map(s => s.trim()).filter(s => s !== '') : [];
};

interface EditExperienceFormProps {
  open: boolean;
  onClose: () => void;
  experience: Experience | null;
}

export default function EditExperienceForm({ open, onClose, experience }: EditExperienceFormProps) {
  const router = useRouter();
  
  const {
    formData,
    initialGalleryImages,
    coverImageFile,
    newGalleryImageFiles,
    isCompressing,
    currentTab,
    setCurrentTab,
    handleNestedChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    removeInitialGalleryImage,
    removeNewGalleryImage,
    setFormData,
    handleAddFaq,
    handleFaqChange,
    handleRemoveFaq
  } = useExperienceForm(experience);

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Debugging to confirm hook is working
  useEffect(() => {
    if (open && experience) {
      console.log("EditForm open. Hook formData state:", formData);
    }
  }, [open, experience, formData]);

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
    if (!experience) return;

    if (!formData.price.amount || !formData.locationId) {
        setError("Please fill in all required fields (Price, Location).");
        return;
    }
    // Check if at least one translation has a title
    const hasTitle = Object.values(formData.translations).some(t => t.title?.trim());
    if (!hasTitle) {
        setError("Please provide a Title in at least one language.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
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

      const finalGalleryImages = [...initialGalleryImages, ...newGalleryImagesData];
      
      // Prepare final data and send PUT request
      const finalData = { 
        ...formData, 
        coverImage: coverImageUrl, 
        galleryImages: finalGalleryImages,
        // Process comma-separated strings into arrays
        tags: splitStringToArray(formData.tags),
        languages: splitStringToArray(formData.languages),
        startTimes: splitStringToArray(formData.startTimes),
        // Ensure optional numbers are null if undefined
        maxGuests: formData.maxGuests === undefined ? null : formData.maxGuests,
        latitude: formData.latitude === undefined ? null : formData.latitude,
        longitude: formData.longitude === undefined ? null : formData.longitude
      };

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
              {/* Use ?? '' to safely handle null/undefined */}
              <OutlinedInput id="price-amount" name="amount" type="number" value={formData.price.amount ?? ''} onChange={handleNestedChange('price')} startAdornment={<InputAdornment position="start">EUR</InputAdornment>} label="Price Amount" required />
            </FormControl>
            <FormControl fullWidth required>
              
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select labelId="location-select-label" name="locationId" value={formData.locationId ?? ''} label="Location" onChange={(e) => setFormData(p => ({...p, locationId: e.target.value}))}>
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
        
        <TextField
            name="tags"
            label="Tags (comma-separated)"
            fullWidth
            value={formData.tags ?? ''}
            onChange={handleRootChange}
            helperText="e.g., Best Seller, New, Popular"
            sx={{ mb: 2 }}
        />

        {/* Quick Facts Fields */}
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Quick Facts Details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField name="maxGuests" label="Max Guests" type="number" fullWidth value={formData.maxGuests ?? ''} onChange={handleRootChange} />
            <TextField name="tourCode" label="Tour Code" fullWidth value={formData.tourCode ?? ''} onChange={handleRootChange} />
            <TextField name="languages" label="Languages (comma-separated)" fullWidth value={formData.languages ?? ''} onChange={handleRootChange} helperText="e.g., English, French" />
            <TextField name="startTimes" label="Start Times (comma-separated)" fullWidth value={formData.startTimes ?? ''} onChange={handleRootChange} helperText="e.g., 09:00, 14:00" />
        </Box>

        {/* Meeting Point Coordinates */}
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Meeting Point Coordinates (Optional)</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField 
                name="latitude" 
                label="Latitude (e.g., 31.6295)" 
                type="number" 
                fullWidth 
                value={formData.latitude ?? ''} 
                onChange={handleRootChange} 
                inputProps={{ step: "any" }}
            />
                <TextField 
                name="longitude" 
                label="Longitude (e.g., -7.9811)" 
                type="number" 
                fullWidth 
                value={formData.longitude ?? ''} 
                onChange={handleRootChange} 
                inputProps={{ step: "any" }}
            />
        </Box>
        
        <Divider sx={{ my: 2 }}><Chip label="Cover Image" /></Divider>
        <TextField disabled margin="dense" label="Current Cover Image URL" type="text" fullWidth value={formData.coverImage ?? ''} sx={{ mb: 1 }} />
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
        
        <Paper variant="outlined" sx={{ mt: 2, p: 1 }}>
            <List>
                {initialGalleryImages.map((image) => (
                    <ListItem key={image.path} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeInitialGalleryImage(image.path)}><DeleteIcon /></IconButton>}>
                        <ListItemAvatar><Avatar src={image.path} variant="rounded"/></ListItemAvatar>
                        <ListItemText primary="Existing image" primaryTypographyProps={{ variant: 'body2', noWrap: true, color: 'text.secondary' }} />
                    </ListItem>
                ))}
               {newGalleryImageFiles.map((file) => {
    // Find the progress for this specific file
    const fileProgress = uploadingFiles.find(f => f.name === file.name)?.progress || 0;
    
    return (
        <ListItem 
            key={file.name} 
            secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeNewGalleryImage(file.name)}>
                    <DeleteIcon />
                </IconButton>
            }
        >
            <ListItemAvatar>
                <Avatar src={URL.createObjectURL(file)} variant="rounded"/>
            </ListItemAvatar>
            
            {/* 3. Conditional Rendering for Text vs Progress Bar */}
            <ListItemText 
                primary={file.name} 
                secondary={
                    fileProgress > 0 && fileProgress < 100 ? (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress variant="determinate" value={fileProgress} />
                            <Typography variant="caption" color="text.secondary">
                                Uploading: {Math.round(fileProgress)}%
                            </Typography>
                        </Box>
                    ) : (
                        "Ready to upload"
                    )
                } 
                primaryTypographyProps={{ variant: 'body2', noWrap: true }} 
            />
        </ListItem>
    );
})}
            </List>
             {initialGalleryImages.length === 0 && newGalleryImageFiles.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{p: 2}}>No gallery images yet.</Typography>
             )}
        </Paper>

        {/* Translations & Content Section */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Translations</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
             <Tab label="English" value="en" />
             <Tab label="French" value="fr" />
             <Tab label="Spanish" value="es" />
          </Tabs>
        </Box>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField required name="title" label="Title" fullWidth value={formData.translations[currentTab]?.title ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
             {/* ▼▼▼ NEW FIELD ▼▼▼ */}
    <TextField 
      name="shortDescription" 
      label="Short Description (Card Summary)" 
      fullWidth 
      multiline 
      rows={2} 
      value={formData.translations[currentTab]?.shortDescription ?? ''} 
      onChange={handleNestedChange(`translations.${currentTab}`)} 
      helperText="A brief summary shown on the experience card (2-3 lines)."
    />
    {/* ▲▲▲ END NEW FIELD ▲▲▲ */}
            <TextField required name="description" label="Description" fullWidth multiline rows={4} value={formData.translations[currentTab]?.description ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            
            <TextField name="highlights" label="Highlights (Markdown list)" fullWidth multiline rows={4} value={formData.translations[currentTab]?.highlights ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use * for bullet points. e.g., * Sunset camel ride" />

            <Divider sx={{ my: 2 }}><Chip label="Inclusions & Details" /></Divider>
            <TextField name="included" label="What's Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.included ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="notIncluded" label="What's Not Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.notIncluded ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="importantInfo" label="Important Information" fullWidth multiline rows={4} value={formData.translations[currentTab]?.importantInfo ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="itinerary" label="Detailed Itinerary" fullWidth multiline rows={10} value={formData.translations[currentTab]?.itinerary ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use Markdown for formatting." />

            {/* FAQ Manager Section */}
            <Divider sx={{ my: 2 }}><Chip label={`FAQs (${currentTab.toUpperCase()})`} /></Divider>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {formData.translations[currentTab]?.faqs?.map((faq, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, p: 2, bg: 'white', borderRadius: 1, border: '1px solid #eee' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <TextField label={`Question ${index + 1}`} fullWidth value={faq.question ?? ''} onChange={(e) => handleFaqChange(currentTab, index, 'question', e.target.value)} sx={{ mb: 1 }} size="small" />
                    <TextField label="Answer" fullWidth multiline rows={2} value={faq.answer ?? ''} onChange={(e) => handleFaqChange(currentTab, index, 'answer', e.target.value)} size="small" />
                  </Box>
                  <IconButton onClick={() => handleRemoveFaq(currentTab, index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button startIcon={<AddIcon />} onClick={() => handleAddFaq(currentTab)} variant="outlined" size="small">
                Add FAQ ({currentTab.toUpperCase()})
              </Button>
            </Paper>
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