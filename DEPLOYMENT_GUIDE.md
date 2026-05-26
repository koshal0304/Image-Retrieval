# Complete Deployment Guide: Render + Netlify

This guide will walk you through deploying your Image Retrieval System to **Render (Backend)** and **Netlify (Frontend)** - both 100% FREE!

---

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **Netlify Account** - Sign up at [netlify.com](https://netlify.com) (free)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render + Netlify deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → Select "Web Service"**

3. **Connect Your GitHub Repository**
   - Click "Connect account" if first time
   - Select your repository (`rag2` or whatever you named it)

4. **Configure the Service**
   - **Name**: `rag2-backend` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   - **Branch**: `main`
   - **Runtime**: **Docker** ✅ (Important!)
   - **Plan**: **Free** ✅

5. **Advanced Settings** (Optional but Recommended)
   - **Health Check Path**: `/api/status`
   - **Auto-Deploy**: Yes (deploys automatically on git push)

6. **Click "Create Web Service"**

7. **Wait for Deployment** (5-10 minutes)
   - Watch the build logs
   - Once complete, you'll see: ✅ "Live"
   - **Copy your backend URL**: `https://rag2-backend.onrender.com`

### ⚠️ Important Notes for Render Free Tier

- **Cold Starts**: Free tier spins down after 15 minutes of inactivity. First request after inactivity takes ~30-60 seconds.
- **750 hours/month**: Free tier includes 750 hours of runtime per month (enough for one service running 24/7).
- **No Credit Card Required**: Completely free!

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Frontend

Your frontend is already configured! The `netlify.toml` file has been created.

### Step 2: Deploy on Netlify

#### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to [Netlify Dashboard](https://app.netlify.com/)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to Git Provider**
   - Choose GitHub
   - Authorize Netlify
   - Select your repository

4. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Branch**: `main`

5. **Add Environment Variable** ⚠️ CRITICAL STEP
   - Click "Show advanced"
   - Click "New variable"
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your Render backend URL (e.g., `https://rag2-backend.onrender.com`)
   - ⚠️ **NO trailing slash!**

6. **Click "Deploy site"**

7. **Wait for Deployment** (2-3 minutes)
   - Once complete, you'll get a URL like: `https://random-name-123.netlify.app`

8. **Optional: Custom Domain**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain" (free `.netlify.app` subdomain or your own domain)

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend directory
cd frontend

# Deploy
netlify deploy --prod

# Follow the prompts:
# - Create & configure new site: Yes
# - Build command: npm run build
# - Publish directory: build

# Set environment variable
netlify env:set REACT_APP_API_URL https://rag2-backend.onrender.com
```

---

## ✅ Part 3: Verify Deployment

### Test Your Backend

1. Open your Render URL in browser: `https://rag2-backend.onrender.com/api/status`
2. You should see JSON response:
   ```json
   {
     "status": "ok",
     "embedder": true,
     "index_size": 0,
     "image_count": 0
   }
   ```

### Test Your Frontend

1. Open your Netlify URL: `https://your-site.netlify.app`
2. Try uploading an image
3. Try searching for images
4. Check browser console for any errors

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Build fails on Render
- **Solution**: Check build logs in Render dashboard
- Ensure `Dockerfile` is in root directory
- Verify all dependencies in `requirements.txt`

**Problem**: Backend returns 500 errors
- **Solution**: Check Render logs (Dashboard → Logs)
- Common issue: Missing dependencies or FAISS installation failure

**Problem**: First request is very slow
- **Solution**: This is normal for Render free tier (cold start)
- Backend spins down after 15 min inactivity
- Consider upgrading to paid tier ($7/month) for always-on service

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: Verify `REACT_APP_API_URL` environment variable
- Go to Netlify: Site settings → Environment variables
- Ensure URL has NO trailing slash
- Trigger new deployment after changing env vars

**Problem**: 404 errors on page refresh
- **Solution**: Already handled by `netlify.toml` redirects
- If still occurring, check that `netlify.toml` is in `frontend/` directory

**Problem**: Build fails on Netlify
- **Solution**: Check build logs
- Ensure Node.js version compatibility (using v18)
- Try clearing cache: Site settings → Build & deploy → Clear cache

### CORS Issues

**Problem**: CORS errors in browser console
- **Solution**: Backend already has CORS enabled for all origins
- If issues persist, check Render logs for errors

---

## 🔄 Updating Your Deployment

### Update Backend
```bash
# Make changes to your code
git add .
git commit -m "Update backend"
git push origin main

# Render will automatically redeploy (if auto-deploy is enabled)
```

### Update Frontend
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push origin main

# Netlify will automatically redeploy
```

### Update Environment Variables

**Render**:
1. Dashboard → Your service → Environment
2. Add/Edit variables
3. Save changes (triggers redeploy)

**Netlify**:
1. Site settings → Environment variables
2. Add/Edit variables
3. Trigger new deployment: Deploys → Trigger deploy → Deploy site

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limitations |
|---------|------|------|-------------|
| **Render** | Free | $0/month | 750 hours/month, spins down after 15 min inactivity |
| **Netlify** | Free | $0/month | 100GB bandwidth/month, 300 build minutes/month |
| **Total** | | **$0/month** | Perfect for personal projects and demos |

---

## 🚀 Optional: Upgrade for Production

If you need better performance:

### Render Paid Plan ($7/month)
- No cold starts (always-on)
- Better performance
- More memory

### Netlify Pro ($19/month)
- More bandwidth
- More build minutes
- Better analytics

---

## 📝 Your Deployment URLs

After deployment, save these URLs:

- **Backend API**: `https://rag2-backend.onrender.com`
- **Frontend**: `https://your-site.netlify.app`

---

## 🎉 Success!

Your Image Retrieval System is now live and accessible from anywhere in the world!

**Next Steps**:
1. Share your Netlify URL with others
2. Upload some images to test
3. Try the search functionality
4. Monitor usage in Render and Netlify dashboards

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Issues**: Check your GitHub repository issues

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit API keys or secrets to Git
2. **CORS**: Currently allows all origins - restrict in production
3. **File Uploads**: Consider adding file size limits and validation
4. **Rate Limiting**: Consider adding rate limiting for production use

---

**Happy Deploying! 🚀**
