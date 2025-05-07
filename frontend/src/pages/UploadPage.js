import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import ImageCard from '../components/ImageCard';

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const onDrop = useCallback(acceptedFiles => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10485760 // 10MB
  });
  
  const handleRemoveFile = (fileToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prevTags => [...prevTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    const successfulUploads = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata
      if (description) {
        formData.append('description', description);
      }
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }
      
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        successfulUploads.push(response.data.image);
      } catch (err) {
        console.error('Upload error:', err);
        setError(`Failed to upload ${file.name}. ${err.response?.data?.error || ''}`);
      }
    }
    
    setUploading(false);
    
    if (successfulUploads.length > 0) {
      setSuccess(`Successfully uploaded ${successfulUploads.length} images.`);
      setFiles([]);
      setDescription('');
      setUploadedImages(prev => [...successfulUploads, ...prev]);
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
        Upload Images
      </Typography>
      
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Add Images to Database
        </Typography>
        
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.400',
            borderRadius: 2,
            p: 3,
            mb: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'rgba(33, 150, 243, 0.04)' : 'inherit',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(33, 150, 243, 0.04)'
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
          {isDragActive ? (
            <Typography>Drop the images here...</Typography>
          ) : (
            <Typography>
              Drag & drop images here, or click to select files
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Supports JPEG, PNG, and GIF formats (max 10MB)
          </Typography>
        </Box>
        
        {files.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Files ({files.length})
            </Typography>
            <Grid container spacing={2}>
              {files.map((file, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center' 
                    }}
                  >
                    <Box 
                      component="img" 
                      src={file.preview} 
                      alt={file.name}
                      sx={{ 
                        width: '100%', 
                        height: 150, 
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%',
                        mt: 1
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                        {file.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveFile(file)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Image Metadata
          </Typography>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Add Tags"
              variant="outlined"
              size="small"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTag}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
          
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
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
      
      {uploadedImages.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Recently Uploaded
          </Typography>
          <Grid container spacing={3}>
            {uploadedImages.slice(0, 8).map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ImageCard image={image} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default UploadPage; 