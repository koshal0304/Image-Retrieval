import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Slide,
  useScrollTrigger,
  Fade,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CategoryIcon from '@mui/icons-material/Category';

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');

  // Update active tab based on location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Search', path: '/search', icon: <SearchIcon /> },
    { text: 'Upload', path: '/upload', icon: <FileUploadIcon /> },
    { text: 'Gallery', path: '/gallery', icon: <ImageIcon /> },
    { text: 'Collections', path: '/collections', icon: <CategoryIcon /> },
    { text: 'Favorites', path: '/favorites', icon: <FavoriteIcon /> },
  ];

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: 280,
          borderRadius: '16px 0 0 16px',
          padding: '20px 0',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            mr: 1.5
          }}>
            <PhotoLibraryIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Image Retrieval
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} aria-label="close menu">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={toggleDrawer(false)}
            sx={{
              my: 0.5,
              mx: 1,
              borderRadius: 2,
              backgroundColor: activeTab === item.path ? 'rgba(58, 54, 224, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(58, 54, 224, 0.12)',
              },
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{
              color: activeTab === item.path ? 'primary.main' : 'text.secondary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: activeTab === item.path ? 600 : 400,
                color: activeTab === item.path ? 'primary.main' : 'text.primary'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            <Fade in={true} timeout={1000}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Avatar sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  mr: 1.5,
                  boxShadow: '0 4px 8px rgba(58, 54, 224, 0.2)',
                  animation: 'pulse 2s infinite ease-in-out'
                }}>
                  <PhotoLibraryIcon fontSize="small" />
                </Avatar>
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #3a36e0, #6e6ae8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  Image Retrieval
                </Typography>
              </Box>
            </Fade>

            {isMobile ? (
              <IconButton
                edge="end"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  ml: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'rotate(90deg)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Fade in={true} timeout={1500}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {navItems.map((item, index) => (
                    <Button
                      key={item.text}
                      component={RouterLink}
                      to={item.path}
                      color={activeTab === item.path ? 'primary' : 'inherit'}
                      startIcon={item.icon}
                      sx={{
                        position: 'relative',
                        fontWeight: activeTab === item.path ? 600 : 400,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: activeTab === item.path ? '80%' : '0%',
                          height: '3px',
                          backgroundColor: 'primary.main',
                          transition: 'all 0.3s ease-in-out',
                          transform: 'translateX(-50%)',
                          borderRadius: '3px 3px 0 0',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(58, 54, 224, 0.04)',
                          '&::after': {
                            width: '50%',
                          }
                        },
                        animation: `slideInRight 0.5s ease-out forwards ${0.2 + index * 0.1}s`
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              </Fade>
            )}
          </Toolbar>
        </Container>
        {renderMobileDrawer()}
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;