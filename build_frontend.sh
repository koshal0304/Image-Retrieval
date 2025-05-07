#!/bin/bash
# Build the React frontend and move to static directory

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Copying to static directory..."
mkdir -p ../static/frontend
cp -r build/* ../static/frontend/

echo "Frontend built successfully!" 