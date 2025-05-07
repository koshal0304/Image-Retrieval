#!/usr/bin/env python3
"""
Setup script for the Image Retrieval System.
This script helps install dependencies in the correct order.
"""

import subprocess
import sys
import os
from pathlib import Path
import platform
import shutil

def is_conda_available():
    """Check if conda command is available in PATH"""
    return shutil.which('conda') is not None

def install_requirements():
    print("Installing base dependencies...")
    
    # Check Python version
    python_version = platform.python_version()
    print(f"Using Python {python_version}")
    
    # Check if conda environment
    in_conda = os.environ.get('CONDA_PREFIX') is not None
    conda_available = is_conda_available()
    
    if in_conda:
        print("Detected conda environment. Using conda-specific installation approach.")
        if conda_available:
            print("Conda command is available")
        else:
            print("Conda environment detected, but 'conda' command not found in PATH")
            print("Will use pip for installations")
    
    try:
        # For Python 3.12 in conda, we need to install numpy differently
        if in_conda and conda_available and python_version.startswith('3.12'):
            print("Installing numpy via conda (Python 3.12 compatibility)...")
            try:
                subprocess.check_call(['conda', 'install', '-y', 'numpy'])
                print("NumPy installation via conda successful")
            except subprocess.CalledProcessError:
                print("Could not install numpy via conda. Attempting pip install...")
                # Still try pip as fallback
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install",
                    "numpy",
                    "--no-build-isolation"
                ])
        else:
            # Regular pip install
            subprocess.check_call([
                sys.executable, "-m", "pip", "install",
                "numpy==1.24.3"
            ])
            print("NumPy installation successful")
        
        # Install basic Flask and other dependencies
        print("Installing Flask and other basic dependencies...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "flask==2.3.3",
            "flask-cors==4.0.0",
            "pillow==10.0.0", 
            "sqlalchemy==2.0.20",
            "python-dotenv==1.0.0"
        ])
        
        print("Installing PyTorch...")
        if python_version.startswith('3.12'):
            print("Detected Python 3.12, installing compatible PyTorch version...")
            if in_conda and conda_available:
                print("Using conda to install PyTorch for better compatibility...")
                try:
                    subprocess.check_call([
                        'conda', 'install', '-y',
                        'pytorch', 'torchvision',
                        '-c', 'pytorch'
                    ])
                except subprocess.CalledProcessError:
                    print("Conda install failed. Falling back to pip...")
                    subprocess.check_call([
                        sys.executable, "-m", "pip", "install",
                        "torch>=2.2.0",
                        "torchvision>=0.17.0"
                    ])
            else:
                # Regular pip install for PyTorch with Python 3.12 compatibility
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install",
                    "torch>=2.2.0",
                    "torchvision>=0.17.0"
                ])
        else:
            # Install original PyTorch versions for older Python versions
            if in_conda and conda_available:
                print("Using conda to install PyTorch for better compatibility...")
                try:
                    subprocess.check_call([
                        'conda', 'install', '-y',
                        'pytorch==2.0.1',
                        'torchvision==0.15.2',
                        '-c', 'pytorch'
                    ])
                except subprocess.CalledProcessError:
                    print("Conda install failed. Falling back to pip...")
                    subprocess.check_call([
                        sys.executable, "-m", "pip", "install",
                        "torch==2.0.1",
                        "torchvision==0.15.2"
                    ])
            else:
                # Regular pip install for PyTorch
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install",
                    "torch==2.0.1",
                    "torchvision==0.15.2"
                ])
        
        print("Installing CLIP from GitHub...")
        # First install CLIP dependencies
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "ftfy", "regex", "tqdm"
        ])
        
        # Now install CLIP itself
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install",
                "git+https://github.com/openai/CLIP.git"
            ])
        except subprocess.CalledProcessError:
            print("CLIP installation failed. Please run: python scripts/install_clip.py")
        
        print("Installing FAISS and Transformers...")
        if in_conda and conda_available:
            print("Using conda to install FAISS (strongly recommended)...")
            try:
                subprocess.check_call([
                    'conda', 'install', '-y', 
                    'faiss-cpu', 
                    '-c', 'conda-forge'
                ])
                print("FAISS installed via conda successfully")
            except subprocess.CalledProcessError:
                print("ERROR: FAISS installation failed. FAISS is required for this application.")
                print("Please try installing manually: conda install -c conda-forge faiss-cpu")
                return False
        else:
            print("ERROR: FAISS installation requires conda.")
            print("Please install conda and try again, or run manually:")
            print("conda install -c conda-forge faiss-cpu")
            return False
        
        # Install transformers in any case
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "transformers==4.31.0"
        ])
        
        print("\nDependencies installed successfully!")
        return True
    except Exception as e:
        print(f"\nError during installation: {e}")
        print("\nSome dependencies may have failed to install.")
        print("Please try installing them individually:")
        print("1. For NumPy: conda install numpy (if using conda) or pip install numpy")
        print("2. For CLIP: python scripts/install_clip.py")
        print("3. For FAISS: conda install -c conda-forge faiss-cpu")
        return False

def setup_directories():
    """Create necessary directories for the application"""
    print("Setting up directories...")
    Path('static/uploads').mkdir(parents=True, exist_ok=True)
    Path('index').mkdir(parents=True, exist_ok=True)
    Path('database').mkdir(parents=True, exist_ok=True)
    Path('static/frontend').mkdir(parents=True, exist_ok=True)
    print("Directories created successfully!")

if __name__ == "__main__":
    print("Setting up Image Retrieval System...\n")
    
    # Create directories
    setup_directories()
    
    # Install dependencies
    if install_requirements():
        print("\nSetup completed successfully!")
        print("\nNext steps:")
        print("1. Start the application:")
        print("   python run.py")
        print("\n2. Or start in development mode:")
        print("   python run.py --dev")
        print("\n3. To import existing images:")
        print("   python scripts/import_images.py --dir /path/to/images")
    else:
        print("\nSetup completed with some issues.")
        print("You can try running the individual installation scripts:")
        print("1. python scripts/install_clip.py")
        print("2. For FAISS: conda install -c conda-forge faiss-cpu")
        print("\nThen try running the application with: python run.py") 