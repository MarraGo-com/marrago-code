// /src/components/admin/ExperiencesTable.tsx
'use client';

import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditExperienceForm from './EditExperienceForm';
import { useLocale, useTranslations } from 'next-intl';
import { Experience } from '@/types/experience';
import { locations } from '@/config/locations';
import { WebsiteLanguage } from '@/config/types';

interface ExperiencesTableProps {
  experiences: Experience[];
}

export default function ExperiencesTable({ experiences }: ExperiencesTableProps) {
  const t = useTranslations('ExperiencesTable');
  const locale = useLocale() as WebsiteLanguage;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // ▼▼▼ NEW STATE FOR FETCHING ▼▼▼
  const [isFetching, setIsFetching] = useState(false);
  // ▲▲▲

  // ▼▼▼ UPDATED HANDLE EDIT FUNCTION ▼▼▼
  const handleEdit = async (experience: Experience) => {
    setIsFetching(true);
    try {
      // Fetch fresh data from the public API, using a timestamp to bust cache
      // We use the public API because it already returns the full, processed experience object
      // that matches our TypeScript interface.
      const response = await fetch(`/api/experiences/${experience.id}?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch fresh experience data.');
      }
      const data = await response.json();
      
      // Set the fresh data and open the modal
      setSelectedExperience(data.experience);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching fresh data:", error);
      alert("Failed to load latest experience data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };
  // ▲▲▲ END UPDATED FUNCTION ▲▲▲
  
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
      if (!response.ok) {
        throw new Error('Failed to delete experience.');
      }
      handleCloseDeleteDialog();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error: Could not delete experience.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* ▼▼▼ LOADING OVERLAY ▼▼▼ */}
      {isFetching && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, left: 0, width: '100%', height: '100%', 
          bgcolor: 'rgba(0,0,0,0.3)', zIndex: 9999, 
          display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
          <CircularProgress color="primary" />
        </Box>
      )}
      {/* ▲▲▲ END LOADING OVERLAY ▲▲▲ */}

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
            {experiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    {t('noItemsFound')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              experiences.map((row) => {
                const formattedPrice = row.price ? `${row.price.amount} ${row.price.currency}` : 'N/A';
                
                const locationName = locations.find(
                  (loc) => loc.id.trim().toLowerCase() === row.locationId?.trim().toLowerCase()
                )?.name || 'Unknown Location';

                return (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{row.translations?.[locale]?.title}</TableCell>
                    <TableCell>{locationName}</TableCell>
                    <TableCell>{formattedPrice}</TableCell>
                    <TableCell align="right">
                      {/* ▼▼▼ DISABLED WHILE FETCHING ▼▼▼ */}
                      <IconButton onClick={() => handleEdit(row)} aria-label="edit" disabled={isFetching}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(row)} aria-label="delete" sx={{ color: 'error.main' }} disabled={isFetching}><DeleteIcon /></IconButton>
                    </TableCell>
                    
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditExperienceForm 
        open={editModalOpen}
        onClose={handleCloseEditModal}
        experience={selectedExperience}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('deleteDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deleteDialogWarning', { title: itemToDelete?.translations?.[locale].title ?? '' })}
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