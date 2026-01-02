// src/components/admin/ReviewsTable.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, Rating, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, CircularProgress, 
  useTheme, useMediaQuery, Stack, Card, Box, Avatar, Typography, Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // 👈 Import alpha helper
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { useAppRouter } from '@/hooks/router/useAppRouter';
import { Review } from '@/types/review';
import { useTranslations } from 'next-intl'; 

interface ReviewsTableProps {
  reviews: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
  const t = useTranslations('admin.AdminReviewsTable');
  const router = useAppRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loadingState, setLoadingState] = useState<{ [key: string]: boolean }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Review | null>(null);

  // --- ACTIONS ---
  const handleApprove = async (reviewId: string) => {
    setLoadingState(prev => ({ ...prev, [reviewId]: true }));
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true }),
      });
      if (!response.ok) throw new Error('Failed to approve review.');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(t('errors.approveFailed')); 
    } finally {
      setLoadingState(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDeleteClick = (review: Review) => {
    setItemToDelete(review);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoadingState(prev => ({ ...prev, [itemToDelete.id]: true }));
    try {
      const response = await fetch(`/api/admin/reviews/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review.');
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(t('errors.deleteFailed')); 
    } finally {
      setLoadingState(prev => ({ ...prev, [itemToDelete.id]: false }));
    }
  };

  // --- MOBILE CARD RENDERER ---
  const renderMobileCard = (row: Review) => (
    <Card 
      key={row.id} 
      sx={{ 
        bgcolor: 'background.paper', // Replaced #1a1a1a
        color: 'text.primary',       // Replaced 'white'
        border: 1, 
        borderColor: 'divider',      // Replaced manual RGBA border
        borderRadius: 2, 
        mb: 2, 
        p: 2 
      }}
    >
       <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar 
            sx={{ 
              // Dynamic Background: Primary color with opacity
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              color: 'primary.main' // Replaced #D97706
            }}
          >
             <PersonIcon />
          </Avatar>
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
             <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                 <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                       {row.authorName}
                    </Typography>
                    <Rating value={row.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                 </Box>
                 <Chip 
                   label={row.isApproved ? t('status.approved') : t('status.pending')} 
                   color={row.isApproved ? 'success' : 'warning'}
                   size="small"
                   sx={{ fontWeight: 'bold' }}
                 />
             </Stack>

             {/* Quote Box */}
             <Typography 
               variant="body2" 
               sx={{ 
                 color: 'text.secondary', // Replaced rgba(255,255,255,0.8)
                 my: 1.5, 
                 fontStyle: 'italic', 
                 // Dynamic Background: Uses standard action hover color for subtle contrast
                 bgcolor: 'action.hover', 
                 p: 1, 
                 borderRadius: 1 
               }}
             >
                "{row.text}"
             </Typography>
             
             <Stack direction="row" justifyContent="flex-end" spacing={1}>
                 {!row.isApproved && (
                     <IconButton 
                       size="small" 
                       onClick={() => handleApprove(row.id)} 
                       disabled={loadingState[row.id]}
                       sx={{ 
                         color: 'success.main', // Replaced #4ade80
                         border: 1,
                         // Dynamic Border: Green with 30% opacity
                         borderColor: alpha(theme.palette.success.main, 0.3) 
                       }}
                     >
                        {loadingState[row.id] ? <CircularProgress size={16} /> : <CheckCircleIcon fontSize="small" />}
                     </IconButton>
                 )}
                 <IconButton 
                   size="small" 
                   onClick={() => handleDeleteClick(row)} 
                   disabled={loadingState[row.id]}
                   sx={{ 
                     color: 'error.main', // Replaced #ef4444
                     border: 1,
                     // Dynamic Border: Red with 30% opacity
                     borderColor: alpha(theme.palette.error.main, 0.3)
                   }}
                 >
                    {loadingState[row.id] ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                 </IconButton>
             </Stack>
          </Box>
       </Stack>
    </Card>
  );

  return (
    <>
      {reviews.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {t('noReviews')}
          </Typography>
      ) : (
        <>
            {isMobile ? (
                <Stack spacing={0}>
                    {reviews.map((row) => renderMobileCard(row))}
                </Stack>
            ) : (
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="reviews table">
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.author')}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.review')}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.rating')}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.status')}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('headers.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell sx={{ verticalAlign: 'top' }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{row.authorName.charAt(0)}</Avatar>
                                    <Typography variant="body2">{row.authorName}</Typography>
                                </Stack>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top', maxWidth: 300 }}>
                                <Typography variant="body2" noWrap>{row.text}</Typography>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top' }}><Rating value={row.rating} readOnly size="small" /></TableCell>
                            <TableCell sx={{ verticalAlign: 'top' }}>
                            <Chip 
                                label={row.isApproved ? t('status.approved') : t('status.pending')} 
                                color={row.isApproved ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                            </TableCell>
                            <TableCell align="right">
                            {!row.isApproved && (
                                <Tooltip title={t('actions.approve')}>
                                    <IconButton 
                                    onClick={() => handleApprove(row.id)} 
                                    aria-label="approve" 
                                    color="success"
                                    disabled={loadingState[row.id]}
                                    >
                                    {loadingState[row.id] ? <CircularProgress size={22} /> : <CheckCircleIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title={t('actions.delete')}>
                                <IconButton 
                                    onClick={() => handleDeleteClick(row)} 
                                    aria-label="delete" 
                                    color="error"
                                    disabled={loadingState[row.id]}
                                >
                                    {loadingState[row.id] ? <CircularProgress size={22} /> : <DeleteIcon />}
                                </IconButton>
                            </Tooltip>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('deleteDialog.message', { name: itemToDelete?.authorName || 'Unknown' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('actions.cancel')}</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}