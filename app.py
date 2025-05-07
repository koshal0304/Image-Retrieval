import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pathlib import Path
import json
from werkzeug.utils import secure_filename
import sys

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
    print("Please install the required dependencies with: python setup.py")
    MODULES_LOADED = False

app = Flask(__name__, static_folder='static')
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

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get the status of the system"""
    if not MODULES_LOADED:
        return jsonify({
            'status': 'error',
            'message': 'Required modules not loaded. Please check the server logs.'
        }), 500
        
    return jsonify({
        'status': 'ok',
        'embedder': embedder.model is not None,
        'index_size': image_index.index.ntotal if hasattr(image_index, 'index') else 0,
        'image_count': len(db.get_all_images())
    })

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload a single image file"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        result = image_processor.upload_image(file, file.filename)
        if result:
            return jsonify({
                'success': True,
                'image': result
            }), 200
        else:
            return jsonify({'error': 'Failed to process image'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/search', methods=['POST'])
def search():
    """Search for images using text prompt and optionally a reference image"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get search parameters
    query = data.get('query', '')
    image_id = data.get('imageId')
    limit = data.get('limit', 20)
    weight_text = data.get('weightText', 0.7)
    
    # Validate that at least one search parameter is provided
    if not query and image_id is None:
        return jsonify({'error': 'Either query or imageId must be provided'}), 400
    
    # Perform search
    results = image_index.search(query, limit, image_id, weight_text)
    return jsonify({'results': results}), 200

@app.route('/api/images', methods=['GET'])
def list_images():
    """Get all images in the database"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    images = db.get_all_images()
    return jsonify({'images': images}), 200

@app.route('/api/images/<int:image_id>', methods=['GET'])
def get_image(image_id):
    """Get single image by ID"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    image = db.get_image(image_id)
    if image:
        return jsonify({'image': image}), 200
    return jsonify({'error': 'Image not found'}), 404

@app.route('/api/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    """Delete an image by ID"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    # Get image before deletion
    image = db.get_image(image_id)
    if not image:
        return jsonify({'error': 'Image not found'}), 404
    
    try:
        # Delete from database
        result = db.delete_image(image_id)
        if not result:
            return jsonify({'error': 'Failed to delete image from database'}), 500
        
        # Delete the physical file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], image['filename'])
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # We need to rebuild the index after deleting an image to ensure consistency
        # This could be optimized for larger collections, but for now this is simpler
        image_index.rebuild_index(UPLOAD_FOLDER)
        
        return jsonify({'success': True, 'message': f"Image {image_id} deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting image: {e}")
        return jsonify({'error': f'Error deleting image: {e}'}), 500

@app.route('/api/images/<int:image_id>/favorite', methods=['POST'])
def toggle_favorite(image_id):
    """Toggle favorite status for an image"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    result = db.toggle_favorite(image_id)
    if result:
        return jsonify({'image': result}), 200
    return jsonify({'error': 'Image not found'}), 404

@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    """Get all favorited images"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    favorites = db.get_favorites()
    return jsonify({'images': favorites}), 200

@app.route('/api/reindex', methods=['POST'])
def reindex():
    """Reindex all images in the uploads folder"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    count = image_index.rebuild_index(UPLOAD_FOLDER)
    return jsonify({
        'success': True,
        'count': count
    }), 200

@app.route('/api/batch-import', methods=['POST'])
def batch_import():
    """Import images from a directory on the server"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    data = request.json
    if not data or 'directory' not in data:
        return jsonify({'error': 'No directory specified'}), 400
    
    directory = data['directory']
    if not os.path.exists(directory):
        return jsonify({'error': 'Directory not found'}), 404
    
    processed, failed = image_processor.batch_process_directory(directory)
    return jsonify({
        'success': True,
        'processed': processed,
        'failed': failed
    }), 200

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    """Get auto-generated semantic clusters of images"""
    if not MODULES_LOADED:
        return jsonify({'error': 'System not properly initialized'}), 500
        
    # Get requested number of clusters (default to 5)
    try:
        num_clusters = int(request.args.get('num_clusters', 5))
    except ValueError:
        num_clusters = 5
    
    # Ensure reasonable bounds
    num_clusters = max(2, min(10, num_clusters))
    
    # Get clusters
    clusters = image_index.get_semantic_clusters(num_clusters=num_clusters)
    
    return jsonify({'clusters': clusters}), 200

# Set up routes for static files
@app.route('/static/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('static/frontend/static/js', filename)

@app.route('/static/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('static/frontend/static/css', filename)

@app.route('/static/media/<path:filename>')
def serve_media(filename):
    return send_from_directory('static/frontend/static/media', filename)

@app.route('/static/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory('static/uploads', filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/frontend', 'favicon.ico')

@app.route('/logo192.png')
def logo():
    return send_from_directory('static/frontend', 'logo192.png')

@app.route('/manifest.json')
def manifest():
    return send_from_directory('static/frontend', 'manifest.json')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve frontend files"""
    if path != "" and os.path.exists(os.path.join('static', 'frontend', path)):
        return send_from_directory('static/frontend', path)
    return send_from_directory('static/frontend', 'index.html')

if __name__ == '__main__':
    if not MODULES_LOADED:
        print("\nWARNING: Application started with missing modules.")
        print("Some functionality may not work correctly.")
        print("Please run 'python setup.py' to install all required dependencies.\n")
    
    # Get port from environment variable (for Heroku compatibility)
    port = int(os.environ.get('PORT', 5000))
    
    print(f"Server running on http://localhost:{port}")
    app.run(debug=False, host='0.0.0.0', port=port) 