'use client';

import React, { useState } from 'react';
import {
  Fab,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Zoom, // Added Zoom for smooth entry
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data'; 
import { WebsiteLanguage } from '@/config/types';

/**
 * A reusable floating WhatsApp button that pulls client-specific data
 * from siteConfig and generic UI text from next-intl.
 */
export default function FloatingWhatsApp() {
  // --- 1. Get Generic UI Text from Translations ---
  const t = useTranslations('WhatsApp');
  const modalTitle = t('modalTitle');
  const modalCta = t('modalCta');
  const tooltip = t('tooltip');

  // --- 2. Get State & Locale ---
  const [open, setOpen] = useState(false);
  const locale = useLocale() as WebsiteLanguage;

  // --- 3. Get Client-Specific Data from siteConfig ---
  const { whatsappNumber } = siteConfig.contact;
  const textContent = siteConfig.textContent;

  const teamMembers =
    textContent?.[locale]?.aboutPage?.teamMembers ||
    textContent?.en?.aboutPage?.teamMembers ||
    [];
  const [teamMember1, teamMember2] = teamMembers;

  const modalDescription =
    textContent?.[locale]?.whatsAppModalContent?.modalDescription ||
    textContent?.en?.whatsAppModalContent?.modalDescription ||
    'Our team is ready to help. You will be speaking directly with:'; 

  const prefilledMessage =
    textContent?.[locale]?.whatsAppModalContent?.prefilledText ||
    textContent?.en?.whatsAppModalContent?.prefilledText ||
    'Hello, I would like more information.'; 

  // Do not render if there's no WhatsApp number
  if (!whatsappNumber) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // --- 4. Generate URL ---
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const finalMessage = `${prefilledMessage}\n\n(Regarding page: ${currentUrl})`;
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsAppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

  return (
    <>
      {/* The Floating Button */}
      <Zoom in={true}>
        <Box
          sx={{
            position: 'fixed',
            // 🟢 THE FIX: Responsive Positioning
            // xs: 90px (Clears the Mobile Nav Bar)
            // md: 32px (Standard Desktop Position)
            bottom: { xs: 90, md: 32 }, 
            right: { xs: 24, md: 32 },
            zIndex: (theme) => theme.zIndex.fab,
          }}
        >
          <Tooltip title={tooltip} arrow placement="left">
            <Fab
              aria-label="Chat on WhatsApp"
              onClick={handleOpen}
              sx={{
                bgcolor: '#25D366',
                color: 'white',
                '&:hover': { bgcolor: '#128C7E' },
                boxShadow: 6
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 28 }} />
            </Fab>
          </Tooltip>
        </Box>
      </Zoom>

      {/* The Contact Modal (Unchanged) */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="whatsapp-dialog-title"
        PaperProps={{ sx: { maxWidth: 400, width: '100%', m: 2, borderRadius: 3 } }}
      >
        <DialogTitle
          id="whatsapp-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f5f5f5' }}
        >
          <WhatsAppIcon sx={{ color: '#25D366', mr: 1.5, fontSize: '2rem' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {modalTitle} 
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            {modalDescription} 
          </Typography>

          <List sx={{ width: '100%' , py: 1 }}>
            {teamMember1 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={teamMember1.image} sx={{ width: 50, height: 50 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight="bold">{teamMember1.name}</Typography>}
                  secondary={teamMember1.title}
                />
              </ListItem>
            )}
            {teamMember2 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={teamMember2.image} sx={{ width: 50, height: 50 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight="bold">{teamMember2.name}</Typography>}
                  secondary={teamMember2.title}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            component="a"
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: '#25D366',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: '100%',
              py: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {modalCta}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}