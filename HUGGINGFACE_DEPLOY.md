# 🚀 Deploy to Hugging Face Spaces (FREE - 2GB RAM)

This guide will help you deploy your Image Retrieval System to Hugging Face Spaces for **FREE** with **2GB RAM** - perfect for ML applications!

---

## ✅ Why Hugging Face Spaces?

- ✅ **100% FREE** - No credit card required
- ✅ **2GB RAM** - Enough for CLIP + FAISS
- ✅ **No cold starts** - Always on
- ✅ **Perfect for ML apps** - Built for AI/ML projects
- ✅ **Easy deployment** - Git-based workflow

---

## 📋 Prerequisites

1. **Hugging Face Account** - Sign up at [huggingface.co](https://huggingface.co/join)
2. **Git** - Already installed on your system
3. **Your code** - Already prepared!

---

## 🚀 Deployment Steps

### Step 1: Create a Hugging Face Space

1. **Go to**: https://huggingface.co/new-space

2. **Fill in the details**:
   - **Space name**: `image-retrieval-system` (or any name you like)
   - **License**: MIT
   - **Select SDK**: **Docker**
   - **Space hardware**: **CPU basic** (FREE)
   - **Visibility**: Public (or Private if you prefer)

3. **Click "Create Space"**

### Step 2: Prepare Your Repository

Run these commands in your terminal:

```bash
# Navigate to your project
cd /Users/kabeer/rag2

# Rename Dockerfile for Hugging Face
cp Dockerfile.hf Dockerfile

# Copy requirements
cp requirements_hf.txt requirements.txt

# Copy app file
cp app_hf.py app.py

# Add README for Hugging Face
cp README_HF.md README.md
```

### Step 3: Push to Hugging Face

```bash
# Add Hugging Face as a remote
# Replace YOUR_USERNAME and YOUR_SPACE_NAME with your actual values
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME

# Create a new branch for HF deployment
git checkout -b hf-deploy

# Add and commit the HF-specific files
git add Dockerfile app.py requirements.txt README.md
git commit -m "Deploy to Hugging Face Spaces"

# Push to Hugging Face
git push hf hf-deploy:main
```

**Note**: You'll be prompted for your Hugging Face credentials:
- **Username**: Your HF username
- **Password**: Use your **HF Access Token** (not your password)
  - Get it from: https://huggingface.co/settings/tokens
  - Click "New token" → "Write" access → Copy the token

### Step 4: Wait for Deployment

1. Go to your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`
2. Watch the build logs (takes 5-10 minutes)
3. Once you see "Running", your app is live!

### Step 5: Get Your API URL

Your backend will be available at:
```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

Example: `https://johndoe-image-retrieval-system.hf.space`

---

## 🎨 Update Netlify Frontend

Now update your Netlify frontend to use the new Hugging Face backend:

1. **Go to Netlify**: https://app.netlify.com/sites/image-retriver12/configuration/env

2. **Update Environment Variable**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`
   - ⚠️ **NO trailing slash!**

3. **Trigger Redeploy**:
   - Go to: https://app.netlify.app/sites/image-retriver12/deploys
   - Click "Trigger deploy" → "Clear cache and deploy site"

---

## ✅ Test Your Deployment

### Test Backend:

```bash
# Replace with your actual HF Space URL
curl https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health
```

Should return:
```json
{
  "status": "healthy",
  "message": "Image Retrieval System API is running"
}
```

### Test Frontend:

1. Open: https://image-retriver12.netlify.app/
2. Try uploading an image
3. Try searching for images

---

## 🔧 Troubleshooting

### Build Fails

**Check build logs** in your HF Space:
- Go to your Space → "Logs" tab
- Look for error messages
- Common issues:
  - Missing dependencies → Check requirements.txt
  - Port issues → Ensure PORT=7860 in Dockerfile

### App Not Responding

**Check if app is running**:
- Go to your Space → Should show "Running" status
- If "Building" → Wait for build to complete
- If "Error" → Check logs

### Frontend Can't Connect

**Verify environment variable**:
- Netlify → Site settings → Environment variables
- Ensure `REACT_APP_API_URL` is correct
- NO trailing slash!
- Trigger new deployment after changing

---

## 📊 Monitoring

### View Logs:
- Go to your Space → "Logs" tab
- See real-time application logs

### Check Usage:
- Go to your Space → "Settings" tab
- See CPU/RAM usage

---

## 🎉 Success!

Your Image Retrieval System is now deployed on Hugging Face Spaces with:
- ✅ 2GB RAM (enough for ML models)
- ✅ 100% FREE
- ✅ No cold starts
- ✅ Always available

---

## 🔄 Updating Your App

To update your deployed app:

```bash
# Make changes to your code
# Then commit and push

git add .
git commit -m "Update app"
git push hf hf-deploy:main
```

Hugging Face will automatically rebuild and redeploy!

---

## 💡 Tips

1. **Keep your main branch clean**: Use `hf-deploy` branch for HF-specific changes
2. **Monitor logs**: Check logs regularly for errors
3. **Test locally first**: Always test changes locally before deploying
4. **Use Git LFS for large files**: If you have large model files

---

## 📚 Resources

- **HF Spaces Docs**: https://huggingface.co/docs/hub/spaces
- **Docker Spaces**: https://huggingface.co/docs/hub/spaces-sdks-docker
- **HF Community**: https://discuss.huggingface.co/

---

**Need help?** Check the HF Spaces documentation or ask in the HF community forum!
