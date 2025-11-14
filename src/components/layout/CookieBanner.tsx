"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // Using the i18n Link from your marrago project
import { Paper, Container, Typography, Button, Box, Stack } from "@mui/material";

type Props = {
  onAcceptAll: () => void;
  onDeclineAll: () => void;
  onCustomize: () => void;
};

export default function CookieBanner({
  onAcceptAll,
  onDeclineAll,
  onCustomize,
}: Props) {
  const t = useTranslations("CookieConsent");

  return (
    <Paper
      component="section"
      square
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.modal + 1, // Ensure it's on top
        bgcolor: 'background.paper', // Uses MUI theme's paper color (handles dark/light mode)
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t("message")}{" "}
            <Link
              href="/privacy-policy" // Correct link for marrago
              style={{ textDecoration: 'none' }}
            >
              <Typography
                component="span" // Render as a span inside the <p>
                variant="body2"
                sx={{
                  fontWeight: 'medium',
                  color: 'primary.main', // Use theme's primary color
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t("privacyLinkText")}
              </Typography>
            </Link>
            .
          </Typography>
        </Box>

        {/* Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Button
            onClick={onAcceptAll}
            variant="contained"
            color="primary"
            sx={{ flexGrow: 1 }}
          >
            {t("acceptAll")}
          </Button>
          <Button
            onClick={onDeclineAll}
            variant="outlined" // A good contrast for "decline"
            color="inherit"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            {t("declineAll")}
          </Button>
          <Button
            onClick={onCustomize}
            variant="text" // "text" is the MUI equivalent of transparent
            color="inherit"
            sx={{ flexGrow: 1, color: 'text.primary' }}
          >
            {t("customize")}
          </Button>
        </Stack>
      </Container>
    </Paper>
  );
}