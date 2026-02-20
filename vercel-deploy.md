# 🚀 Deploy to Vercel - Step by Step Guide

## Method 1: Using Vercel CLI (Quick)

### Step 1: Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate with Vercel.

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No (first time)
- **What's your project's name?** → `wizklub-chatbot` (or your choice)
- **In which directory is your code located?** → `./` (current directory)
- **Want to override settings?** → No

### Step 4: Add Environment Variable
After deployment, add your OpenAI API key:
```bash
vercel env add OPENAI_API_KEY
```
Enter your OpenAI API key when prompted.

### Step 5: Redeploy with Environment Variable
```bash
vercel --prod
```

---

## Method 2: Via Vercel Dashboard (Easier - Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**

### Step 3: Import Repository
1. Select your GitHub repository (`Chatbot`)
2. Click **"Import"**

### Step 4: Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 5: Add Environment Variables
Click **"Environment Variables"** and add:
- **Name:** `OPENAI_API_KEY`
- **Value:** Your OpenAI API key
- **Environment:** Production, Preview, Development (select all)

### Step 6: Deploy
Click **"Deploy"** button

### Step 7: Wait for Deployment
- Build will start automatically
- Takes 2-3 minutes
- You'll get a live URL like: `https://wizklub-chatbot.vercel.app`

---

## ✅ Post-Deployment Checklist

- [ ] Visit your live URL
- [ ] Test chatbot opens correctly
- [ ] Test Parent flow
- [ ] Test School flow
- [ ] Verify OpenAI API responses work
- [ ] Test on mobile device
- [ ] Check browser console for errors

---

## 🔧 Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

**API not working:**
- Verify `OPENAI_API_KEY` is set in Vercel dashboard
- Check environment variable is set for all environments
- Review function logs in Vercel dashboard

**Domain issues:**
- Vercel provides a free `.vercel.app` domain
- You can add custom domain in Project Settings → Domains

---

## 📝 Notes

- First deployment is free
- Automatic deployments on every git push (if connected to GitHub)
- Preview deployments for pull requests
- Free tier includes generous limits

---

## 🎉 You're Done!

Your chatbot is now live! Share the URL with your team.
