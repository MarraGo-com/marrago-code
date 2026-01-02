// src/components/admin/ExperiencesTable.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, Button, CircularProgress, Box, useTheme, useMediaQuery, 
  Card, Stack 
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // 👈 Import alpha helper
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditExperienceForm from './EditExperienceForm';
import { useLocale, useTranslations } from 'next-intl';
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';
import { WebsiteLanguage } from '@/config/types';

interface ExperiencesTableProps {
  experiences: Experience[];
}

export default function ExperiencesTable({ experiences }: ExperiencesTableProps) {
  const t = useTranslations('admin.ExperiencesTable'); 
  const locale = useLocale() as WebsiteLanguage;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // --- Handlers ---
  const handleEdit = async (experience: Experience) => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/experiences/${experience.id}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setSelectedExperience(data.experience);
      setEditModalOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error loading data");
    } finally {
      setIsFetching(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedExperience(null);
  };

  const handleDeleteClick = (experience: Experience) => {
    setItemToDelete(experience);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/experiences/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      handleCloseDeleteDialog();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  const getLocationName = (id: string | undefined) => {
     return locations.find(
       (loc) => loc.id.trim().toLowerCase() === id?.trim().toLowerCase()
     )?.name || t('unknownLocation');
  };

  return (
    <>
      {isFetching && (
        <Box sx={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          bgcolor: alpha(theme.palette.background.paper, 0.7), // 👈 Dynamic Overlay
          zIndex: 9999, 
          display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {experiences.length === 0 ? (
        <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          {t('noItemsFound')}
        </Typography>
      ) : (
        <>
          {/* ▼▼▼ MOBILE VIEW (CARDS) ▼▼▼ */}
          {isMobile ? (
            <Stack spacing={2}>
              {experiences.map((row) => {
                 const formattedPrice = row.price ? `${row.price.amount} ${row.price.currency}` : 'N/A';
                 const locationName = getLocationName(row.locationId);
                 const bgImage = row.coverImage || ''; 

                 return (
                  <Card 
                    key={row.id} 
                    sx={{ 
                      bgcolor: 'background.paper', // Replaced #1a1a1a
                      color: 'text.primary',       // Replaced 'white'
                      border: 1, 
                      borderColor: 'divider',      // Replaced manual RGBA border
                      borderRadius: 2 
                    }}
                  >
                    <Stack direction="row" sx={{ p: 2, gap: 2 }}>
                       <Box sx={{ 
                          width: 80, height: 80, borderRadius: 2, flexShrink: 0,
                          bgcolor: 'action.hover', // Replaced rgba(255,255,255,0.05)
                          backgroundImage: `url(${bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                       }} />
                       
                       <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }} noWrap>
                            {row.translations?.[locale]?.title || t('untitled')}
                          </Typography>
                          
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1, color: 'text.secondary' }}> {/* Replaced rgba white */}
                            <LocationOnIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{locationName}</Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                             {/* Replaced #D97706 with primary.main */}
                             <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                {formattedPrice}
                             </Typography>
                             
                             <Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(row)} 
                                  disabled={isFetching} 
                                  sx={{ color: 'text.secondary' }} // Replaced 'white'
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteClick(row)} 
                                  disabled={isFetching} 
                                  sx={{ color: 'error.main' }} // Replaced #ef4444
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                             </Box>
                          </Stack>
                       </Box>
                    </Stack>
                  </Card>
                 )
              })}
            </Stack>
          ) : (
            /* ▼▼▼ DESKTOP VIEW (TABLE) ▼▼▼ */
            <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
              <Table sx={{ minWidth: 650 }} aria-label="experiences table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headerTitle')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headerLocation')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('headerPrice')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('headerActions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {experiences.map((row) => {
                    const formattedPrice = row.price ? `${row.price.amount} ${row.price.currency}` : 'N/A';
                    const locationName = getLocationName(row.locationId);

                    return (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{row.translations?.[locale]?.title || t('untitled')}</TableCell>
                        <TableCell>{locationName}</TableCell>
                        <TableCell>{formattedPrice}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(row)} aria-label="edit" disabled={isFetching}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDeleteClick(row)} aria-label="delete" sx={{ color: 'error.main' }} disabled={isFetching}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Modals */}
      <EditExperienceForm 
        open={editModalOpen}
        onClose={handleCloseEditModal}
        experience={selectedExperience}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('deleteDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deleteDialogWarning', { title: itemToDelete?.translations?.[locale].title ?? t('untitled') })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{t('cancelButton')}</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : t('deleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}