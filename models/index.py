import numpy as np
import os
import json
from pathlib import Path
from models.image_embedder import embedder

# Import FAISS directly with proper error handling
try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    print("ERROR: FAISS is not available. Vector search functionality will not work.")
    print("Please install FAISS with: conda install -c conda-forge faiss-cpu")
    FAISS_AVAILABLE = False

class ImageIndex:
    def __init__(self, dimension=512, index_dir="index"):
        """Initialize FAISS index for image search"""
        self.dimension = dimension
        self.index_dir = index_dir
        self.index_path = os.path.join(index_dir, "image_index.faiss")
        self.metadata_path = os.path.join(index_dir, "image_metadata.json")
        self.embeddings_path = os.path.join(index_dir, "image_embeddings.npy")
        
        # Create index directory if it doesn't exist
        Path(index_dir).mkdir(parents=True, exist_ok=True)
        
        # Initialize image metadata
        self.image_metadata = []
        
        # Cache of image embeddings
        self.image_embeddings = None
        
        # Initialize index
        self.index = None
        
        # Load existing index or create a new one
        self.load_or_create_index()
        
    def load_or_create_index(self):
        """Load existing index or create a new one"""
        if not FAISS_AVAILABLE:
            print("ERROR: FAISS is not available, index features will not work")
            return
            
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            try:
                # Load existing index
                self.index = faiss.read_index(self.index_path)
                with open(self.metadata_path, 'r') as f:
                    self.image_metadata = json.load(f)
                    
                # Load embeddings if available
                if os.path.exists(self.embeddings_path):
                    self.image_embeddings = np.load(self.embeddings_path)
                else:
                    # Create embeddings array for existing images
                    self.image_embeddings = np.zeros((len(self.image_metadata), self.dimension), dtype=np.float32)
                
                print(f"Loaded index with {len(self.image_metadata)} images")
            except Exception as e:
                print(f"Error loading index: {e}")
                # Create new index
                self.index = faiss.IndexFlatIP(self.dimension)
                self.image_metadata = []
                self.image_embeddings = np.zeros((0, self.dimension), dtype=np.float32)
                print("Created new index after failed load")
        else:
            # Create new index
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine similarity
            self.image_metadata = []
            self.image_embeddings = np.zeros((0, self.dimension), dtype=np.float32)
            print("Created new index")
            
    def save_index(self):
        """Save index and metadata to disk"""
        if not FAISS_AVAILABLE or self.index is None:
            print("ERROR: Cannot save index - FAISS not available or index not initialized")
            return
            
        if len(self.image_metadata) > 0:
            try:
                faiss.write_index(self.index, self.index_path)
                with open(self.metadata_path, 'w') as f:
                    json.dump(self.image_metadata, f, indent=2)
                    
                # Save embeddings
                if self.image_embeddings is not None and len(self.image_embeddings) > 0:
                    np.save(self.embeddings_path, self.image_embeddings)
                    
                print(f"Saved index with {len(self.image_metadata)} images")
            except Exception as e:
                print(f"Error saving index: {e}")
            
    def add_image(self, image_path, embedding=None):
        """Add image to the index"""
        if not FAISS_AVAILABLE or self.index is None:
            print("ERROR: Cannot add to index - FAISS not available or index not initialized")
            return False
            
        if embedding is None:
            # Generate embedding if not provided
            embedding = embedder.embed_image(image_path)
            
        if embedding is not None:
            try:
                # Add to index
                self.index.add(embedding)
                self.image_metadata.append({
                    'path': image_path,
                    'id': len(self.image_metadata)
                })
                
                # Add to embeddings cache
                if self.image_embeddings is not None:
                    self.image_embeddings = np.vstack([self.image_embeddings, embedding])
                else:
                    self.image_embeddings = np.array([embedding])
                
                self.save_index()
                return True
            except Exception as e:
                print(f"Error adding image to index: {e}")
        
        return False
        
    def search(self, query, k=20, image_id=None, weight_text=0.7):
        """Search for images similar to query text, optionally combine with an image"""
        if not FAISS_AVAILABLE or self.index is None:
            print("ERROR: Cannot search - FAISS not available or index not initialized")
            return []
            
        if self.index.ntotal == 0:
            return []
        
        # Case 1: Only text search
        if image_id is None or image_id < 0 or image_id >= len(self.image_metadata):
            text_embedding = embedder.embed_text(query)
            if text_embedding is None:
                return []
                
            search_vector = text_embedding
        
        # Case 2: Combined text and image search
        elif query:
            # Get text embedding
            text_embedding = embedder.embed_text(query)
            if text_embedding is None:
                return []
                
            # Get image embedding
            image_embedding = self.get_embedding_by_id(image_id)
            if image_embedding is None:
                return []
                
            # Combine embeddings (weighted average)
            search_vector = weight_text * text_embedding + (1 - weight_text) * image_embedding
            
            # Normalize
            search_vector = search_vector / np.linalg.norm(search_vector)
            
        # Case 3: Only image search (similar to)
        else:
            image_embedding = self.get_embedding_by_id(image_id)
            if image_embedding is None:
                return []
                
            search_vector = image_embedding
            
        try:
            # Search the index
            scores, indices = self.index.search(search_vector, min(k, self.index.ntotal))
            
            # Format results
            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.image_metadata):
                    results.append({
                        'path': self.image_metadata[idx]['path'],
                        'id': self.image_metadata[idx]['id'],
                        'score': float(scores[0][i])
                    })
            
            return results
        except Exception as e:
            print(f"Error searching index: {e}")
            return []
    
    def get_embedding_by_id(self, image_id):
        """Get the embedding for an image by ID"""
        if image_id < 0 or image_id >= len(self.image_metadata):
            return None
            
        # If we have cached embeddings, use them
        if self.image_embeddings is not None and image_id < len(self.image_embeddings):
            return self.image_embeddings[image_id].reshape(1, -1)
            
        # Otherwise, get the image path and embed it
        image_path = self.image_metadata[image_id]['path']
        full_path = os.path.join('static', 'uploads', image_path)
        
        if os.path.exists(full_path):
            return embedder.embed_image(full_path)
        
        return None
        
    def rebuild_index(self, image_dir):
        """Rebuild the entire index from images in the specified directory"""
        if not FAISS_AVAILABLE:
            print("ERROR: Cannot rebuild index - FAISS not available")
            return 0
            
        try:
            # Reset index
            self.index = faiss.IndexFlatIP(self.dimension)
            self.image_metadata = []
            self.image_embeddings = np.zeros((0, self.dimension), dtype=np.float32)
            
            # Get list of images
            count = 0
            for root, _, files in os.walk(image_dir):
                for file in files:
                    if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                        image_path = os.path.join(root, file)
                        rel_path = os.path.relpath(image_path, start=os.path.dirname(image_dir))
                        
                        # Embed and add to index
                        embedding = embedder.embed_image(image_path)
                        if embedding is not None:
                            self.add_image(rel_path, embedding)
                            count += 1
            
            self.save_index()
            return count
        except Exception as e:
            print(f"Error rebuilding index: {e}")
            return 0

    def get_semantic_clusters(self, num_clusters=5):
        """Cluster the images into semantic groups using K-means"""
        if not FAISS_AVAILABLE or self.index is None or self.index.ntotal == 0:
            print("ERROR: Cannot create clusters - FAISS not available or no images indexed")
            return []
            
        try:
            # Need at least 2 images
            if self.index.ntotal < 2:
                return [{
                    'name': 'All Images',
                    'images': [{'id': img['id'], 'path': img['path']} for img in self.image_metadata]
                }]
            
            # Use fewer clusters if we have few images
            actual_clusters = min(num_clusters, self.index.ntotal // 2)
            
            # Load necessary packages for clustering
            from sklearn.cluster import KMeans
            
            # Get embeddings
            if self.image_embeddings is None or len(self.image_embeddings) != self.index.ntotal:
                print("WARNING: Embedding cache not available, using index vectors")
                # Since we can't directly extract vectors from FAISS index,
                # we'll need to get them from the image files again
                embeddings = []
                for img in self.image_metadata:
                    image_path = os.path.join('static', 'uploads', img['path'])
                    if os.path.exists(image_path):
                        emb = embedder.embed_image(image_path)
                        if emb is not None:
                            embeddings.append(emb.reshape(-1))
                        else:
                            embeddings.append(np.zeros(self.dimension))
                    else:
                        embeddings.append(np.zeros(self.dimension))
                embeddings = np.array(embeddings)
            else:
                embeddings = self.image_embeddings
            
            # Run K-means clustering
            kmeans = KMeans(n_clusters=actual_clusters, random_state=42)
            clusters = kmeans.fit_predict(embeddings)
            
            # Determine cluster labels by finding the most representative images
            # and using CLIP to generate descriptions
            cluster_centers = kmeans.cluster_centers_
            cluster_labels = []
            
            # For each cluster, find the common themes using CLIP text encoder in reverse
            for i in range(actual_clusters):
                # Get the embedding center
                center = cluster_centers[i].reshape(1, -1)
                
                # Use a list of common categories to find the closest match
                common_categories = [
                    "landscape", "portrait", "animals", "food", "architecture",
                    "nature", "urban", "abstract", "people", "objects",
                    "technology", "art", "black and white", "colorful", "vintage"
                ]
                
                category_embeddings = np.array([
                    embedder.embed_text(f"a photo of {category}").reshape(-1)
                    for category in common_categories
                ])
                
                # Calculate similarities
                similarities = np.dot(center, category_embeddings.T).reshape(-1)
                best_match_idx = similarities.argmax()
                
                # Get the best matching category
                best_category = common_categories[best_match_idx]
                cluster_labels.append(f"{best_category.title()} Images")
            
            # Organize images by cluster
            result = []
            for i in range(actual_clusters):
                cluster_images = []
                for j, cluster_idx in enumerate(clusters):
                    if cluster_idx == i and j < len(self.image_metadata):
                        cluster_images.append({
                            'id': self.image_metadata[j]['id'],
                            'path': self.image_metadata[j]['path']
                        })
                
                result.append({
                    'id': i,
                    'name': cluster_labels[i],
                    'images': cluster_images
                })
            
            return result
        except Exception as e:
            print(f"Error creating semantic clusters: {e}")
            return []

# Create singleton instance
image_index = ImageIndex() 