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
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ImageCard from '../components/ImageCard';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  
  const imagesPerPage = 12;
  
  useEffect(() => {
    fetchImages();
  }, [page, sortBy, selectedTags]);
  
  const fetchImages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/api/images');
      let filteredImages = response.data.images;
      
      // Extract all unique tags
      const tags = new Set();
      filteredImages.forEach(img => {
        if (img.tags && Array.isArray(img.tags)) {
          img.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
      
      // Filter by search term if provided
      if (searchTerm.trim()) {
        filteredImages = filteredImages.filter(img => 
          img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by selected tags
      if (selectedTags.length > 0) {
        filteredImages = filteredImages.filter(img => 
          selectedTags.every(tag => img.tags?.includes(tag))
        );
      }
      
      // Sort images
      if (sortBy === 'newest') {
        filteredImages.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
      } else if (sortBy === 'oldest') {
        filteredImages.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
      }
      
      // Pagination
      setTotalPages(Math.ceil(filteredImages.length / imagesPerPage));
      const startIndex = (page - 1) * imagesPerPage;
      const paginatedImages = filteredImages.slice(startIndex, startIndex + imagesPerPage);
      
      setImages(paginatedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };
  
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setPage(1);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setPage(1);
    setSortBy('newest');
  };
  
  const handleToggleFavorite = async (imageId) => {
    try {
      const response = await axios.post(`/api/images/${imageId}/favorite`);
      
      // Update the image in the current state
      setImages(prevImages => prevImages.map(img => 
        img.id === imageId ? {...img, favorites: response.data.image.favorites} : img
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
        Image Gallery
      </Typography>
      
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Browse Images
            {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Typography>
          
          <FormControl sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton onClick={handleClearFilters} color="primary" title="Clear all filters">
            <ClearIcon />
          </IconButton>
        </Box>
        
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by description or tags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            size="small"
          />
        </Box>
        
        {allTags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
              Filter by Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {allTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onClick={() => handleTagSelect(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!loading && images.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No images found. Try adjusting your filters or upload some images.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <ImageCard 
                  image={image} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, value) => setPage(value)} 
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default ImageGallery; 