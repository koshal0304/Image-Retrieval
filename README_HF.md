# Deploy to Hugging Face Spaces

This is an Image Retrieval System that uses CLIP for semantic image search.

## Features
- Upload and manage images
- Search images using natural language
- Semantic clustering
- Favorite images

## API Endpoints

- `GET /` - Health check
- `GET /api/status` - System status
- `POST /api/upload` - Upload image
- `POST /api/search` - Search images
- `GET /api/images` - List all images
- `GET /api/favorites` - Get favorite images
- `POST /api/images/<id>/favorite` - Toggle favorite

## Tech Stack

- **Backend**: Flask + Python
- **ML Models**: OpenAI CLIP + FAISS
- **Database**: SQLite

## License

MIT
