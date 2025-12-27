# Vercel Deployment Guide

This guide will help you deploy the AI-Neural-Architecture application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Node.js 18+**: Ensure you have a compatible Node version

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Connect Your Repository to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Select this repository
5. Click "Import"

#### Option B: Using Vercel CLI
```bash
vercel --prod
```

### 3. Configure Environment Variables

The application requires the following environment variables:

```
NODE_ENV=production
# Add any database URLs or API keys here if needed
```

**To add them:**
1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable for Production, Preview, and Development as needed

### 4. Build Configuration

The project is configured with:
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `dist`
- **Node Version**: 18.x (recommended) or higher

These are already set in `vercel.json`.

### 5. Database Setup (If using)

If you're using Neon PostgreSQL or another database:
1. Get your database connection string
2. Add it as an environment variable (e.g., `DATABASE_URL`)
3. Run migrations if needed after deployment

### 6. Verify Deployment

After deployment:
1. Visit your Vercel project URL
2. Test the upload functionality
3. Verify API endpoints are working
4. Check browser console for any errors

## Architecture on Vercel

- **Frontend**: React app built with Vite, served as static files
- **Backend**: Express API routes handled by serverless functions in the `/api` directory
- **Storage**: Use persistent storage solutions (e.g., Supabase, Neon PostgreSQL, or S3)

## Troubleshooting

### Build Fails
- Check logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct: `npm run check`

### API Routes Not Working
- Verify environment variables are set
- Check that API handlers are in the `/api` directory
- Look at Function logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` or connection strings are set as environment variables
- Check network access rules in your database provider

### File Upload Issues
- Files are limited to serverless function size limits (~50MB)
- For large uploads, consider using S3 or similar services

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/runtimes/nodejs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/serverless-functions/introduction)

## Local Testing Before Deployment

```bash
# Build the app
npm run build

# Test production build locally
npm run start
```

## Redeploying

Any push to your connected branch will automatically trigger a new deployment on Vercel.
