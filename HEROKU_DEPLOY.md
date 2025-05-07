# Deploying to Heroku

This guide explains how to deploy the Image Retrieval System to Heroku with dedicated dynos for better performance.

## Prerequisites

1. A Heroku account (sign up at [heroku.com](https://heroku.com))
2. Heroku CLI installed (see installation instructions below)
3. Git installed and project in a git repository

## Install Heroku CLI

**macOS (using Homebrew):**
```bash
brew tap heroku/brew && brew install heroku
```

**Other platforms:**
Visit [Heroku CLI Installation](https://devcenter.heroku.com/articles/heroku-cli) for instructions.

## Deployment Steps

### 1. Prepare Your Application

Before deploying, run our automated setup:

```bash
# Make scripts executable
chmod +x build_frontend.sh heroku_setup.py

# Run the Heroku setup script
./heroku_setup.py
```

### 2. Login to Heroku

```bash
heroku login
```

### 3. Create a Heroku Application

```bash
# Create a new Heroku app
heroku create your-app-name

# Or if you want Heroku to generate a name for you
heroku create
```

### 4. Configure Your Heroku App

```bash
# Add the apt buildpack for system dependencies
heroku buildpacks:add --index 1 heroku-community/apt

# Add the Python buildpack
heroku buildpacks:add --index 2 heroku/python

# Set to standard-2x dyno for better performance
heroku ps:type standard-2x
```

### 5. Deploy to Heroku

```bash
# Push your code to Heroku
git push heroku main

# If you're on a different branch (e.g., master)
git push heroku master:main
```

### 6. Scale Your App

```bash
# Scale to 1 web dyno (standard-2x)
heroku ps:scale web=1
```

### 7. Open Your Application

```bash
heroku open
```

## Working with FAISS and CLIP on Heroku

FAISS and CLIP require significant resources to run efficiently:

1. **Dyno Size**: We recommend at least `standard-2x` dynos for this application
2. **System Dependencies**: Required libraries are installed via the Aptfile
3. **Cold Start**: The first load may be slow as CLIP and FAISS models load

## Troubleshooting

### Deployment Issues

1. **Memory Errors**:
   - Upgrade to a larger dyno type (performance-m or performance-l)
   - Reduce model sizes or optimize memory usage

2. **Slug Size Limits**:
   - Heroku has a 500MB slug size limit
   - Use `.slugignore` to exclude non-essential files
   - Consider storing models in external storage (AWS S3)

3. **Timeout During Build**:
   - If builds timeout, try splitting the deployment steps
   - Pre-download models and upload them separately

### Runtime Issues

1. **Application Crashes**:
   - Check logs with: `heroku logs --tail`
   - Monitor dyno memory usage: `heroku metrics:web`

2. **Slow Performance**:
   - Upgrade to performance-tier dynos
   - Optimize model loading and inference

## Maintaining Your Deployment

### Checking Logs

```bash
heroku logs --tail
```

### Monitoring Resource Usage

```bash
heroku metrics:web
```

### Updating Your Application

```bash
# After making changes locally
git add .
git commit -m "Your update message"
git push heroku main
```

### Database Considerations

For a persistent database:
1. Add a Heroku PostgreSQL add-on: `heroku addons:create heroku-postgresql:hobby-dev`
2. Configure the application to use the database URL: `heroku config:get DATABASE_URL` 