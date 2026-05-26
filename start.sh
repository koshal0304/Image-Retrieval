#!/bin/bash

# Start script for Render deployment
echo "Starting Image Retrieval Backend..."
echo "PORT: ${PORT:-10000}"
echo "Python version: $(python --version)"

# Create necessary directories
mkdir -p static/uploads index database

# Start gunicorn with sync workers (better for ML workloads)
exec gunicorn \
    --bind 0.0.0.0:${PORT:-10000} \
    --workers 1 \
    --worker-class sync \
    --timeout 300 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    --preload \
    app:app
