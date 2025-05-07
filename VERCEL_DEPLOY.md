# Deploying to Vercel

This application is configured to deploy to Vercel. Follow these steps for a successful deployment:

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, but helpful)
   ```
   npm install -g vercel
   ```

## Deployment Steps

### 1. Using the Vercel Dashboard

1. Fork or clone this repository to your GitHub account
2. Log in to your Vercel account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: None (it's configured in vercel.json)
   - Output Directory: frontend/build

6. Click "Deploy"

### 2. Using the Vercel CLI

1. Log in to Vercel CLI:
   ```
   vercel login
   ```

2. Navigate to your project directory and run:
   ```
   vercel
   ```

3. Follow the prompts and your project will be deployed

## Important Notes

### Storage Limitations

Vercel has some limitations for serverless functions:

1. **Ephemeral filesystem**: Files you upload during runtime won't persist between function invocations. Consider using:
   - A database service like MongoDB Atlas, Supabase, or Firebase
   - A storage service like AWS S3, Cloudinary, or Vercel Blob Storage

2. **Function size limits**: Vercel has limits on the size of deployed functions:
   - If deployment fails due to size limits, consider optimizing dependencies
   - You might need to use a service like AWS Lambda with larger function limits

### Environment Variables

Set the following environment variables in the Vercel dashboard:
- `PYTHON_VERSION`: 3.9 (recommended for best compatibility)

### Database Persistence

For a production deployment, configure a persistent database:
1. Set up a MongoDB Atlas, Supabase, or similar service
2. Modify the database module to connect to your cloud database
3. Add the connection string as an environment variable

## Troubleshooting

### Common Issues

1. **Deployment Timeouts**: If your build process times out:
   - Reduce the size of dependencies
   - Consider using a pre-built package for CLIP/FAISS

2. **Missing Dependencies**: If you see import errors:
   - Check the logs to identify which dependency is missing
   - Add the dependency to `api/requirements.txt`

3. **FAISS Installation Issues**: FAISS can be challenging to install in serverless environments:
   - Consider using a cloud vector database like Pinecone or Weaviate instead

### Getting Help

If you encounter issues with your Vercel deployment:
1. Check the deployment logs in the Vercel dashboard
2. Consult the [Vercel Documentation](https://vercel.com/docs)
3. Consider deploying to a different platform if Vercel's limitations are too restrictive 