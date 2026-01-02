// /src/components/admin/CreateExperience.tsx
'use client';

import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Typography, Box, LinearProgress, Tabs, Tab, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, InputAdornment, Divider,
  Chip, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Stack,
  Switch, FormControlLabel, Checkbox, SelectChangeEvent, useTheme, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useExperienceForm} from '@/hooks/useExperienceForm';
import { GalleryImage } from '@/types/experience';
import { locations } from '@/config/locations'; 
import { useTranslations } from 'next-intl';

// --- Import Constants ---
import { DURATION_UNITS, SUPPORTED_LANGUAGES, EXPERIENCE_TAGS } from '@/config/constants';

export default function CreateExperience() {
  const t = useTranslations('admin.experiences');
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Mobile Responsiveness Hooks
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

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
    // FAQ handlers
    handleAddFaq,
    handleFaqChange,
    handleRemoveFaq,
    // Timeline handlers
    handleAddTimelineStep,
    handleTimelineStepChange,
    handleRemoveTimelineStep
  } = useExperienceForm(null);

  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Handle standard dropdowns (Duration Unit)
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Multi-Select (Tags, Languages)
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
    if (!coverImageFile) {
      setError("A cover image is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // STEP 1: Initiate creation
      const initiateResponse = await fetch('/api/admin/experiences/initiate', { method: 'POST' });
      if (!initiateResponse.ok) throw new Error('Failed to get a new experience ID.');
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

      // STEP 3: Prepare final data
      const finalData = { 
          ...formData, 
          coverImage: coverImageUrl, 
          galleryImages: newGalleryImagesData,
          tags: formData.tags || [],
          languages: formData.languages || [],
          startTimes: typeof formData.startTimes === 'string' ? (formData.startTimes as string).split(',') : formData.startTimes,
          maxGuests: formData.maxGuests === undefined ? null : formData.maxGuests,
          latitude: formData.latitude === undefined ? null : formData.latitude,
          longitude: formData.longitude === undefined ? null : formData.longitude
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
        {t('buttons.add')}
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullScreen={fullScreen} 
        PaperProps={{ component: 'form', onSubmit: handleSubmit }} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>{t('createTitle')}</DialogTitle>
        <DialogContent>
            {/* General Information Section */}
            <Divider sx={{ my: 2 }}><Chip label={t('sections.general')} /></Divider>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="price-amount">{t('labels.price')}</InputLabel>
                  <OutlinedInput id="price-amount" name="amount" type="number" value={formData.price.amount} onChange={handleNestedChange('price')} startAdornment={<InputAdornment position="start">EUR</InputAdornment>} label={t('labels.price')} />
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel id="location-select-label">{t('labels.location')}</InputLabel>
                  <Select labelId="location-select-label" name="locationId" value={formData.locationId} label={t('labels.location')} onChange={(e) => setFormData(p => ({...p, locationId: e.target.value}))}>
                      {locations.map((loc) => (<MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>))}
                  </Select>
                </FormControl>
                
                {/* DURATION (Value + Unit) */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                      required
                      name="durationValue"
                      label={t('labels.duration')}
                      type="number"
                      fullWidth
                      value={formData.durationValue ?? ''}
                      onChange={handleRootChange}
                  />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>{t('labels.unit')}</InputLabel>
                    <Select
                      name="durationUnit"
                      value={formData.durationUnit ?? 'hours'}
                      label={t('labels.unit')}
                      onChange={handleSelectChange}
                    >
                      {DURATION_UNITS.map((u) => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
            </Box>

            {/* TAGS (Multi-Select) */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('labels.tags')}</InputLabel>
                <Select
                    multiple
                    name="tags"
                    value={formData.tags || []} 
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label={t('labels.tags')} />}
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

            {/* Quick Facts Fields */}
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>{t('sections.quickFacts')}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField name="maxGuests" label={t('labels.maxGuests')} type="number" fullWidth value={formData.maxGuests === undefined ? '' : formData.maxGuests} onChange={handleRootChange} />
                <TextField name="tourCode" label={t('labels.tourCode')} fullWidth value={formData.tourCode} onChange={handleRootChange} />
                
                {/* LANGUAGES (Multi-Select) */}
                <FormControl fullWidth>
                    <InputLabel>{t('labels.languages')}</InputLabel>
                    <Select
                        multiple
                        name="languages"
                        value={formData.languages || []}
                        onChange={handleMultiSelectChange}
                        input={<OutlinedInput label={t('labels.languages')} />}
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

                <TextField name="startTimes" label={t('labels.startTimes')} fullWidth value={formData.startTimes} onChange={handleRootChange} helperText={t('placeholders.startTimesHelper')} />
            </Box>

            {/* Meeting Point Coordinates */}
            <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, color: 'text.secondary' }}>{t('sections.meetingPoint')}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                 <TextField name="latitude" label={t('labels.latitude')} type="number" fullWidth value={formData.latitude === undefined ? '' : formData.latitude} onChange={handleRootChange} inputProps={{ step: "any" }} />
                 <TextField name="longitude" label={t('labels.longitude')} type="number" fullWidth value={formData.longitude === undefined ? '' : formData.longitude} onChange={handleRootChange} inputProps={{ step: "any" }} />
            </Box>

            {/* Booking Policy & Trust Signals */}
            <Divider sx={{ my: 2 }}><Chip label={t('sections.policy')} /></Divider>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                 <TextField
                    name="bookingPolicy.cancellationHours"
                    label={t('labels.cancelHours')}
                    type="number"
                    value={formData.bookingPolicy.cancellationHours}
                    onChange={handleNestedChange('bookingPolicy')}
                    helperText={t('placeholders.cancelHelper')}
                 />
                 <TextField
                    name="scarcity.spotsLeft"
                    label={t('labels.spotsLeft')}
                    type="number"
                    value={formData.scarcity.spotsLeft ?? ''}
                    onChange={handleNestedChange('scarcity')}
                    helperText={t('placeholders.spotsHelper')}
                 />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <FormControlLabel
                    control={<Switch checked={formData.bookingPolicy.isPayLater} onChange={handleNestedChange('bookingPolicy')} name="isPayLater" />}
                    label={t('labels.payLater')}
                />
                <FormControlLabel
                    control={<Switch checked={formData.bookingPolicy.instantConfirmation} onChange={handleNestedChange('bookingPolicy')} name="instantConfirmation" />}
                    label={t('labels.instantConfirm')}
                />
                 <FormControlLabel
                    control={<Switch checked={formData.scarcity.isLikelyToSellOut} onChange={handleNestedChange('scarcity')} name="isLikelyToSellOut" />}
                    label={t('labels.sellOutBadge')}
                />
                 <FormControlLabel
                    control={<Switch checked={formData.features.mobileTicket} onChange={handleNestedChange('features')} name="mobileTicket" />}
                    label={t('labels.mobileTicket')}
                />
            </Box>

            {/* Images Section */}
            <Divider sx={{ my: 2 }}><Chip label={t('sections.images')} /></Divider>
            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading} sx={{ mb: 2 }}>
                {isCompressing ? 'Compressing...' : t('buttons.uploadCover')}
                <input type="file" hidden required accept="image/*" onChange={handleCoverImageChange} />
            </Button>
            {coverImageFile && !isCompressing && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Selected: {coverImageFile.name}</Typography>}

            <Button variant="outlined" component="label" fullWidth disabled={isCompressing || loading}>
                {isCompressing ? 'Processing...' : t('buttons.addGallery')}
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
            <Divider sx={{ my: 3 }}><Chip label={t('sections.content')} /></Divider>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tabs 
                 value={currentTab} 
                 onChange={(e, newValue) => setCurrentTab(newValue)}
                 variant="scrollable" // Make tabs scrollable on mobile
                 scrollButtons="auto"
               >
                 <Tab label="English" value="en" />
                 <Tab label="French" value="fr" />
                 <Tab label="Spanish" value="es" />
              </Tabs>
            </Box>
            <Box sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField required name="title" label={t('labels.title')} fullWidth value={formData.translations[currentTab].title} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField 
                  name="shortDescription" 
                  label={t('labels.shortDesc')} 
                  fullWidth 
                  multiline 
                  rows={2} 
                  value={formData.translations[currentTab].shortDescription ?? ''} 
                  onChange={handleNestedChange(`translations.${currentTab}`)} 
                />
                <TextField required name="description" label={t('labels.desc')} fullWidth multiline rows={4} value={formData.translations[currentTab].description} onChange={handleNestedChange(`translations.${currentTab}`)} />
                
                <TextField name="highlights" label={t('labels.highlights')} fullWidth multiline rows={4} value={formData.translations[currentTab].highlights} onChange={handleNestedChange(`translations.${currentTab}`)} />

                <Divider sx={{ my: 1 }} />
                <TextField name="included" label={t('labels.included')} fullWidth multiline rows={3} value={formData.translations[currentTab].included} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="notIncluded" label={t('labels.notIncluded')} fullWidth multiline rows={3} value={formData.translations[currentTab].notIncluded} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="importantInfo" label={t('labels.importantInfo')} fullWidth multiline rows={3} value={formData.translations[currentTab].importantInfo} onChange={handleNestedChange(`translations.${currentTab}`)} />
                <TextField name="itinerary" label={t('labels.itinerary')} fullWidth multiline rows={6} value={formData.translations[currentTab].itinerary} onChange={handleNestedChange(`translations.${currentTab}`)} />

                {/* Visual Timeline Builder */}
                <Divider sx={{ my: 2 }}><Chip label={`${t('sections.timeline')} (${currentTab.toUpperCase()})`} /></Divider>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    {formData.translations[currentTab].program?.map((step, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                            {/* Mobile Adjustment: Stack direction */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                                <TextField
                                    label={`${t('timeline.stepTitle')} ${index + 1}`}
                                    fullWidth
                                    size="small"
                                    value={step.title}
                                    onChange={(e) => handleTimelineStepChange(currentTab, index, 'title', e.target.value)}
                                />
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>{t('timeline.type')}</InputLabel>
                                    <Select
                                        value={step.type}
                                        label={t('timeline.type')}
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
                            {/* Mobile Adjustment: Stack direction */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                                <TextField
                                    label={t('timeline.duration')}
                                    size="small"
                                    sx={{ flex: 1 }}
                                    value={step.duration}
                                    onChange={(e) => handleTimelineStepChange(currentTab, index, 'duration', e.target.value)}
                                />
                                <FormControl size="small" sx={{ flex: 1 }}>
                                    <InputLabel>{t('timeline.admission')}</InputLabel>
                                    <Select
                                        value={step.admission}
                                        label={t('timeline.admission')}
                                        onChange={(e) => handleTimelineStepChange(currentTab, index, 'admission', e.target.value)}
                                    >
                                        <MenuItem value="free">Free</MenuItem>
                                        <MenuItem value="included">Included</MenuItem>
                                        <MenuItem value="notIncluded">Not Included</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <TextField
                                label={t('timeline.description')}
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
                        {t('buttons.addTimeline')}
                    </Button>
                </Paper>
                
                {/* FAQ Manager */}
                <Divider sx={{ my: 2 }}><Chip label={`${t('sections.faq')} (${currentTab.toUpperCase()})`} /></Divider>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {formData.translations[currentTab].faqs?.map((faq, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, p: 2, bg: 'white', borderRadius: 1, border: '1px solid #eee' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <TextField label={`Question ${index + 1}`} fullWidth value={faq.question} onChange={(e) => handleFaqChange(currentTab, index, 'question', e.target.value)} sx={{ mb: 1 }} size="small" />
                        <TextField label="Answer" fullWidth multiline rows={2} value={faq.answer} onChange={(e) => handleFaqChange(currentTab, index, 'answer', e.target.value)} size="small" />
                      </Box>
                      <IconButton onClick={() => handleRemoveFaq(currentTab, index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={() => handleAddFaq(currentTab)} variant="outlined" size="small">
                    {t('buttons.addFaq')} ({currentTab.toUpperCase()})
                  </Button>
                </Paper>
            </Box>

            {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
            
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
          <Button onClick={handleClose} disabled={loading}>{t('buttons.cancel')}</Button>
          <Button type="submit" variant="contained" disabled={loading || isCompressing} size="large">
            {loading ? 'Creating...' : t('buttons.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}