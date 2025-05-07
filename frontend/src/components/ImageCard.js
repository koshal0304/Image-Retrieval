import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Collapse,
  Box,
  Chip,
  Tooltip,
  Fade,
  Zoom,
  Badge,
  Divider,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';

// Styled components
const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
    '& .image-overlay': {
      opacity: 0.3,
    }
  }
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 200,
  background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.8)}, transparent)`,
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 1,
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  height: 200,
  transition: 'transform 0.6s ease-in-out',
  transformOrigin: 'center',
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.standard,
  }),
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2],
  }
}));

function ImageCard({ image, onToggleFavorite, onDelete, delay = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay * 100);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavoriteClick = async () => {
    if (onToggleFavorite) {
      onToggleFavorite(image.id);
    } else {
      try {
        await axios.post(`/api/images/${image.id}/favorite`);
        // If no callback provided, just toggle the UI state
        image.favorites = !image.favorites;
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      onDelete(image.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };

  const imageUrl = image.path.startsWith('http')
    ? image.path
    : `/static/${image.path}`;

  return (
    <Fade in={visible} timeout={500}>
      <StyledCard>
        <ImageOverlay className="image-overlay" />

        {!loaded && (
          <Skeleton
            variant="rectangular"
            height={200}
            animation="wave"
            sx={{
              bgcolor: 'rgba(0,0,0,0.05)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 0
            }}
          />
        )}

        <StyledCardMedia
          component="img"
          image={imageUrl}
          alt={image.description || 'Image'}
          sx={{
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={handleImageLoad}
        />

        <Box sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2
        }}>
          <Zoom in={loaded} timeout={300}>
            <Badge
              badgeContent={image.score !== undefined ? `${(image.score * 100).toFixed(0)}%` : null}
              color={image.score > 0.7 ? 'success' : image.score > 0.5 ? 'primary' : 'default'}
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  borderRadius: '8px',
                  padding: '0 6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Chip
                label={image.favorites ? 'Favorite' : ''}
                size="small"
                icon={image.favorites ? <FavoriteIcon fontSize="small" /> : null}
                color={image.favorites ? 'secondary' : 'default'}
                variant={image.favorites ? 'filled' : 'outlined'}
                sx={{
                  bgcolor: image.favorites ? alpha('#e91e63', 0.9) : alpha('#fff', 0.8),
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Badge>
          </Zoom>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3
            }}
          >
            {image.description || 'No description'}
          </Typography>

          {image.tags && image.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
              {image.tags.slice(0, 3).map((tag, i) => (
                <AnimatedChip
                  key={i}
                  label={tag}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    animation: `fadeIn 0.5s ease-out forwards ${0.3 + i * 0.1}s`
                  }}
                />
              ))}
              {image.tags.length > 3 && (
                <Tooltip title={image.tags.slice(3).join(', ')}>
                  <AnimatedChip
                    label={`+${image.tags.length - 3}`}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 22,
                      animation: `fadeIn 0.5s ease-out forwards 0.6s`
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          )}
        </CardContent>

        <Divider sx={{ mx: 2, opacity: 0.6 }} />

        <CardActions disableSpacing sx={{ px: 2, py: 1, bgcolor: 'background.default' }}>
          <IconButton 
            onClick={handleFavoriteClick} 
            aria-label={image.favorites ? "Remove from favorites" : "Add to favorites"}
            color={image.favorites ? "secondary" : "default"}
            size="small"
          >
            {image.favorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          
          <IconButton aria-label="View full size" size="small">
            <VisibilityIcon />
          </IconButton>
          
          <IconButton aria-label="Share image" size="small">
            <ShareIcon />
          </IconButton>

          <IconButton 
            aria-label="Delete image" 
            size="small"
            onClick={handleDeleteClick}
            color="error"
            sx={{ marginLeft: 'auto' }}
          >
            <DeleteIcon />
          </IconButton>
          
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more details"
            size="small"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Image Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">ID:</Typography>
                <Typography variant="body2">{image.id}</Typography>
              </Box>

              {image.uploaded_at && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Uploaded:</Typography>
                  <Typography variant="body2">
                    {new Date(image.uploaded_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {image.score !== undefined && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Match Score:</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: image.score > 0.7 ? 'success.main' : image.score > 0.5 ? 'primary.main' : 'text.primary',
                      fontWeight: 600
                    }}
                  >
                    {(image.score * 100).toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </Box>

            {image.tags && image.tags.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {image.tags.map((tag, i) => (
                    <AnimatedChip
                      key={i}
                      label={tag}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        animation: `fadeIn 0.3s ease-out forwards ${0.1 + i * 0.05}s`
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Collapse>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
        >
          <DialogTitle>Delete Image</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </StyledCard>
    </Fade>
  );
}

export default ImageCard;