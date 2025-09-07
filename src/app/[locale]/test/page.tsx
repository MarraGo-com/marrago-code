'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Paper,
  Divider,
  AppBar,
  Toolbar,
  Button,
  IconButton
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a simple theme toggle component
function ThemeToggle({ onToggle, mode }: { onToggle: () => void; mode: 'light' | 'dark' }) {
  return (
    <IconButton onClick={onToggle} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

// Main test component
function TestPageContent({ mode, onToggleTheme }: { mode: 'light' | 'dark'; onToggleTheme: () => void }) {
//  const theme = useTheme();

  // Sample background image URL (you can replace with your actual image)
  const backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';

  return (
    <>
      {/* Hero Section with Background Image - FULL VIEWPORT */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          marginLeft: 'calc(-50vw + 50%)',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {/* AppBar positioned absolutely over the hero image */}
        <AppBar 
          position="absolute"
          elevation={0}
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bgcolor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.2)'  // Light theme: very transparent white
              : 'rgba(0, 0, 0, 0.2)',        // Dark theme: very transparent black
            backdropFilter: 'blur(5px)',
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
            zIndex: 1000,
            color: mode === 'light' ? 'text.primary' : 'white',
            // Force override any default AppBar styles
            '&.MuiAppBar-root': {
              bgcolor: mode === 'light' 
                ? 'rgba(255, 255, 255, 0.2) !important'
                : 'rgba(0, 0, 0, 0.2) !important',
            },
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Your Logo
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button color="inherit">Home</Button>
                <Button color="inherit">About</Button>
                <Button color="inherit">Contact</Button>
                <ThemeToggle onToggle={onToggleTheme} mode={mode} />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Content - positioned to account for header height */}
        <Box sx={{ 
          zIndex: 1, 
          mt: 8, // Add top margin to account for header height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Morocco
          </Typography>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Discover the magic of the Atlas Mountains
          </Typography>
          <Button variant="contained" size="large">
            Explore Now
          </Button>
        </Box>
      </Box>

      {/* Rest of the content in container */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Background Image + Text Overlay Test
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Header over Hero Section (Real-World Example) - Current Theme: {mode}
        </Typography>

        <Grid container spacing={4}>
          
          {/* Method 1: Theme-Aware Overlay with CSS Background */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Method 1: Theme-Aware CSS Background
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: mode === 'light' 
                    ? 'rgba(0, 0, 0, 0.4)'  // Dark overlay in light mode
                    : 'rgba(0, 0, 0, 0.6)', // Darker overlay in dark mode
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: 3
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Atlas Mountains
                </Typography>
                <Typography variant="body1">
                  Experience the breathtaking beauty of Morocco&apos;s highest peaks
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Method 2: Material-UI Paper with Background */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Method 2: MUI Paper with Background
            </Typography>
            <Paper
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: mode === 'light' 
                    ? 'rgba(255, 255, 255, 0.1)'  // Light overlay in light mode
                    : 'rgba(0, 0, 0, 0.3)',      // Dark overlay in dark mode
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3,
                  background: mode === 'light'
                    ? 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                    : 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                }}
              >
                <Typography variant="h5" component="h3" sx={{ color: 'white', mb: 1 }}>
                  Desert Sunset
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Golden sands meet endless horizons
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Method 3: Card with Background Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Method 3: Card with Background
            </Typography>
            <Card
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: mode === 'light' 
                      ? 'rgba(255, 255, 255, 0.9)'  // Almost white overlay in light mode
                      : 'rgba(0, 0, 0, 0.8)',       // Dark overlay in dark mode
                    zIndex: -1,
                  }
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Berber Village
                </Typography>
                <Typography variant="body1">
                  Traditional mountain communities with rich culture
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Method 4: Pure CSS with Theme-Aware Colors */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Method 4: Theme-Aware Colors
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {/* Top overlay for title */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: mode === 'light'
                    ? 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              >
                <Typography variant="h4" component="h2" sx={{ color: 'white' }}>
                  Coastal Views
                </Typography>
              </Box>

              {/* Bottom overlay for description */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: mode === 'light'
                    ? 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)'
                    : 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              >
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Where the mountains meet the sea
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Method 5: No Overlay - Pure Text on Image */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Method 5: No Overlay - Pure Text on Image
            </Typography>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 400,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: mode === 'light'
                    ? 'rgba(255, 255, 255, 0.95)'  // Almost white background in light mode
                    : 'rgba(0, 0, 0, 0.9)',        // Almost black background in dark mode
                  color: mode === 'light' ? 'text.primary' : 'white',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                }}
              >
                <Typography variant="h3" component="h2" gutterBottom>
                  Pure Text Box
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: 400 }}>
                  This approach uses a semi-transparent box with backdrop blur for a modern glass effect.
                  The text is clearly readable while the background image remains visible.
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" gutterBottom>
          Key Benefits of These Approaches:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li">
            <strong>Theme-Aware:</strong> Automatically adapts to light/dark mode
          </Typography>
          <Typography component="li">
            <strong>No Transparency Issues:</strong> Uses proper overlays instead of transparent backgrounds
          </Typography>
          <Typography component="li">
            <strong>Accessible:</strong> Text remains readable in all theme modes
          </Typography>
          <Typography component="li">
            <strong>Flexible:</strong> Easy to customize colors and effects
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" gutterBottom>
          Header over Hero Section - The Solution:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li">
            <strong>Use backdrop-filter with blur:</strong> Creates a modern glass effect
          </Typography>
          <Typography component="li">
            <strong>Theme-aware backgrounds:</strong> Light theme gets semi-transparent white, dark theme gets semi-transparent black
          </Typography>
          <Typography component="li">
            <strong>Proper z-index:</strong> Ensures header stays above hero content
          </Typography>
          <Typography component="li">
            <strong>Subtle borders:</strong> Adds definition without being too prominent
          </Typography>
        </Box>
      </Container>
    </>
  );
}

// Wrapper component with theme provider
export default function TestPage() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TestPageContent mode={mode} onToggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}
