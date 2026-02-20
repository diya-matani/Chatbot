# 🚀 Quick Deployment Guide

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel (Easiest - Recommended)

### Option A: Via GitHub (Recommended)
1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variable: `OPENAI_API_KEY` = your API key
   - Click "Deploy"
   - Done! Your app will be live in ~2 minutes

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow the prompts and add your `OPENAI_API_KEY` when asked.

---

## 🌐 Deploy to Netlify

### Via GitHub:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable: `OPENAI_API_KEY`
7. Deploy!

---

## 🌐 Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `OPENAI_API_KEY`
5. Railway auto-detects Next.js and deploys automatically

---

## 🌐 Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variable: `OPENAI_API_KEY`
6. Click "Create Web Service"

---

## ✅ Post-Deployment Checklist

- [ ] Test chatbot opens correctly
- [ ] Test Parent flow (complete conversation)
- [ ] Test School flow (complete conversation)
- [ ] Verify OpenAI API responses work
- [ ] Test on mobile device
- [ ] Check browser console for errors
- [ ] Verify analytics tracking

---

## 🔑 Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key (get from [platform.openai.com](https://platform.openai.com))

**Optional:**
- `NEXT_PUBLIC_APP_URL` - Your production URL (for analytics)

---

## 📝 Notes

- The chatbot will work without `OPENAI_API_KEY` but AI responses won't function
- Leads are stored in browser localStorage (for demo)
- In production, integrate with your CRM/database
- Analytics events are logged to console and localStorage

---

## 🆘 Troubleshooting

**Build fails:**
- Make sure `.next` folder is deleted: `rm -rf .next` (or `rmdir /s /q .next` on Windows)
- Run `npm install` again
- Check Node.js version (requires Node 18+)

**API errors:**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits/quota
- Review error logs in hosting platform

**OneDrive sync issues:**
- Consider excluding `.next` folder from OneDrive sync
- Or move project outside OneDrive folder
