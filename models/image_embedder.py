import torch
import numpy as np
import os
from pathlib import Path

# Handle potential CLIP import errors more gracefully
try:
    import clip
    CLIP_AVAILABLE = True
except ImportError:
    print("WARNING: CLIP model not available. Please install it with: pip install git+https://github.com/openai/CLIP.git")
    CLIP_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    print("WARNING: PIL not available. Please install it with: pip install pillow")
    PIL_AVAILABLE = False

class ImageEmbedder:
    def __init__(self, model_name="ViT-B/32"):
        """Initialize the CLIP model for image embedding"""
        self.model = None
        self.preprocess = None
        self.device = "cpu"
        
        if not CLIP_AVAILABLE or not PIL_AVAILABLE:
            print("WARNING: Required dependencies not available. Image embedding will not work.")
            return
            
        try:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"Using device: {self.device}")
            self.model, self.preprocess = clip.load(model_name, device=self.device)
            print(f"CLIP model '{model_name}' loaded successfully.")
        except Exception as e:
            print(f"Error loading CLIP model: {e}")
            print("Image embedding will not be available.")
        
    def embed_image(self, image_path):
        """Generate embedding for an image file"""
        if self.model is None or self.preprocess is None:
            print(f"Cannot embed image: CLIP model not loaded")
            return None
            
        try:
            # Ensure image path exists
            if not os.path.exists(image_path):
                print(f"Image not found: {image_path}")
                return None
                
            # Load and preprocess image
            image = Image.open(image_path).convert("RGB")
            image_input = self.preprocess(image).unsqueeze(0).to(self.device)
            
            # Generate embedding
            with torch.no_grad():
                image_features = self.model.encode_image(image_input)
                
            # Normalize features
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
            return image_features.cpu().numpy()
            
        except Exception as e:
            print(f"Error embedding image {image_path}: {e}")
            return None
            
    def embed_text(self, text):
        """Generate embedding for text query"""
        if self.model is None:
            print(f"Cannot embed text: CLIP model not loaded")
            return None
            
        try:
            # Tokenize and encode text
            text_input = clip.tokenize([text]).to(self.device)
            with torch.no_grad():
                text_features = self.model.encode_text(text_input)
                
            # Normalize features
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
            return text_features.cpu().numpy()
            
        except Exception as e:
            print(f"Error embedding text '{text}': {e}")
            return None
            
    def compute_similarity(self, image_embedding, text_embedding):
        """Compute cosine similarity between image and text embeddings"""
        if image_embedding is None or text_embedding is None:
            return 0.0
            
        # Convert to torch tensors if they are numpy arrays
        if isinstance(image_embedding, np.ndarray):
            image_embedding = torch.from_numpy(image_embedding)
        if isinstance(text_embedding, np.ndarray):
            text_embedding = torch.from_numpy(text_embedding)
            
        # Compute cosine similarity
        similarity = (image_embedding @ text_embedding.T).item()
        return similarity

# Create singleton instance
embedder = ImageEmbedder() 