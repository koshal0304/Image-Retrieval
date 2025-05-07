import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageCard from '../components/ImageCard';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchFavorites();
  }, []);
  
  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data.images);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorite images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleFavorite = async (imageId) => {
    try {
      await axios.post(`/api/images/${imageId}/favorite`);
      // Remove the image from favorites
      setFavorites(prevFavorites => prevFavorites.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorite status. Please try again.');
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Typography
        component="h1"
        variant="h4"
        color="primary"
        gutterBottom
        sx={{ fontWeight: 500, mt: 2 }}
      >
        Favorite Images
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Favorites
            {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Typography>
          <IconButton color="error" disabled>
            <FavoriteIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Images you've marked as favorites for quick access. Click the heart icon to remove an image from favorites.
        </Typography>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!loading && favorites.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          You haven't favorited any images yet. Browse the gallery and click the heart icon to add images to your favorites.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <ImageCard 
                image={image} 
                onToggleFavorite={handleToggleFavorite} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FavoritesPage;