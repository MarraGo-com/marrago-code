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
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/client-data'; // Import your config
import { WebsiteLanguage } from '@/config/types';

/**
 * A reusable floating WhatsApp button that pulls client-specific data
 * from siteConfig and generic UI text from next-intl.
 */
export default function FloatingWhatsApp() {
  // --- 1. Get Generic UI Text from Translations ---
  // These keys are generic and reusable for all business types
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

  // Safely get team members with 'en' fallback
  const teamMembers =
    textContent?.[locale]?.aboutPage?.teamMembers ||
    textContent?.en?.aboutPage?.teamMembers ||
    [];
  const [teamMember1, teamMember2] = teamMembers;

  // --- THIS IS THE KEY UPDATE ---
  // Get client-specific modal text with 'en' fallback
  const modalDescription =
    textContent?.[locale]?.whatsAppModalContent?.modalDescription ||
    textContent?.en?.whatsAppModalContent?.modalDescription ||
    'Our team is ready to help. You will be speaking directly with:'; // Hardcoded safety fallback

  // Get client-specific prefilled text with 'en' fallback
  const prefilledMessage =
    textContent?.[locale]?.whatsAppModalContent?.prefilledText ||
    textContent?.en?.whatsAppModalContent?.prefilledText ||
    'Hello, I would like more information.'; // Hardcoded safety fallback
  // --- END OF UPDATE ---

  // Do not render if there's no WhatsApp number
  if (!whatsappNumber) {
    return null;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // --- 4. Generate URL ---
  // Safely get the current page URL (only runs on client)
    const currentUrl = window.location.href;

    // Combine the base message with the current URL
    // \n\n adds two new lines for clean formatting
  const finalMessage = `${prefilledMessage}\n\n(Regarding page: ${currentUrl})`;
  const encodedMessage = encodeURIComponent(finalMessage);
  const whatsAppUrl = `https://wa.me/${whatsappNumber.replace(
    /\D/g,
    ''
  )}?text=${encodedMessage}`;

  return (
    <>
      {/* The Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 24, md: 32 },
          right: { xs: 24, md: 32 },
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        <Tooltip title={tooltip} arrow>
          <Fab
            aria-label="Chat on WhatsApp"
            onClick={handleOpen}
            sx={{
              bgcolor: '#25D366',
              color: 'white',
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            <WhatsAppIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* The Contact Modal (The "Nice Card") */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="whatsapp-dialog-title"
        PaperProps={{ sx: { maxWidth: 400, width: '100%', m: 2 } }}
      >
        <DialogTitle
          id="whatsapp-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', p: 2 }}
        >
          <WhatsAppIcon sx={{ color: '#25D366', mr: 1.5, fontSize: '2rem' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {modalTitle} {/* <-- Uses generic translation */}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} sx={{ p: 0.5 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2 }}>
          {/* Client-specific description from siteConfig */}
          <Typography gutterBottom>
            {modalDescription} {/* <-- Uses client-specific config text */}
          </Typography>

          {/* Render Team from siteConfig */}
          <List sx={{ width: '100%' , py: 0 }}>
            {teamMember1 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={teamMember1.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={teamMember1.name}
                  secondary={teamMember1.title}
                />
              </ListItem>
            )}
            {teamMember2 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={teamMember2.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={teamMember2.name}
                  secondary={teamMember2.title}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>

        {/* Action Button */}
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
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {modalCta} {/* <-- Uses generic translation */}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}