#!/usr/bin/env python3
"""
FAISS installation helper script.

This script helps install Facebook AI Similarity Search (FAISS) using conda,
which is the recommended and most reliable way to install it.
"""

import subprocess
import sys
import os
import platform
import shutil

def is_conda_available():
    """Check if conda command is available in PATH"""
    return shutil.which('conda') is not None

def install_faiss():
    print("FAISS Installation Helper")
    print("========================")
    
    # Check Python version
    python_version = platform.python_version()
    print(f"Python version: {python_version}")
    
    # Check if in conda environment
    in_conda = os.environ.get('CONDA_PREFIX') is not None
    conda_available = is_conda_available()
    
    if in_conda:
        print("Detected conda environment")
        if conda_available:
            print("Conda command is available")
        else:
            print("Conda environment detected, but 'conda' command not found in PATH")
            print("ERROR: The 'conda' command must be available to install FAISS")
            return False
    else:
        print("ERROR: Not in a conda environment")
        print("FAISS installation requires conda. Please create and activate a conda environment first.")
        print("  conda create -n myenv python=3.9")
        print("  conda activate myenv")
        return False
    
    # Check if NumPy is installed
    try:
        import numpy
        print(f"NumPy version: {numpy.__version__}")
        numpy_installed = True
    except ImportError:
        print("NumPy not installed")
        numpy_installed = False
    
    # Install NumPy if not installed
    if not numpy_installed:
        print("\nInstalling NumPy...")
        try:
            if python_version.startswith('3.12'):
                # Use conda for numpy with Python 3.12
                try:
                    subprocess.check_call(['conda', 'install', '-y', 'numpy'])
                    print("NumPy installation via conda successful")
                except subprocess.CalledProcessError:
                    print("ERROR: Failed to install NumPy")
                    return False
            else:
                # Standard installation for other Python versions
                try:
                    subprocess.check_call(['conda', 'install', '-y', 'numpy==1.24.3'])
                    print("NumPy installation successful")
                except subprocess.CalledProcessError:
                    print("ERROR: Failed to install NumPy")
                    return False
        except Exception as e:
            print(f"Failed to install NumPy: {e}")
            return False
    
    # Attempt to install FAISS using conda
    print("\nInstalling FAISS CPU version...")
    
    try:
        print("Installing via conda (this is the recommended approach)...")
        subprocess.check_call([
            'conda', 'install', '-y', 
            'faiss-cpu', 
            '-c', 'conda-forge'
        ])
        print("FAISS installation via conda successful")
        
        # Verify FAISS installation
        try:
            import faiss
            print(f"FAISS installed successfully!")
            return True
        except ImportError as e:
            print(f"FAISS installation verification failed: {e}")
            return False
    except subprocess.CalledProcessError as e:
        print(f"Failed to install FAISS: {e}")
        print("\nPlease try again with:")
        print("conda install -c conda-forge faiss-cpu")
        return False

if __name__ == "__main__":
    success = install_faiss()
    if success:
        print("\nFAISS has been successfully installed!")
        print("You can now run the image retrieval system with:\n")
        print("python run.py")
    else:
        print("\nFAISS installation encountered issues.")
        print("FAISS is required for this application to function correctly.")
        print("Please install conda and then run:")
        print("conda install -c conda-forge faiss-cpu")
        sys.exit(1) 