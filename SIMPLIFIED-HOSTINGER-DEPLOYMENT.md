# Quick Guide: Deploying to Hostinger

## 🚀 Step 1: Build Your Application
```bash
# On Replit, run the build command
npm run build
```
This creates a `dist` folder with your production-ready application.

## 📦 Step 2: Package Your Files
Create a zip file containing:
- `/dist` folder (contains compiled code)
- `/public` folder (contains static assets)
- `package.json` (for dependencies)
- `.env` file (update with production values)

## 📤 Step 3: Upload to Hostinger
1. Log in to Hostinger
2. Go to File Manager
3. Navigate to your domain's root directory
4. Upload and extract the zip file

## ⚙️ Step 4: Configure Node.js on Hostinger
1. Go to the Hostinger dashboard
2. Find Node.js Application settings
3. Configure the following:
   - **Node.js Version**: 18.x or higher
   - **Entry Point**: `dist/index.js`
   - **Environment**: Production
   - **Start Command**: `NODE_ENV=production node dist/index.js`

## 📋 Step 5: Install Dependencies and Start
In Hostinger's terminal:
```bash
npm install --production
npm start
```

## ✅ Step 6: Verify
1. Visit your domain (https://flingping.co)
2. Test all features:
   - Signup form
   - Contact form
   - Stripe checkout

## 🔄 When You Need to Update:
1. Run `npm run build` on Replit
2. Download new `dist` folder
3. Upload to Hostinger
4. Restart the Node.js application

## 🆘 Troubleshooting Common Issues:
- **404 Errors**: Check that static assets are in the correct location
- **Server Errors**: Check Hostinger's application logs
- **API Issues**: Verify environment variables are set correctly
- **Stripe Issues**: Ensure Stripe keys are production keys

---

**Important**: Make sure to set the following environment variables in Hostinger:
- `STRIPE_SECRET_KEY` (production key)
- `STRIPE_PUBLISHABLE_KEY` (production key)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `PIPEDREAM_SECURITY_TOKEN`
- `NODE_ENV=production`