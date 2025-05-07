#!/usr/bin/env python3
import os
import subprocess
import sys
from pathlib import Path

def main():
    """Set up the application for Heroku deployment"""
    print("Setting up Image Retrieval System for Heroku deployment...")
    
    # Create necessary directories
    print("Creating directories...")
    Path('static/uploads').mkdir(parents=True, exist_ok=True)
    Path('index').mkdir(parents=True, exist_ok=True)
    Path('database').mkdir(parents=True, exist_ok=True)
    
    # Install dependencies with specific order
    print("Installing dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "heroku-requirements.txt"])
    
    # Build frontend if npm is available
    try:
        subprocess.check_call(["./build_frontend.sh"])
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Warning: Failed to build frontend: {e}")
        print("You can run './build_frontend.sh' manually if Node.js is installed")
    
    print("\nSetup complete! App is ready for Heroku deployment.")
    print("Run 'heroku create' and 'git push heroku main' to deploy.")

if __name__ == "__main__":
    main() 