# Deployment Guide

This project is configured for automatic deployment to Cloudflare Pages with GitHub integration.

## Overview

- **Main Website**: Static HTML/CSS/JS files in root directory
- **Dashboard**: React app built from `Dashboard/` folder, deployed to `/dashboard` path
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## Automatic Deployment

### Option 1: Cloudflare Pages Direct Integration (Recommended)

1. **Connect Repository to Cloudflare Pages**:

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your `ahfywebsite` repository
   - Configure build settings:
     - **Production branch**: `main`
     - **Build command**: `bash cloudflare-build.sh`
     - **Build output directory**: `deploy`
     - **Root directory**: `/` (leave empty)

2. **Cloudflare will automatically**:
   - Detect pushes to your repository
   - Run the build script
   - Build the Dashboard React app
   - Deploy everything to your domain

### Option 2: GitHub Actions with Cloudflare

If you prefer GitHub Actions to handle the build:

1. **Add Secrets to GitHub**:

   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **GitHub Actions will**:
   - Trigger on every push to `main` branch
   - Build the Dashboard automatically
   - Deploy to Cloudflare Pages

## Manual Deployment

To build and deploy manually:

```bash
# Build Dashboard
cd Dashboard
npm install
npm run build
cd ..

# The built files will be in dashboard-app/
# Deploy root files + dashboard-app/ to your hosting
```

## Build Process

The automated build does the following:

1. Installs Dashboard dependencies (`npm ci` in Dashboard folder)
2. Builds Dashboard React app (`npm run build`)
3. Copies main website files (HTML, CSS, JS)
4. Copies Dashboard build output to `/dashboard` path
5. Deploys everything to Cloudflare Pages

## File Structure After Build

```
deploy/
├── index.html              # Main website
├── about-us.html
├── pricing.html
├── ...other HTML files
├── css/                    # Website styles
├── js/                     # Website scripts
├── assets/                 # Website assets
└── dashboard/              # Built Dashboard app
    ├── index.html
    ├── assets/
    └── ...other built files
```

## URLs

- Main Website: `https://yourdomain.com/`
- Dashboard: `https://yourdomain.com/dashboard/`

## Troubleshooting

### Build Fails

- Check that `Dashboard/package.json` exists
- Verify all dependencies are listed
- Check build logs in Cloudflare Pages dashboard

### Dashboard Not Loading

- Verify `dashboard-app/` folder contains built files
- Check that Cloudflare deployed the `/dashboard` subdirectory
- Inspect browser console for errors

### Changes Not Deploying

- Ensure you pushed to the correct branch (`main`)
- Check Cloudflare Pages deployment logs
- Verify GitHub Actions workflow completed successfully

## Environment Variables

If your Dashboard needs environment variables:

1. In Cloudflare Pages → Settings → Environment variables
2. Add variables like:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. These will be available during build time

## Notes

- The build script excludes `node_modules/` and `dist/` (already in `.gitignore`)
- Dashboard source code is in `Dashboard/` folder
- Built Dashboard output goes to `dashboard-app/` (git-ignored)
- Only push source code, not built files
