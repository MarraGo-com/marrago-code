// /src/components/admin/EditExperienceForm.tsx
'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Stack,
  LinearProgress, Switch, FormControlLabel, Checkbox, SelectChangeEvent // <--- Added SelectChangeEvent & Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm';
import { Experience, GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations';

// --- NEW: Import Constants ---
import { DURATION_UNITS, SUPPORTED_LANGUAGES, EXPERIENCE_TAGS } from '@/config/constants';

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
    // FAQ Handlers
    handleAddFaq,
    handleFaqChange,
    handleRemoveFaq,
    // Timeline Handlers
    handleAddTimelineStep,
    handleTimelineStepChange,
    handleRemoveTimelineStep
  } = useExperienceForm(experience);

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Handlers for Selectors ---

  // Handle standard dropdowns (Duration Unit)
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Multi-Select (Tags, Languages) -> Saves as Array ['en', 'fr']
  const handleMultiSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleRootChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({
        ...prev,
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

    setLoading(true);
    setError(null);

    try {
      let coverImageUrl = formData.coverImage;
      if (coverImageFile) {
         // ... (Keep existing image upload logic) ...
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

      // ... (Keep existing gallery upload logic) ...
      let newGalleryImagesData: GalleryImage[] = [];
      if (newGalleryImageFiles.length > 0) {
        // ... (standard upload logic)
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

      const finalGalleryImages = [...initialGalleryImages, ...newGalleryImagesData];
      
      // --- NEW: Submit Logic (Arrays are already Arrays) ---
      const finalData = { 
        ...formData, 
        coverImage: coverImageUrl, 
        galleryImages: finalGalleryImages,
        // REMOVED: splitStringToArray calls. Arrays are passed directly.
        tags: formData.tags,         
        languages: formData.languages,
        startTimes: typeof formData.startTimes === 'string' ? (formData.startTimes as string).split(',') : formData.startTimes, // Keep logic if startTimes is still string
        maxGuests: formData.maxGuests === undefined ? null : formData.maxGuests,
        latitude: formData.latitude === undefined ? null : formData.latitude,
        longitude: formData.longitude === undefined ? null : formData.longitude
      };

      const response = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error((await response.json()).message);

      onClose();
      router.refresh();

    } catch (err: unknown) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      setUploadingFiles([]);
    }
  };

  const handleClose = () => { if (!loading) onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }} maxWidth="md" fullWidth>
      <DialogTitle>Edit Experience</DialogTitle>
      <DialogContent>
        {/* General Info */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>General Information</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="price-amount">Price Amount</InputLabel>
              <OutlinedInput id="price-amount" name="amount" type="number" value={formData.price.amount ?? ''} onChange={handleNestedChange('price')} startAdornment={<InputAdornment position="start">EUR</InputAdornment>} label="Price Amount" required />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select labelId="location-select-label" name="locationId" value={formData.locationId ?? ''} label="Location" onChange={(e) => setFormData(p => ({...p, locationId: e.target.value}))}>
                {locations.map((loc) => (<MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>))}
              </Select>
            </FormControl>
            
            {/* ▼▼▼ REFACTORED DURATION (Value + Unit) ▼▼▼ */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                  required
                  name="durationValue"
                  label="Duration"
                  type="number"
                  fullWidth
                  value={formData.durationValue ?? ''}
                  onChange={handleRootChange}
              />
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="durationUnit"
                  value={formData.durationUnit ?? 'hours'}
                  label="Unit"
                  onChange={handleSelectChange} // Use new handler
                >
                  {DURATION_UNITS.map((u) => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
        </Box>
        
        {/* ▼▼▼ REFACTORED TAGS (Multi-Select) ▼▼▼ */}
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tags (Strict)</InputLabel>
            <Select
                multiple
                name="tags"
                value={formData.tags || []} // Ensure it's an array
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Tags (Strict)" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                            <Chip key={value} label={EXPERIENCE_TAGS.find(t=>t.value===value)?.label || value} size="small" />
                        ))}
                    </Box>
                )}
            >
                {EXPERIENCE_TAGS.map((tag) => (
                    <MenuItem key={tag.value} value={tag.value}>
                        <Checkbox checked={(formData.tags || []).indexOf(tag.value) > -1} />
                        <ListItemText primary={tag.label} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        {/* Quick Facts */}
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Quick Facts Details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <TextField name="maxGuests" label="Max Guests" type="number" fullWidth value={formData.maxGuests ?? ''} onChange={handleRootChange} />
            <TextField name="tourCode" label="Tour Code" fullWidth value={formData.tourCode ?? ''} onChange={handleRootChange} />
            
            {/* ▼▼▼ REFACTORED LANGUAGES (Multi-Select) ▼▼▼ */}
            <FormControl fullWidth>
                <InputLabel>Languages</InputLabel>
                <Select
                    multiple
                    name="languages"
                    value={formData.languages || []}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="Languages" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                                <Chip key={value} label={SUPPORTED_LANGUAGES.find(l=>l.code===value)?.label || value} size="small" />
                            ))}
                        </Box>
                    )}
                >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                            <Checkbox checked={(formData.languages || []).indexOf(lang.code) > -1} />
                            <ListItemText primary={lang.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField name="startTimes" label="Start Times (comma-separated)" fullWidth value={formData.startTimes ?? ''} onChange={handleRootChange} helperText="e.g., 09:00, 14:00" />
        </Box>

        {/* ... (Rest of the file remains UNTOUCHED: Maps, Booking Policy, Images, Timeline, FAQs) ... */}
        {/* Just paste the rest of your component here from 'Meeting Point' downwards */}
        
        {/* Meeting Point Coordinates */}
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>Meeting Point Coordinates (Optional)</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField name="latitude" label="Latitude" type="number" fullWidth value={formData.latitude ?? ''} onChange={handleRootChange} inputProps={{ step: "any" }} />
                <TextField name="longitude" label="Longitude" type="number" fullWidth value={formData.longitude ?? ''} onChange={handleRootChange} inputProps={{ step: "any" }} />
        </Box>

        {/* ▼▼▼ NEW: Booking Policy & Trust Signals ▼▼▼ */}
        <Divider sx={{ my: 2 }}><Chip label="Booking Policy & Trust" /></Divider>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
             <TextField
                name="bookingPolicy.cancellationHours"
                label="Free Cancellation (Hours before)"
                type="number"
                value={formData.bookingPolicy.cancellationHours}
                onChange={handleNestedChange('bookingPolicy')}
                helperText="e.g. 24"
             />
             <TextField
                name="scarcity.spotsLeft"
                label="Spots Left (Scarcity Trigger)"
                type="number"
                value={formData.scarcity.spotsLeft ?? ''}
                onChange={handleNestedChange('scarcity')}
                helperText="Leave empty to disable. < 5 triggers 'Only X left'"
             />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <FormControlLabel
                control={<Switch checked={formData.bookingPolicy.isPayLater} onChange={handleNestedChange('bookingPolicy')} name="isPayLater" />}
                label="Reserve Now, Pay Later"
            />
            <FormControlLabel
                control={<Switch checked={formData.bookingPolicy.instantConfirmation} onChange={handleNestedChange('bookingPolicy')} name="instantConfirmation" />}
                label="Instant Confirmation"
            />
             <FormControlLabel
                control={<Switch checked={formData.scarcity.isLikelyToSellOut} onChange={handleNestedChange('scarcity')} name="isLikelyToSellOut" />}
                label="Badge: 'Likely to Sell Out'"
            />
             <FormControlLabel
                control={<Switch checked={formData.features.mobileTicket} onChange={handleNestedChange('features')} name="mobileTicket" />}
                label="Mobile Ticket Accepted"
            />
        </Box>
        {/* ▲▲▲ END Booking Policy ▲▲▲ */}
        
        {/* Cover Image */}
        <Divider sx={{ my: 2 }}><Chip label="Cover Image" /></Divider>
        <TextField disabled margin="dense" label="Current Cover Image URL" type="text" fullWidth value={formData.coverImage ?? ''} sx={{ mb: 1 }} />
        <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
          {isCompressing ? 'Compressing...' : 'Upload New Cover Image'}
          <input type="file" hidden accept="image/*" onChange={handleCoverImageChange} />
        </Button>
        {coverImageFile && !isCompressing && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>New cover selected: {coverImageFile.name}</Typography>}

        {/* Gallery Images */}
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
                  const fileProgress = uploadingFiles.find(f => f.name === file.name)?.progress || 0;
                  return (
                      <ListItem key={file.name} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeNewGalleryImage(file.name)}><DeleteIcon /></IconButton>}>
                          <ListItemAvatar><Avatar src={URL.createObjectURL(file)} variant="rounded"/></ListItemAvatar>
                          <ListItemText 
                              primary={file.name} 
                              secondary={fileProgress > 0 && fileProgress < 100 ? (
                                      <Box sx={{ width: '100%', mt: 1 }}>
                                          <LinearProgress variant="determinate" value={fileProgress} />
                                          <Typography variant="caption" color="text.secondary">Uploading: {Math.round(fileProgress)}%</Typography>
                                      </Box>
                                  ) : "Ready to upload"
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
            <TextField required name="description" label="Description" fullWidth multiline rows={4} value={formData.translations[currentTab]?.description ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            
            <TextField name="highlights" label="Highlights (Markdown list)" fullWidth multiline rows={4} value={formData.translations[currentTab]?.highlights ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use * for bullet points. e.g., * Sunset camel ride" />

            <Divider sx={{ my: 2 }}><Chip label="Inclusions & Details" /></Divider>
            <TextField name="included" label="What's Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.included ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="notIncluded" label="What's Not Included" fullWidth multiline rows={4} value={formData.translations[currentTab]?.notIncluded ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="importantInfo" label="Important Information" fullWidth multiline rows={4} value={formData.translations[currentTab]?.importantInfo ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} />
            <TextField name="itinerary" label="Detailed Itinerary (Markdown - Fallback)" fullWidth multiline rows={6} value={formData.translations[currentTab]?.itinerary ?? ''} onChange={handleNestedChange(`translations.${currentTab}`)} helperText="Use Markdown if you don't use the Visual Timeline." />

            {/* ▼▼▼ Visual Timeline Builder (Pro) ▼▼▼ */}
            <Divider sx={{ my: 2 }}><Chip label={`Visual Timeline (${currentTab.toUpperCase()})`} /></Divider>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                {formData.translations[currentTab]?.program?.map((step, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <TextField
                                label={`Step ${index + 1} Title`}
                                fullWidth
                                size="small"
                                value={step.title}
                                onChange={(e) => handleTimelineStepChange(currentTab, index, 'title', e.target.value)}
                            />
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={step.type}
                                    label="Type"
                                    onChange={(e) => handleTimelineStepChange(currentTab, index, 'type', e.target.value)}
                                >
                                    <MenuItem value="stop">Stop</MenuItem>
                                    <MenuItem value="passBy">Pass By</MenuItem>
                                    <MenuItem value="transport">Transport</MenuItem>
                                    <MenuItem value="admission">Admission</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => handleRemoveTimelineStep(currentTab, index)} color="error" size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Duration"
                                size="small"
                                sx={{ flex: 1 }}
                                value={step.duration}
                                onChange={(e) => handleTimelineStepChange(currentTab, index, 'duration', e.target.value)}
                                helperText="e.g. 30 mins"
                            />
                            <FormControl size="small" sx={{ flex: 1 }}>
                                <InputLabel>Admission</InputLabel>
                                <Select
                                    value={step.admission}
                                    label="Admission"
                                    onChange={(e) => handleTimelineStepChange(currentTab, index, 'admission', e.target.value)}
                                >
                                    <MenuItem value="free">Free</MenuItem>
                                    <MenuItem value="included">Included</MenuItem>
                                    <MenuItem value="notIncluded">Not Included</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            size="small"
                            value={step.description}
                            onChange={(e) => handleTimelineStepChange(currentTab, index, 'description', e.target.value)}
                        />
                    </Paper>
                ))}
                <Button startIcon={<AddIcon />} onClick={() => handleAddTimelineStep(currentTab)} variant="outlined" size="small">
                    Add Timeline Step
                </Button>
            </Paper>
            {/* ▲▲▲ END Timeline Builder ▲▲▲ */}

            {/* FAQ Manager */}
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