#!/bin/bash

# Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# Create necessary directories
mkdir -p static/uploads
mkdir -p index
mkdir -p database

# Install Python dependencies
pip install -r vercel-requirements.txt 