#!/usr/bin/env python3
import os
import argparse
import subprocess
import webbrowser
import time
import sys
from pathlib import Path

def setup_env():
    """Set up the environment if needed"""
    # Create necessary directories
    Path('static/uploads').mkdir(parents=True, exist_ok=True)
    Path('index').mkdir(parents=True, exist_ok=True)
    Path('database').mkdir(parents=True, exist_ok=True)

def verify_dependencies():
    """Verify that all required dependencies are installed"""
    try:
        # Check for critical dependencies
        import flask
        import numpy
        
        # Try to import CLIP
        try:
            import clip
            clip_available = True
        except ImportError:
            clip_available = False
            print("WARNING: CLIP not available. Image embedding will not work.")
            print("Please run 'python setup.py' to install all dependencies.")
        
        # Try to import FAISS
        try:
            import faiss
            faiss_available = True
        except ImportError:
            faiss_available = False
            print("ERROR: FAISS not available. Vector search will not work.")
            print("Please run 'conda install -c conda-forge faiss-cpu' to install FAISS.")
        
        return clip_available and faiss_available
    except ImportError as e:
        print(f"ERROR: Missing critical dependency: {e}")
        print("Please run 'python setup.py' to install all dependencies.")
        return False

def build_frontend():
    """Build the React frontend"""
    if not os.path.exists('frontend/node_modules'):
        print("Installing frontend dependencies...")
        try:
            subprocess.run(['npm', 'install'], cwd='frontend', check=True)
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print(f"Error installing frontend dependencies: {e}")
            print("Make sure Node.js and npm are installed.")
            return False
    
    print("Building frontend...")
    try:
        subprocess.run(['npm', 'run', 'build'], cwd='frontend', check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Error building frontend: {e}")
        return False

def run_app(dev_mode=False):
    """Run the Flask application"""
    # Set up environment
    setup_env()
    
    # Verify dependencies
    all_deps_available = verify_dependencies()
    if not all_deps_available:
        proceed = input("Some dependencies are missing. Proceed anyway? (y/n): ")
        if proceed.lower() != 'y':
            print("Aborting. Please run 'python setup.py' to install dependencies.")
            return
    
    # Determine the appropriate port (use 5002 on macOS)
    import platform
    default_port = 5002 if platform.system() == 'Darwin' else 5000
    port = os.environ.get('FLASK_RUN_PORT', str(default_port))
    
    if dev_mode:
        # Start backend
        os.environ['FLASK_RUN_PORT'] = port
        backend_process = subprocess.Popen(['python', 'app.py'])
        
        # Start frontend dev server
        try:
            frontend_process = subprocess.Popen(['npm', 'start'], cwd='frontend')
            
            print("\nRunning in development mode!")
            print(f"Backend running at http://localhost:{port}")
            print("Frontend running at http://localhost:3000")
            
            try:
                # Open browser after a short delay
                time.sleep(2)
                webbrowser.open('http://localhost:3000')
                
                # Wait for keyboard interrupt
                backend_process.wait()
            except KeyboardInterrupt:
                print("\nShutting down...")
            finally:
                backend_process.terminate()
                frontend_process.terminate()
        except FileNotFoundError:
            print("Error: npm not found. Make sure Node.js is installed.")
            backend_process.terminate()
    else:
        # Build frontend first
        frontend_built = build_frontend()
        if not frontend_built:
            print("WARNING: Frontend build failed. Using existing files if available.")
        
        # Run the Flask app
        print("\nStarting application...")
        print(f"Server running at http://localhost:{port}")
        
        # Open browser after a short delay
        time.sleep(1)
        webbrowser.open(f"http://localhost:{port}")
        
        # Set the Flask port and run the app
        os.environ['FLASK_RUN_PORT'] = port
        subprocess.run(['python', 'app.py'])

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Image Retrieval System')
    parser.add_argument('--dev', action='store_true', help='Run in development mode')
    parser.add_argument('--build-frontend', action='store_true', help='Build the frontend only')
    parser.add_argument('--verify', action='store_true', help='Verify dependencies')
    
    args = parser.parse_args()
    
    if args.verify:
        all_deps = verify_dependencies()
        if all_deps:
            print("All dependencies verified successfully!")
        sys.exit(0 if all_deps else 1)
    elif args.build_frontend:
        success = build_frontend()
        sys.exit(0 if success else 1)
    else:
        run_app(dev_mode=args.dev) 