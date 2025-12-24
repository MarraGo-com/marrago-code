'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SendIcon from '@mui/icons-material/Send';

export default function NewsletterSection() {
  const t = useTranslations('Newsletter');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setStatus({ type: 'success', message: t('successMessage') });
      setEmail('');

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An error occurred";
        setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        py: { xs: 10, md: 14 }, 
        backgroundImage: 'url(/images/taghazout-sunset2.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white', // Global text color is white
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        
        <Paper 
            elevation={24}
            sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.1)', // Glassmorphism container
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
        >
            <Box sx={{ display: 'inline-flex', p: 2, bgcolor: 'primary.main', borderRadius: '50%', mb: 3, boxShadow: '0 0 20px rgba(230, 81, 0, 0.5)' }}>
                <MenuBookIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>

            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>
                {t('title')}
            </Typography>
            
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 5, maxWidth: '600px', mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                {t('subtitle')}
            </Typography>

            {/* --- FORM CONTAINER --- */}
            <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center', // Fix alignment
                    maxWidth: '600px',
                    mx: 'auto'
                }}
            >
                {/* --- THEME AWARE INPUT --- */}
                <TextField
                    required
                    fullWidth
                    placeholder={t('emailLabel')} 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                        flex: 1, // Take available space
                        // 1. Force Background to be Theme Paper (White in light mode)
                        bgcolor: 'background.paper', 
                        borderRadius: 50,
                        
                        // 2. CSS Overrides for Input Text Color
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 50,
                            height: '56px',
                            '& fieldset': { border: 'none' }, // Remove default border
                        },
                        '& input': {
                            // 3. CRITICAL FIX: Force text to be dark (Theme Primary)
                            // This overrides the global 'color: white' from the parent Box
                            color: 'text.primary', 
                            pl: 3,
                            fontSize: '1rem',
                            '&::placeholder': {
                                color: 'text.secondary',
                                opacity: 0.7,
                            }
                        }
                    }}
                />
                
                {/* --- BUTTON ENHANCEMENT --- */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={!loading && <SendIcon />}
                    sx={{ 
                        borderRadius: 50,
                        px: 4,
                        whiteSpace: 'nowrap',
                        height: '56px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        flexShrink: 0, // Prevent button from squishing
                        boxShadow: '0 4px 15px rgba(230, 81, 0, 0.4)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(230, 81, 0, 0.6)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t('submitButton')}
                </Button>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.6 }}>
                {t('privacy')}
            </Typography>

            {status && (
                <Alert 
                    severity={status.type} 
                    sx={{ 
                        mt: 3, 
                        maxWidth: '500px', 
                        mx: 'auto',
                        borderRadius: 2
                    }}
                >
                    {status.message}
                </Alert>
            )}

        </Paper>
      </Container>
    </Box>
  );
}