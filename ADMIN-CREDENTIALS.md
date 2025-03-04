# FlingPing.co Admin Credentials

**IMPORTANT: CONFIDENTIAL INFORMATION**
This document contains sensitive access credentials. Keep it secure and do not share publicly.

## Admin Dashboard Access

The admin dashboard is accessible at:
- **Production URL**: https://your-domain.com/admin (after deployment)
- **Development URL**: http://localhost:5000/admin (during development)

## Default Credentials

The default admin login credentials are:

- **Username**: admin
- **Password**: flingping

## Security Recommendations

1. **Change Default Credentials**: 
   - It's strongly recommended to change these default credentials immediately after deployment
   - You can update them by setting the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables

2. **Environment Variables**:
   To set custom admin credentials, update your environment variables:
   ```
   ADMIN_USERNAME=your_custom_username
   ADMIN_PASSWORD=your_secure_password
   ```

3. **Password Guidelines**:
   - Use a strong password (minimum 12 characters)
   - Include uppercase letters, lowercase letters, numbers, and special characters
   - Do not reuse passwords from other services
   - Change the password periodically

4. **Access Control**:
   - Limit admin access to authorized personnel only
   - Use a separate admin account for each person who needs access
   - Implement IP restrictions if possible
   - Consider using two-factor authentication in future versions

## For AWS Deployment

When deploying to AWS, store these credentials securely:

1. **AWS Secrets Manager**: 
   - Store sensitive credentials in AWS Secrets Manager
   - Reference them in your environment configuration

2. **Environment Variables**:
   - Set the environment variables in your deployment configuration
   - For S3 static website hosting with CloudFront and Lambda@Edge, set the variables in your Lambda function configuration

## Support

If you need assistance with admin access or have lost your credentials, please contact:
- [Your support email address]
- [Your phone number]