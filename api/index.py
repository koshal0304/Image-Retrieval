from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up error handling for module imports
try:
    # Import our modules
    from models.image_embedder import embedder
    from models.index import image_index
    from database.db import db
    from utils.image_processor import image_processor
    
    MODULES_LOADED = True
except ImportError as e:
    print(f"ERROR: Failed to import required modules: {e}")
    MODULES_LOADED = False

app = Flask(__name__, static_folder='../static')
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(app.static_folder, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create necessary directories
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Import all routes from the main app.py
from app import (get_status, upload_file, search, list_images, get_image, 
                delete_image, toggle_favorite, get_favorites, reindex, 
                batch_import, get_clusters, serve_js, serve_css, serve_media, 
                serve_uploads, favicon, logo, manifest, serve)

# Set up routes
app.add_url_rule('/api/status', 'get_status', get_status, methods=['GET'])
app.add_url_rule('/api/upload', 'upload_file', upload_file, methods=['POST'])
app.add_url_rule('/api/search', 'search', search, methods=['POST'])
app.add_url_rule('/api/images', 'list_images', list_images, methods=['GET'])
app.add_url_rule('/api/images/<int:image_id>', 'get_image', get_image, methods=['GET'])
app.add_url_rule('/api/images/<int:image_id>', 'delete_image', delete_image, methods=['DELETE'])
app.add_url_rule('/api/images/<int:image_id>/favorite', 'toggle_favorite', toggle_favorite, methods=['POST'])
app.add_url_rule('/api/favorites', 'get_favorites', get_favorites, methods=['GET'])
app.add_url_rule('/api/reindex', 'reindex', reindex, methods=['POST'])
app.add_url_rule('/api/batch-import', 'batch_import', batch_import, methods=['POST'])
app.add_url_rule('/api/clusters', 'get_clusters', get_clusters, methods=['GET'])

# Static file routes
app.add_url_rule('/static/js/<path:filename>', 'serve_js', serve_js)
app.add_url_rule('/static/css/<path:filename>', 'serve_css', serve_css)
app.add_url_rule('/static/media/<path:filename>', 'serve_media', serve_media)
app.add_url_rule('/static/uploads/<path:filename>', 'serve_uploads', serve_uploads)
app.add_url_rule('/favicon.ico', 'favicon', favicon)
app.add_url_rule('/logo192.png', 'logo', logo)
app.add_url_rule('/manifest.json', 'manifest', manifest)

# Catch-all route for frontend
app.add_url_rule('/', 'serve_index', lambda: serve(''), defaults={'path': ''})
app.add_url_rule('/<path:path>', 'serve', serve)

# For Vercel serverless function
def handler(environ, start_response):
    return app.wsgi_app(environ, start_response) 