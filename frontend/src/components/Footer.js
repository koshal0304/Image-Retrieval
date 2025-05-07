import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton, Fade } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link as RouterLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

function Footer() {
  return (
    <Fade in={true} timeout={1000}>
      <Box
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(248, 249, 250, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} sm={4} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhotoLibraryIcon
                  sx={{
                    color: 'primary.main',
                    mr: 1,
                    fontSize: 28
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #3a36e0, #6e6ae8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Image Retrieval
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                A powerful image retrieval system using advanced AI to search images with natural language descriptions.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <IconButton
                  color="primary"
                  aria-label="github"
                  sx={{
                    mr: 1,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-3px)' }
                  }}
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="linkedin"
                  sx={{
                    mr: 1,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-3px)' }
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="twitter"
                  sx={{
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-3px)' }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                Navigation
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  component={RouterLink}
                  to="/"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Home
                </Link>
                <Link
                  component={RouterLink}
                  to="/search"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Search
                </Link>
                <Link
                  component={RouterLink}
                  to="/gallery"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Gallery
                </Link>
                <Link
                  component={RouterLink}
                  to="/favorites"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Favorites
                </Link>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                Resources
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  API Reference
                </Link>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    mb: 1.5,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Support
                </Link>
                <Link
                  href="#"
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Privacy Policy
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Image Retrieval System. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ by <Link href="#" color="primary" underline="hover">Your Team</Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
}

export default Footer;