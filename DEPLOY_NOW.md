# Deploy to Vercel - Quick Start

## 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 2. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Click "Add New" → "Project"
- Import your GitHub repository
- Click "Deploy"

That's it! Vercel will automatically:
- Detect the build settings from `vercel.json`
- Run `npm install`
- Run `npm run build`
- Deploy your app

## 3. Your app will be live at a URL like:
```
https://your-project-name.vercel.app
```

## Testing Locally
```bash
npm run build
npm run start
```

Then visit http://localhost:5000

## What Changed (jugaad version)
✅ Removed Socket.IO (doesn't work on Vercel)
✅ Simplified to pure HTTP APIs
✅ All endpoints are stateless
✅ Works perfectly on Vercel's serverless platform
✅ Same features, no socket overhead

## Features Still Available
- Upload CSV datasets
- Analyze AI models (CPU/Energy/FLOPs)
- View statistics & charts
- Get recommendations
- Download sample data

Just the old Socket.IO real-time progress is gone (instant analysis anyway so no big deal).
