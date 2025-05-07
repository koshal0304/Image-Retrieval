import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageCard from '../components/ImageCard';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState('score');
  const [referenceImage, setReferenceImage] = useState(null);
  const [weightText, setWeightText] = useState(0.7);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  
  // Fetch all images for reference selection
  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      try {
        const response = await axios.get('/api/images');
        setAllImages(response.data.images || []);
      } catch (err) {
        console.error('Error fetching images:', err);
      } finally {
        setLoadingImages(false);
      }
    };
    
    fetchImages();
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim() && referenceImage === null) {
      setError('Please enter a search query or select a reference image');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const searchParams = {
        limit
      };
      
      // Add query if provided
      if (query.trim()) {
        searchParams.query = query.trim();
      }
      
      // Add image reference if selected
      if (referenceImage !== null) {
        searchParams.imageId = referenceImage;
        searchParams.weightText = weightText;
      }
      
      const response = await axios.post('/api/search', searchParams);
      
      if (response.data.results.length === 0) {
        setSuccess('No images found matching your query. Try a different description or upload some images.');
      } else {
        setSuccess(`Found ${response.data.results.length} images matching your query.`);
      }
      
      // Sort results
      let sortedResults = [...response.data.results];
      if (sortBy === 'score') {
        sortedResults.sort((a, b) => b.score - a.score);
      }
      
      setResults(sortedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for images. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleFavorite = async (imageId) => {
    try {
      await axios.post(`/api/images/${imageId}/favorite`);
      setResults(prevResults => prevResults.map(img => 
        img.id === imageId 
          ? { ...img, favorites: !img.favorites }
          : img
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const handleSelectReferenceImage = (imageId) => {
    setReferenceImage(imageId === referenceImage ? null : imageId);
  };
  
  const clearReferenceImage = () => {
    setReferenceImage(null);
  };
  
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };
  
  const getSelectedImageDetails = () => {
    if (referenceImage === null) return null;
    return allImages.find(img => img.id === referenceImage);
  };
  
  const selectedImage = getSelectedImageDetails();
  
  return (
    <Container maxWidth="lg">
      <Typography
        component="h1"
        variant="h4"
        color="primary"
        gutterBottom
        sx={{ fontWeight: 500, mt: 2 }}
      >
        Image Search
      </Typography>
      
      <Paper
        component="form"
        onSubmit={handleSearch}
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Search for Images
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<TuneIcon />}
            onClick={toggleAdvancedMode}
            size="small"
          >
            {advancedMode ? 'Simple Search' : 'Advanced Search'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {advancedMode 
            ? 'Combine text search with a reference image for more precise results'
            : 'Enter a descriptive prompt like "sunset over mountains" or "a cat playing with a ball"'}
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          label="Search Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {advancedMode && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Reference Image {selectedImage && <Chip 
                  size="small" 
                  label="Selected" 
                  color="primary" 
                  onDelete={clearReferenceImage}
                />}
              </Typography>
              
              {selectedImage && (
                <Card sx={{ mb: 2, maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`/static/uploads/${selectedImage.filename}`}
                    alt={selectedImage.filename}
                  />
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="caption" noWrap>
                      {selectedImage.filename}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Select a reference image to find visually similar images
              </Typography>
              
              <Box sx={{ 
                maxHeight: 150, 
                overflowY: 'auto', 
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 1,
                pb: 1,
                mb: 2,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: 3,
                }
              }}>
                {loadingImages ? (
                  <CircularProgress size={24} />
                ) : (
                  allImages.map((image) => (
                    <Card 
                      key={image.id} 
                      sx={{ 
                        minWidth: 100, 
                        width: 100,
                        border: referenceImage === image.id ? '2px solid #1976d2' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectReferenceImage(image.id)}
                    >
                      <CardMedia
                        component="img"
                        height="75"
                        image={`/static/uploads/${image.filename}`}
                        alt={image.filename}
                      />
                    </Card>
                  ))
                )}
              </Box>
            </Box>
            
            {referenceImage !== null && (
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Text vs. Image Weight: {Math.round(weightText * 100)}% Text / {Math.round((1-weightText) * 100)}% Image
                </Typography>
                <Slider
                  value={weightText}
                  onChange={(_, newValue) => setWeightText(newValue)}
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  aria-labelledby="weight-slider"
                />
              </Box>
            )}
          </>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Results Limit: {limit}</Typography>
          <Slider
            value={limit}
            onChange={(_, newValue) => setLimit(newValue)}
            min={5}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            aria-labelledby="results-limit-slider"
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="score">Relevance</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {results.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {results.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <ImageCard 
                  image={image} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default SearchPage; 