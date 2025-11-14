"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Box,
  Paper,
  Typography,
  IconButton,
 // Divider,
  Stack,
  Switch,
  Button,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CookieConsentState } from "@/contexts/CookieConsentContext";

type Props = {
  currentConsent: CookieConsentState;
  onClose: () => void;
  onSave: (newState: CookieConsentState) => void;
};

// --- MUI Toggle Switch Row Component ---
function ToggleSwitchRow({
  title,
  description,
  id,
  checked,
  onChange,
  disabled = false,
}: {
  title: string;
  description: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}
    >
      <FormControlLabel
        control={
          <Switch
            id={id}
            checked={checked}
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
          />
        }
        label={
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        }
        sx={{ justifyContent: 'space-between', ml: 0, width: '100%' }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', pl: '8px' }}>
        {description}
      </Typography>
    </Paper>
  );
}
// --- End Toggle Switch Row Component ---

export default function CookieModal({ currentConsent, onClose, onSave }: Props) {
  const t = useTranslations("CookieConsent");
  const [localConsent, setLocalConsent] = useState(currentConsent);

  // Sync local state if prop changes
  useEffect(() => {
    setLocalConsent(currentConsent);
  }, [currentConsent]);

  const handleToggle = (key: keyof CookieConsentState, value: boolean) => {
    setLocalConsent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveClick = () => {
    onSave(localConsent);
  };

  return (
    <Modal
      open={true} // The provider controls 'open' state, so this is just to render
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backdropFilter: 'blur(3px)' },
        },
      }}
      aria-labelledby="cookie-modal-title"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 450,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography id="cookie-modal-title" variant="h6" component="h2">
            {t("modal.title")}
          </Typography>
          <IconButton onClick={onClose} aria-label={t("modal.close")}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t("modal.description")}
            </Typography>

            {/* Categories */}
            <ToggleSwitchRow
              id="necessary"
              title={t("modal.necessary.title")}
              description={t("modal.necessary.description")}
              checked={true}
              onChange={() => {}}
              disabled={true}
            />
            <ToggleSwitchRow
              id="analytics"
              title={t("modal.analytics.title")}
              description={t("modal.analytics.description")}
              checked={localConsent.analytics}
              onChange={(value) => handleToggle("analytics", value)}
            />
            <ToggleSwitchRow
              id="marketing"
              title={t("modal.marketing.title")}
              description={t("modal.marketing.description")}
              checked={localConsent.marketing}
              onChange={(value) => handleToggle("marketing", value)}
            />
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={handleSaveClick}
            variant="contained"
            color="primary"
            fullWidth
          >
            {t("modal.save")}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}