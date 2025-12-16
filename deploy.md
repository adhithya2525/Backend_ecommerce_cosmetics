# Deployment Guide

## Step 1: Commit and Push to GitHub
```bash
# Check current status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add ContactController and deployment tracking v1.0.0"

# Push to GitHub
git push origin master
```

## Step 2: Verify GitHub Repository
- Visit: https://github.com/adhithya2525/Backend_ecommerce_cosmetics
- Confirm latest commit is visible
- Check that all new files are present

## Step 3: Render Deployment Configuration
1. Go to Render Dashboard
2. Find your backend service
3. Verify settings:
   - **Repository**: https://github.com/adhithya2525/Backend_ecommerce_cosmetics
   - **Branch**: master
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18 or higher

## Step 4: Force Redeploy on Render
1. In Render dashboard, go to your service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Or trigger auto-deploy by pushing to GitHub

## Step 5: Verify Deployment
After deployment, test these endpoints:
- `GET /api/health` - Shows deployment info and uptime
- `GET /api/version` - Shows current version and deployment timestamp
- `POST /api/contact` - Test new ContactController

## Environment Variables on Render
Ensure these are set:
- `MONGO_URL` - Your MongoDB connection string
- `NODE_ENV` - Set to "production"
- `PORT` - Render sets this automatically

## Troubleshooting
- Check Render logs for deployment errors
- Verify all dependencies are in package.json
- Ensure MongoDB connection string is correct
- Test endpoints after deployment