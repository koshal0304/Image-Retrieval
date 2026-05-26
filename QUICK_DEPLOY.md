# 🚀 Quick Deploy Checklist

Follow these steps to deploy in under 15 minutes!

## ✅ Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Render account created (render.com)
- [ ] Netlify account created (netlify.com)
- [ ] Code is ready to push

---

## 📦 Step 1: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

If you haven't set up Git yet:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend to Render (5 minutes)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `rag2-backend`
   - **Runtime**: **Docker** ⚠️ Important!
   - **Plan**: **Free**
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for build
7. **Copy your URL**: `https://rag2-backend.onrender.com` ⚠️ You'll need this!

---

## 🎨 Step 3: Deploy Frontend to Netlify (5 minutes)

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. **Add Environment Variable** ⚠️ CRITICAL:
   - Click "Show advanced" → "New variable"
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://rag2-backend.onrender.com` (your Render URL, NO trailing slash!)
6. Click **"Deploy site"**
7. Wait 2-3 minutes
8. **Your site is live!** 🎉

---

## ✅ Step 4: Test (2 minutes)

1. **Test Backend**: Open `https://rag2-backend.onrender.com/api/status`
   - Should see JSON response with `"status": "ok"`

2. **Test Frontend**: Open your Netlify URL
   - Try uploading an image
   - Try searching

---

## 🎉 Done!

Your app is now live and free!

**Important Notes**:
- ⏰ Render free tier: Backend sleeps after 15 min of inactivity (first request takes 30-60 sec)
- 💰 Both services are 100% free
- 🔄 Auto-deploys on every `git push`

---

## 🆘 Quick Troubleshooting

**Frontend can't connect to backend?**
→ Check `REACT_APP_API_URL` in Netlify environment variables (no trailing slash!)

**Backend build failing?**
→ Check Render logs, ensure Docker is selected as runtime

**First request very slow?**
→ Normal for Render free tier (cold start)

---

**Need detailed help?** See `DEPLOYMENT_GUIDE.md`
