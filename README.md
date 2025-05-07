# Image Retrieval System

A system that allows users to search for images using natural language prompts.

## Features
- Upload and manage a database of 1000+ images
- Search for images using descriptive text prompts
- View and interact with search results
- Save searches and bookmark favorite images

## Quick Start

The easiest way to install and run the system:

```bash
# 0. Create a conda environment (required for FAISS)
conda create -n imgretrieval python=3.9
conda activate imgretrieval

# 1. Setup the environment and install dependencies
python setup.py

# 2. Run the application
python run.py
```

## Python Version Compatibility

This system is compatible with:
- Python 3.8-3.11: Full compatibility with all dependencies
- Python 3.12: Supported with updated dependencies (PyTorch 2.2.0+)

## Important Requirements

### Conda Required for FAISS
This system requires FAISS (Facebook AI Similarity Search) for efficient similarity search, which must be installed using conda. 
Installation via pip is not reliable, especially on newer Python versions or macOS systems.

## Manual Setup and Installation

If you encounter issues with the automatic setup, you can install components manually:

### 1. Install Dependencies

#### Conda Environment (Required for FAISS)
```bash
# Create and activate conda environment
conda create -n imgretrieval python=3.9
conda activate imgretrieval
```

#### Core dependencies
```bash
pip install flask==2.3.3 flask-cors==4.0.0 pillow==10.0.0 sqlalchemy==2.0.20 python-dotenv==1.0.0
```

#### NumPy
For Python 3.8-3.11:
```bash
pip install numpy==1.24.3
```

For Python 3.12 (Conda recommended):
```bash
conda install numpy
# or
pip install numpy --no-build-isolation
```

#### PyTorch and TorchVision
For Python 3.8-3.11:
```bash
pip install torch==2.0.1 torchvision==0.15.2
```

For Python 3.12:
```bash
# Conda (recommended)
conda install pytorch torchvision -c pytorch

# or Pip
pip install torch>=2.2.0 torchvision>=0.17.0
```

#### CLIP (OpenAI's Contrastive Language-Image Pre-training)
If you have installation issues with CLIP, use our helper script:
```bash
python scripts/install_clip.py
```

Or install manually:
```bash
pip install git+https://github.com/openai/CLIP.git
```

#### FAISS (Facebook AI Similarity Search)
FAISS must be installed using conda:

```bash
conda install -c conda-forge faiss-cpu
```

You can also use our helper script (requires conda):
```bash
python scripts/install_faiss.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run build
```

### 3. Running the Application

#### Production mode
```bash
python run.py
```

#### Development mode
```bash
python run.py --dev
```

## Project Structure
- `app.py`: Main Flask application
- `database/`: Database schema and utilities
- `models/`: ML models for image embedding and text processing
- `static/`: Static files (CSS, JS, images)
- `templates/`: HTML templates
- `frontend/`: React frontend application
- `utils/`: Utility functions
- `scripts/`: Helper scripts for installation and maintenance

## Troubleshooting

### Installation Issues

#### Conda Required for FAISS
FAISS requires conda for reliable installation. If you're trying to use pip to install FAISS, it will likely fail, especially on macOS or with newer Python versions.

```bash
# Install FAISS with conda (required)
conda install -c conda-forge faiss-cpu
```

#### Python 3.12 Specific Issues
Python 3.12 is a newer version that may have compatibility issues with some dependencies:

1. NumPy installation: Use conda to install NumPy if possible, or install with `--no-build-isolation` flag.
2. PyTorch: Only PyTorch 2.2.0 and newer versions support Python 3.12. The setup script will automatically detect this.
3. FAISS: Installing via conda is mandatory for Python 3.12 users.

#### CLIP Installation Problems
CLIP can be challenging to install due to its PyTorch dependencies. Try these steps:

1. Make sure PyTorch is installed first with the correct version for your Python version.

2. Try our helper script:
   ```bash
   python scripts/install_clip.py
   ```

3. If that fails, try installing from GitHub directly:
   ```bash
   pip install git+https://github.com/openai/CLIP.git
   ```

4. As a last resort, clone and install from source:
   ```bash
   git clone https://github.com/openai/CLIP.git
   cd CLIP
   pip install -e .
   ```

### Runtime Issues

If the application starts but features don't work:

1. Check server logs for errors related to CLIP or FAISS not being available
2. Verify that PyTorch is installed correctly
3. Try running with the `--verify` flag to check dependencies:
   ```bash
   python run.py --verify
   ```

### FAISS Not Found Errors

If you see "FAISS not available" errors:

1. Make sure you have conda installed and activated
2. Install FAISS with:
   ```bash
   conda install -c conda-forge faiss-cpu
   ```
3. Verify the installation:
   ```python
   python -c "import faiss; print('FAISS installed successfully!')"
   ``` 