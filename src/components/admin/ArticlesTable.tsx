// src/components/admin/ArticlesTable.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Typography, Chip, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Button, CircularProgress, 
  useTheme, useMediaQuery, Stack, Card, Box, Avatar
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // 👈 Import alpha helper
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article'; 
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface Article {
  id: string;
  title: string;
  status: 'published' | 'draft';
  createdAt: string;
  slug?: string;
}

interface ArticlesTableProps {
  articles: Article[];
}

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const t = useTranslations('admin.AdminBlogTable');
  
  // --- EXISTING STATE & LOGIC ---
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // --- RESPONSIVE LOGIC ---
  const theme = useTheme(); // 👈 Accessed here for palette colors
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDeleteClick = (article: Article) => {
    setItemToDelete(article);
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
      const response = await fetch(`/api/admin/articles/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) { throw new Error('Failed to delete article.'); }
      handleCloseDeleteDialog();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(t('errors.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Localized Status Chips
  const getStatusChip = (status: string) => {
     const isPublished = status === 'published';
     return (
        <Chip 
           label={isPublished ? t('status.published') : t('status.draft')} 
           color={isPublished ? 'success' : 'default'} 
           size="small" 
           sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
        />
     );
  };

  // --- MOBILE CARD RENDERER ---
  const renderMobileCard = (row: Article) => (
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
          {/* Icon Avatar */}
          <Avatar 
            variant="rounded" 
            sx={{ 
              width: 50, 
              height: 50, 
              // Dynamic Background: Primary color with 10% opacity
              bgcolor: alpha(theme.palette.primary.main, 0.1), 
              color: 'primary.main' // Replaced #D97706
            }}
          >
            <ArticleIcon />
          </Avatar>
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
             <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>
                {row.title}
             </Typography>
             
             {row.slug && (
                 <Typography 
                   variant="caption" 
                   sx={{ 
                     color: 'text.secondary', // Replaced rgba(255,255,255,0.5)
                     display: 'block', 
                     mb: 1, 
                     fontFamily: 'monospace' 
                   }}
                 >
                    /{row.slug}
                 </Typography>
             )}
             
             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    {getStatusChip(row.status)}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}> {/* Replaced rgba white */}
                        {row.createdAt}
                    </Typography>
                </Stack>
                
                <Box>
                    <IconButton 
                        size="small" 
                        component={Link} 
                        href={`/admin/blog/edit/${row.id}`}
                        sx={{ color: 'text.secondary' }} // Replaced 'white' to make it visible in Light mode
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(row)}
                        sx={{ color: 'error.main' }} // Replaced #ef4444
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
             </Stack>
          </Box>
       </Stack>
    </Card>
  );

  return (
    <>
      {articles.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {t('noArticles')}
          </Typography>
      ) : (
        <>
            {/* MOBILE VIEW */}
            {isMobile ? (
                <Stack spacing={0}>
                    {articles.map((row) => renderMobileCard(row))}
                </Stack>
            ) : (
                /* DESKTOP VIEW */
                <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="articles table">
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.title')}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.status')}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t('headers.date')}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('headers.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles.map((row) => (
                            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                {row.title}
                            </TableCell>
                            <TableCell>{getStatusChip(row.status)}</TableCell>
                            <TableCell>{row.createdAt}</TableCell>
                            <TableCell align="right">
                                <IconButton component={Link} href={`/admin/blog/edit/${row.id}`} aria-label="edit"><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDeleteClick(row)} aria-label="delete" sx={{ color: 'error.main' }}><DeleteIcon /></IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
      )}

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
           {t('deleteDialog.message', { title: itemToDelete?.title || '' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>{t('deleteDialog.cancel')}</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : t('deleteDialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}