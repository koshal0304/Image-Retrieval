import React, { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import CollectionsIcon from '@mui/icons-material/Collections';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import MemoryIcon from '@mui/icons-material/Memory';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { alpha, styled } from '@mui/material/styles';

// Styled components
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  display: 'inline-block',
}));

const FeatureCard = styled(Card)(() => ({
  height: '100%',
  borderRadius: 16,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
    '& .card-icon': {
      transform: 'scale(1.2) rotate(5deg)',
    }
  }
}));

const AnimatedIcon = styled(Box)(() => ({
  transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const GlassCard = styled(Paper)(() => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const HeroButton = styled(Button)(() => ({
  padding: '12px 28px',
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  }
}));

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef(null);

  // Simulate scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    setTimeout(handleScroll, 500);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Search',
      description: 'Find images using natural language descriptions like "sunset over mountains" or "cat playing with a ball"',
      icon: <SearchIcon sx={{ fontSize: 60 }} />,
      path: '/search',
      color: 'primary.main',
      gradient: 'linear-gradient(135deg, #3a36e0 0%, #6e6ae8 100%)'
    },
    {
      title: 'Upload',
      description: 'Add your own images to the database through our simple upload interface',
      icon: <UploadIcon sx={{ fontSize: 60 }} />,
      path: '/upload',
      color: 'secondary.main',
      gradient: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)'
    },
    {
      title: 'Gallery',
      description: 'Browse all images in the database with filtering options',
      icon: <CollectionsIcon sx={{ fontSize: 60 }} />,
      path: '/gallery',
      color: '#00bcd4',
      gradient: 'linear-gradient(135deg, #00bcd4 0%, #80deea 100%)'
    },
    {
      title: 'Favorites',
      description: 'Save and organize your favorite images for quick access',
      icon: <FavoriteIcon sx={{ fontSize: 60 }} />,
      path: '/favorites',
      color: '#e91e63',
      gradient: 'linear-gradient(135deg, #e91e63 0%, #f48fb1 100%)'
    }
  ];

  const benefits = [
    {
      title: 'Advanced AI',
      description: 'Powered by state-of-the-art machine learning models for accurate image retrieval',
      icon: <MemoryIcon fontSize="large" />,
      color: theme.palette.primary.main
    },
    {
      title: 'Lightning Fast',
      description: 'Optimized for speed with efficient indexing and search algorithms',
      icon: <SpeedIcon fontSize="large" />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Smart Organization',
      description: 'Automatically categorize and tag your images for better organization',
      icon: <AutoAwesomeIcon fontSize="large" />,
      color: '#00c853'
    }
  ];

  return (
    <Container maxWidth="lg" ref={containerRef}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden',
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0)} 70%)`,
            zIndex: -1,
          }}
        />

        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 60,
                  height: 60,
                  boxShadow: '0 8px 16px rgba(58, 54, 224, 0.2)',
                  animation: 'pulse 2s infinite ease-in-out',
                  mr: 2
                }}
              >
                <PhotoLibraryIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <GradientText
                component="h1"
                variant={isMobile ? "h3" : "h1"}
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                }}
              >
                Image Retrieval
              </GradientText>
            </Box>

            <Typography
              variant={isMobile ? "h6" : "h4"}
              color="text.primary"
              sx={{
                fontWeight: 600,
                mb: 2,
                opacity: 0.9
              }}
            >
              Find the perfect image instantly
            </Typography>
          </Box>
        </Fade>

        <Fade in={true} timeout={1500}>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: 800,
              mb: 5,
              px: 2,
              lineHeight: 1.6
            }}
          >
            Our advanced AI-powered system understands natural language descriptions
            and finds the most relevant images in seconds. Simply describe what you're
            looking for, and let our technology do the rest.
          </Typography>
        </Fade>

        <Fade in={true} timeout={2000}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <HeroButton
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/search"
              startIcon={<SearchIcon />}
              size="large"
            >
              Start Searching
            </HeroButton>
            <HeroButton
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/upload"
              startIcon={<UploadIcon />}
              size="large"
            >
              Upload Images
            </HeroButton>
          </Stack>
        </Fade>

        <Box sx={{ mt: 8, width: '100%', textAlign: 'center' }}>
          <Chip
            label="AI-Powered Technology"
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: 4,
              px: 2,
              py: 2.5,
              fontSize: '0.9rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              animation: 'pulse 2s infinite ease-in-out'
            }}
          />
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          position: 'relative',
        }}
        className="animate-on-scroll"
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6
          }}
        >
          <GradientText>Features</GradientText>
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Zoom in={true} style={{ transitionDelay: `${index * 150}ms` }}>
                <FeatureCard>
                  <CardActionArea component={RouterLink} to={feature.path}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: feature.gradient,
                        color: 'white',
                        transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      }}
                    >
                      <AnimatedIcon className="card-icon">
                        {feature.icon}
                      </AnimatedIcon>
                    </CardMedia>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </FeatureCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <GlassCard
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          my: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
        className="animate-on-scroll"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
            zIndex: 0,
            borderRadius: '50% 0 0 50%',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4
            }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                Our image retrieval system uses advanced AI techniques to understand the semantic meaning of your text prompts and match them with relevant images.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                The system is powered by <strong>CLIP (Contrastive Language-Image Pre-Training)</strong>, a neural network trained on a variety of image-text pairs. This allows it to understand the relationship between visual concepts and natural language.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                When you search, your text is converted into a mathematical representation (embedding) and compared against the embeddings of all images in the database. The most similar matches are returned as results.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  }}
                >
                  <PhotoLibraryIcon sx={{ fontSize: 100, color: alpha('#3a36e0', 0.7) }} />
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                  {['AI-Powered', 'Fast', 'Accurate', 'Semantic Search', 'CLIP Model'].map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 500,
                        animation: `fadeIn 0.5s ease-out forwards ${0.3 + i * 0.1}s`
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>

      {/* Benefits Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          mb: 4
        }}
        className="animate-on-scroll"
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 6
          }}
        >
          Why Choose Us
        </Typography>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={benefit.title}>
              <Fade in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                      borderColor: 'transparent',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(benefit.color, 0.1),
                      color: benefit.color,
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    {benefit.icon}
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {benefit.description}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <GlassCard
        sx={{
          p: { xs: 4, md: 6 },
          my: 6,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
        className="animate-on-scroll"
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to get started?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          Start searching for images or upload your own collection today.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <HeroButton
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/search"
            startIcon={<SearchIcon />}
            size="large"
          >
            Start Searching
          </HeroButton>
          <HeroButton
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/upload"
            startIcon={<UploadIcon />}
            size="large"
          >
            Upload Images
          </HeroButton>
        </Stack>
      </GlassCard>
    </Container>
  );
}

export default HomePage;