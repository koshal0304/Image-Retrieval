import os
import sys
import time
import concurrent.futures
from PIL import Image
from pathlib import Path
from models.image_embedder import embedder
from models.index import image_index
from database.db import db

class ImageProcessor:
    def __init__(self, upload_dir="static/uploads"):
        """Initialize image processor with upload directory"""
        self.upload_dir = upload_dir
        Path(upload_dir).mkdir(parents=True, exist_ok=True)
        
    def process_image(self, file_path, save_metadata=True):
        """Process a single image: resize, validate, embed and index"""
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                return None
                
            # Open and validate image
            try:
                img = Image.open(file_path).convert("RGB")
                
                # Resize if too large (preserve aspect ratio)
                max_size = 1920
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                    img.save(file_path)
            except Exception as e:
                print(f"Error processing image {file_path}: {e}")
                return None
                
            # Generate relative path for storage
            rel_path = os.path.relpath(file_path, start=os.path.dirname(self.upload_dir))
            
            # Generate embedding and add to index
            embedding = embedder.embed_image(file_path)
            if embedding is not None:
                # Add to index
                success = image_index.add_image(rel_path, embedding)
                
                # Save metadata to database
                if success and save_metadata:
                    db.add_image(rel_path, {
                        'width': img.width,
                        'height': img.height,
                        'format': img.format
                    })
                    
                return {
                    'path': rel_path,
                    'width': img.width,
                    'height': img.height,
                    'success': True
                }
        except Exception as e:
            print(f"Error processing image {file_path}: {e}")
            
        return None
        
    def batch_process_directory(self, directory, max_workers=8):
        """Process all images in a directory using multi-threading"""
        processed = 0
        failed = 0
        
        # Get list of image files
        image_files = []
        for root, _, files in os.walk(directory):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    image_files.append(os.path.join(root, file))
        
        total = len(image_files)
        if total == 0:
            return 0, 0
            
        print(f"Processing {total} images...")
        start_time = time.time()
        
        # Process images in parallel
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {executor.submit(self.process_image, file): file for file in image_files}
            
            for future in concurrent.futures.as_completed(future_to_file):
                file = future_to_file[future]
                try:
                    result = future.result()
                    if result:
                        processed += 1
                    else:
                        failed += 1
                        
                    # Print progress
                    progress = (processed + failed) / total * 100
                    sys.stdout.write(f"\rProgress: {progress:.1f}% ({processed}/{total})")
                    sys.stdout.flush()
                except Exception as e:
                    print(f"Error processing {file}: {e}")
                    failed += 1
        
        elapsed_time = time.time() - start_time
        print(f"\nProcessed {processed} images in {elapsed_time:.2f} seconds. Failed: {failed}")
        
        return processed, failed
        
    def upload_image(self, file_obj, filename):
        """Process an uploaded image file"""
        # Secure filename
        secure_name = "".join([c for c in filename if c.isalpha() or c.isdigit() or c in '._- ']).strip()
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{secure_name}"
        
        # Save file
        file_path = os.path.join(self.upload_dir, unique_filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if hasattr(file_obj, 'save'):
            # For web uploads (Flask)
            file_obj.save(file_path)
        else:
            # For file-like objects
            with open(file_path, 'wb') as f:
                f.write(file_obj.read())
        
        # Process image
        result = self.process_image(file_path)
        if result:
            return result
            
        # If processing failed, delete the file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return None

# Create singleton instance
image_processor = ImageProcessor() 