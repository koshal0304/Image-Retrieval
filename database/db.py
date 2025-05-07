import os
import json
from datetime import datetime
from pathlib import Path

class ImageDatabase:
    def __init__(self, db_path="database/images.json"):
        self.db_path = db_path
        Path(os.path.dirname(db_path)).mkdir(parents=True, exist_ok=True)
        self.load_db()
    
    def load_db(self):
        """Load the database from disk or create a new one"""
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r') as f:
                self.images = json.load(f)
        else:
            self.images = []
            self.save_db()
    
    def save_db(self):
        """Save the database to disk"""
        with open(self.db_path, 'w') as f:
            json.dump(self.images, f, indent=2)
    
    def add_image(self, image_path, metadata=None):
        """Add an image to the database with metadata"""
        if metadata is None:
            metadata = {}
        
        # Create image entry
        image_entry = {
            'id': len(self.images) + 1,
            'path': image_path,
            'uploaded_at': datetime.now().isoformat(),
            'favorites': False,
            'tags': metadata.get('tags', []),
            'description': metadata.get('description', ''),
            'metadata': metadata
        }
        
        self.images.append(image_entry)
        self.save_db()
        return image_entry
    
    def get_image(self, image_id):
        """Get an image by ID"""
        for image in self.images:
            if image['id'] == image_id:
                return image
        return None
    
    def update_image(self, image_id, updates):
        """Update an image's metadata"""
        for i, image in enumerate(self.images):
            if image['id'] == image_id:
                self.images[i].update(updates)
                self.save_db()
                return self.images[i]
        return None
    
    def delete_image(self, image_id):
        """Remove an image from the database"""
        for i, image in enumerate(self.images):
            if image['id'] == image_id:
                deleted = self.images.pop(i)
                self.save_db()
                return deleted
        return None
    
    def get_all_images(self):
        """Get all images in the database"""
        return self.images
    
    def get_favorites(self):
        """Get all favorited images"""
        return [image for image in self.images if image.get('favorites', False)]
    
    def toggle_favorite(self, image_id):
        """Toggle favorite status for an image"""
        for i, image in enumerate(self.images):
            if image['id'] == image_id:
                self.images[i]['favorites'] = not self.images[i].get('favorites', False)
                self.save_db()
                return self.images[i]
        return None

# Create singleton instance
db = ImageDatabase() 