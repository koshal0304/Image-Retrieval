#!/usr/bin/env python3
"""
Import script to batch process a directory of images
and add them to the image retrieval system.

Usage:
  python scripts/import_images.py --dir /path/to/images --limit 100
"""

import os
import sys
import argparse
from pathlib import Path

# Add parent directory to path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.image_processor import image_processor

def import_images(directory, limit=None, recursive=True):
    """Import images from a directory"""
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return False
    
    # Get all image files
    image_files = []
    valid_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
    
    if recursive:
        # Walk through all subdirectories
        for root, _, files in os.walk(directory):
            for file in files:
                if any(file.lower().endswith(ext) for ext in valid_extensions):
                    image_files.append(os.path.join(root, file))
    else:
        # Only get files in the specified directory
        for file in os.listdir(directory):
            if any(file.lower().endswith(ext) for ext in valid_extensions):
                image_files.append(os.path.join(directory, file))
    
    if limit and len(image_files) > limit:
        print(f"Limiting to {limit} images out of {len(image_files)} found")
        image_files = image_files[:limit]
    else:
        print(f"Found {len(image_files)} images")
    
    # Process the images
    processed, failed = image_processor.batch_process_directory(directory, max_workers=8)
    
    print(f"\nResults: {processed} images processed, {failed} failed")
    return processed > 0

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Import images into the retrieval system')
    parser.add_argument('--dir', required=True, help='Directory containing images')
    parser.add_argument('--limit', type=int, help='Maximum number of images to import')
    parser.add_argument('--no-recursive', action='store_true', help='Do not include subdirectories')
    
    args = parser.parse_args()
    
    # Make sure the uploads directory exists
    Path('static/uploads').mkdir(parents=True, exist_ok=True)
    
    # Import the images
    success = import_images(
        args.dir, 
        limit=args.limit, 
        recursive=not args.no_recursive
    )
    
    if success:
        print("Import completed successfully")
    else:
        print("Import failed") 