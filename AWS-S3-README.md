# FlingPing.co AWS S3 Deployment

This package contains the optimized files for deploying FlingPing.co to Amazon S3 static website hosting.

## Package Contents

- `index.html` - Main HTML file
- `styles.css` - Main stylesheet
- `index.js` - Main JavaScript file
- `public/` - Directory containing assets, images, and favicon
  - `public/assets/` - SVG and other assets
  - `public/images/` - Website images
  - `public/favicon.ico` - Website favicon

## Deployment Structure

The deployment structure is designed specifically for AWS S3 static website hosting:

```
/
├── index.html
├── styles.css
├── index.js
├── public/
│   ├── assets/
│   │   └── [asset files]
│   ├── images/
│   │   └── [image files]
│   └── favicon.ico
```

## Quick Deployment Steps

1. Create an S3 bucket with static website hosting enabled
2. Upload all files maintaining the exact structure shown above
3. Set bucket permissions to allow public read access
4. Set the index document to `index.html`
5. Optionally create a CloudFront distribution for improved performance

## Content Types

Ensure the correct Content-Type headers when uploading:

- HTML files: `text/html`
- CSS files: `text/css`
- JavaScript files: `application/javascript`
- PNG images: `image/png`
- JPEG images: `image/jpeg`
- SVG files: `image/svg+xml`
- ICO files: `image/x-icon`

## Support

For detailed deployment instructions, refer to the full AWS-S3-DEPLOYMENT-GUIDE.md in the root directory of the source repository.

For technical support, please contact the FlingPing.co development team.