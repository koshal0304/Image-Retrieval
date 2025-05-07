from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Mock data for demonstration
MOCK_IMAGES = [
    {"id": 1, "filename": "image1.jpg", "path": "/mock-images/image1.jpg", "favorite": False, 
     "dimensions": {"width": 800, "height": 600}, "created_at": "2023-05-15T10:30:00Z"},
    {"id": 2, "filename": "image2.jpg", "path": "/mock-images/image2.jpg", "favorite": True, 
     "dimensions": {"width": 1200, "height": 800}, "created_at": "2023-05-16T14:22:00Z"},
    {"id": 3, "filename": "image3.jpg", "path": "/mock-images/image3.jpg", "favorite": False, 
     "dimensions": {"width": 1600, "height": 900}, "created_at": "2023-05-17T09:15:00Z"},
]

MOCK_SEARCH_RESULTS = MOCK_IMAGES

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get the status of the system"""
    return jsonify({
        'status': 'ok',
        'embedder': True,
        'index_size': 3,
        'image_count': 3
    })

@app.route('/api/images', methods=['GET'])
def list_images():
    """Get all images in the database"""
    return jsonify({'images': MOCK_IMAGES}), 200

@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    """Get all favorited images"""
    favorites = [img for img in MOCK_IMAGES if img.get('favorite')]
    return jsonify({'images': favorites}), 200

@app.route('/api/search', methods=['POST'])
def search():
    """Mock search endpoint for demo purposes"""
    data = request.json or {}
    query = data.get('query', '')
    
    # Just return all images for demo
    return jsonify({'results': MOCK_SEARCH_RESULTS}), 200

@app.route('/api/deploy-info', methods=['GET'])
def deploy_info():
    """Information about this deployment"""
    return jsonify({
        'status': 'success',
        'message': 'This is a demo deployment on Vercel. The full functionality is limited because FAISS and CLIP cannot be easily deployed on serverless environments.',
        'deployed_at': '2023-08-01T12:00:00Z',
        'environment': 'vercel-serverless'
    })

# For Vercel serverless function
def handler(environ, start_response):
    return app.wsgi_app(environ, start_response) 