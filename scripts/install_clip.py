#!/usr/bin/env python3
"""
CLIP installation helper script.

This script helps install OpenAI's CLIP model which is sometimes
problematic to install through regular pip due to dependencies.
"""

import subprocess
import sys
import os
import platform
import shutil

def is_conda_available():
    """Check if conda command is available in PATH"""
    return shutil.which('conda') is not None

def install_clip():
    print("CLIP Installation Helper")
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
            print("Will use pip for installations")
    
    # Check if PyTorch is installed
    try:
        import torch
        import torchvision
        print(f"PyTorch version: {torch.__version__}")
        print(f"TorchVision version: {torchvision.__version__}")
        torch_installed = True
    except ImportError:
        print("PyTorch and/or TorchVision not installed")
        torch_installed = False
    
    # Install PyTorch if not installed
    if not torch_installed:
        print("\nInstalling PyTorch and TorchVision...")
        try:
            # For Python 3.12, we need newer PyTorch versions
            if python_version.startswith('3.12'):
                if in_conda and conda_available:
                    try:
                        print("Using conda to install PyTorch...")
                        subprocess.check_call([
                            'conda', 'install', '-y',
                            'pytorch', 'torchvision',
                            '-c', 'pytorch'
                        ])
                        print("PyTorch installation via conda successful")
                    except subprocess.CalledProcessError:
                        print("Conda install failed. Trying pip...")
                        subprocess.check_call([
                            sys.executable, "-m", "pip", "install",
                            "torch>=2.2.0",
                            "torchvision>=0.17.0"
                        ])
                else:
                    subprocess.check_call([
                        sys.executable, "-m", "pip", "install",
                        "torch>=2.2.0",
                        "torchvision>=0.17.0"
                    ])
            # For older Python versions, use the original versions
            else:
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install",
                    "torch==2.0.1",
                    "torchvision==0.15.2"
                ])
            print("PyTorch installation successful")
        except subprocess.CalledProcessError as e:
            print(f"Failed to install PyTorch: {e}")
            print("\nPlease try installing PyTorch manually:")
            if python_version.startswith('3.12'):
                print("pip install torch>=2.2.0 torchvision>=0.17.0")
            else:
                print("pip install torch==2.0.1 torchvision==0.15.2")
            print("\nOr visit https://pytorch.org/get-started/locally/ for installation instructions specific to your system.")
            return False
    
    # Install CLIP and its dependencies
    print("\nInstalling CLIP from GitHub...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "ftfy", "regex", "tqdm"
        ])
        print("CLIP dependencies installed")
        
        # Install CLIP directly from GitHub
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "git+https://github.com/openai/CLIP.git"
        ])
        print("CLIP installation successful")
        
        # Verify CLIP installation
        try:
            import clip
            print(f"CLIP installed successfully!")
            return True
        except ImportError as e:
            print(f"CLIP installation verification failed: {e}")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"Failed to install CLIP: {e}")
        print("\nAlternative installation method:")
        print("1. git clone https://github.com/openai/CLIP.git")
        print("2. cd CLIP")
        print("3. pip install -e .")
        return False

if __name__ == "__main__":
    success = install_clip()
    if success:
        print("\nCLIP has been successfully installed!")
        print("You can now run the image retrieval system with:\n")
        print("python run.py")
    else:
        print("\nCLIP installation encountered issues.")
        print("Please try the alternative methods suggested above.")
        sys.exit(1) 