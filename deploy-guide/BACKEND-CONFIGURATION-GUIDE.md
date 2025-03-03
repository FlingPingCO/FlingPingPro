# FlingPing.co Backend Configuration Guide for Hostinger

This guide focuses specifically on ensuring the backend server configuration is correctly set up on Hostinger, which is essential for handling form submissions, payment processing, and webhook integrations.

## Backend Architecture Overview

The FlingPing.co backend consists of:
- Express.js server (Node.js)
- RESTful API endpoints
- Webhook receivers
- External service integrations (Stripe, Google Sheets, Systeme.io)
- In-memory data storage

## Server Configuration Requirements

### Node.js Setup
- **Version**: Use Node.js 14.x or higher
- **Memory**: Minimum 512MB RAM recommended
- **CPU**: At least 1 vCPU
- **Entry Point**: `dist/index.js`

### Port Configuration
- Default port is 5000, but can be changed via the `PORT` environment variable
- Ensure Hostinger allows the configured port to be used
- If using a reverse proxy, configure it to forward to the correct port

## Critical API Endpoints

The following API endpoints must be properly configured:

### Form Handling
```
POST /api/email-signup - Email signup form submission
POST /api/contact - Contact form submission
```

### Payment Processing
```
POST /api/create-checkout-session - Creates Stripe checkout session
GET /api/create-checkout-session - Redirects to Stripe checkout
POST /api/webhook - Receives Stripe webhooks
```

### Webhook Receivers
```
POST /webhook/systeme - Receives webhooks from Systeme.io
POST /webhook/inbound - Receives forwarded webhooks from webhook.site
```

### Data Retrieval
```
GET /api/founding-flinger-count - Gets count of founding members
GET /api/email-signups - Retrieves email signups (admin access)
GET /api/blog-posts - Retrieves blog posts
GET /api/blog-posts/:id - Retrieves specific blog post
GET /api/blog-categories - Retrieves blog categories
```

## External Service Integration Configuration

### Stripe Integration
- Ensure `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` are correctly set
- Configure webhook endpoint in Stripe Dashboard to point to `https://yourdomain.com/api/webhook`
- Test payment flow end-to-end after deployment

### Google Sheets Integration
- Verify `GOOGLE_PRIVATE_KEY`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_SPREADSHEET_ID` are correctly set
- Test direct form submission to Google Sheets
- Verify data appears in the configured spreadsheet

### Systeme.io Integration
- Configure `SYSTEME_API_KEY` and `SYSTEME_WEBHOOK_SECRET` correctly
- Set up webhook in Systeme.io to point to `https://yourdomain.com/webhook/systeme`
- Test form submission flow into Systeme.io

### webhook.site Configuration
- Ensure the webhook URL in the code is updated if needed
- Configure webhook.site to forward data to `https://yourdomain.com/webhook/inbound`
- Secure with `PIPEDREAM_SECURITY_TOKEN`

## Server Startup and Monitoring

### Starting the Server
```bash
# Production mode
NODE_ENV=production node dist/index.js
```

### Process Management
- Use Hostinger's built-in Node.js process management if available
- Alternatively, consider using PM2:
  ```bash
  npm install -g pm2
  pm2 start dist/index.js --name flingping
  ```

### Logging Configuration
- Server logs important information about requests and errors
- Configure log rotation if deploying for long-term use
- Monitor logs for error patterns after deployment

## Security Considerations

### API Security
- All API endpoints should be protected against abuse
- Form submissions should implement rate limiting
- API keys should be kept secure

### CORS Configuration
- By default, the server allows frontend requests from the same domain
- If using different domains for frontend and backend, update CORS settings

### Environment Variables
- Never expose environment variables in client-side code
- Store sensitive information only in Hostinger's environment configuration

## Performance Optimization

### Response Caching
- Consider implementing caching for frequently accessed endpoints
- Blog posts and static data can be cached to reduce database loads

### Compression
- Enable compression for API responses if not already enabled
- Hostinger may provide built-in compression options

## Troubleshooting Common Issues

### Connection Refused
- Verify the server is running on the correct port
- Check Hostinger's firewall settings

### 404 Errors on API Endpoints
- Ensure the server is correctly configured to handle API routes
- Check for path mismatches between frontend requests and backend routes

### Webhook Failures
- Verify webhook URLs are correctly configured in external services
- Check security token validation
- Review server logs for detailed error information

### Database Connection Issues
- Currently using in-memory storage, but if upgraded to a database:
  - Verify database connection strings
  - Check database permissions

## Monitoring and Maintenance

### Health Checks
- Implement a simple health check endpoint: `GET /api/health`
- Set up uptime monitoring to ping this endpoint regularly

### Backup Procedures
- Regularly backup server configuration
- If upgrading to a database, implement database backup procedures

### Scaling Considerations
- The current architecture can handle moderate traffic
- For higher traffic, consider:
  - Implementing a proper database
  - Setting up load balancing
  - Using a CDN for static assets