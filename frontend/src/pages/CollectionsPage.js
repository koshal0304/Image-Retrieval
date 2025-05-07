import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  Slider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageCard from '../components/ImageCard';

function CollectionsPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [numClusters, setNumClusters] = useState(5);
  const [selectedCluster, setSelectedCluster] = useState(null);
  
  // Fetch semantic clusters
  const fetchClusters = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/clusters?num_clusters=${numClusters}`);
      setClusters(response.data.clusters || []);
      setSelectedCluster(null);
    } catch (err) {
      console.error('Error fetching clusters:', err);
      setError('Failed to load semantic collections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load clusters on initial render
  useEffect(() => {
    fetchClusters();
  }, []);
  
  const handleToggleFavorite = async (imageId) => {
    try {
      await axios.post(`/api/images/${imageId}/favorite`);
      
      // Update the image in all clusters
      setClusters(prevClusters => 
        prevClusters.map(cluster => ({
          ...cluster,
          images: cluster.images.map(img => 
            img.id === imageId 
              ? { ...img, favorites: !img.favorites }
              : img
          )
        }))
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`/api/images/${imageId}`);
      
      // Remove the image from all clusters
      setClusters(prevClusters => 
        prevClusters.map(cluster => ({
          ...cluster,
          images: cluster.images.filter(img => img.id !== imageId)
        }))
      );
      
      setSuccessMessage('Image deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image. Please try again later.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const handleClusterClick = (clusterId) => {
    setSelectedCluster(selectedCluster === clusterId ? null : clusterId);
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
        Smart Collections
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Auto-Organized Image Collections
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Our AI automatically organizes your images into semantic collections based on visual similarity.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Number of Collections: {numClusters}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Slider
              value={numClusters}
              onChange={(_, newValue) => setNumClusters(newValue)}
              min={2}
              max={10}
              step={1}
              valueLabelDisplay="auto"
              sx={{ flex: 1, mr: 2 }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={fetchClusters}
              startIcon={<RefreshIcon />}
              disabled={loading}
            >
              Regenerate
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : clusters.length === 0 ? (
          <Alert severity="info">
            No collections found. Upload some images first to see auto-organized collections.
          </Alert>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Your Collections
            </Typography>
            
            {clusters.map((cluster) => (
              <Accordion 
                key={cluster.id}
                expanded={selectedCluster === cluster.id}
                onChange={() => handleClusterClick(cluster.id)}
                TransitionProps={{ unmountOnExit: true }}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {cluster.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      {cluster.images.length} images
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {cluster.images.map((image) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                        <ImageCard 
                          image={{
                            ...image,
                            path: `uploads/${image.path}`
                          }}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDeleteImage}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default CollectionsPage; 