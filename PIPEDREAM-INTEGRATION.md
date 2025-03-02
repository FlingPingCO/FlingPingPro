# Pipedream Integration for FlingPing.co

This document outlines how to set up and use the Pipedream integration for collecting form data from the FlingPing.co website.

## Overview

FlingPing.co is set up to collect and store form data in two ways:

1. **Primary Storage**: Backend API with in-memory storage
2. **Backup Storage**: Pipedream webhook integration (currently disabled)

## Current Implementation

The website has been prepared with code to send form submissions to both:
- The built-in backend API endpoints
- A Pipedream webhook URL

Currently, the Pipedream integration is commented out in the code since the webhook URL is not yet active. This ensures the website continues to function normally while allowing for easy activation once the webhook is ready.

## Forms with Pipedream Integration

1. **Contact Form** (`ContactForm.tsx`)
   - Sends name, email, and message to the backend API
   - Sends the same data to Pipedream with an `X-Secret` header for authentication
   - Clean payload format contains just name, email, and message

2. **Email Signup Form** (`SignupForm.tsx`)
   - Sends name and email to the backend API
   - Also initiates Stripe checkout in a new tab
   - Sends just name and email to Pipedream with the same authentication

## Current Pipedream Integration

The Pipedream webhook integration is now active with the following configuration:

1. Webhook URL: `https://eod9jvlvbo6511m.m.pipedream.net` (corrected URL)
2. Authentication: Using Bearer token authentication with `"Authorization": "Bearer PIPEDREAM_SECURITY_TOKEN"`
3. Payload format: Clean JSON with just the essential form data (name, email, message)

The integration is set up in both:
- `client/src/components/ContactForm.tsx`  
- `client/src/components/SignupForm.tsx`

## How to Update Pipedream Integration

If you need to change the Pipedream webhook URL or authentication token:

1. Open the file `client/src/components/ContactForm.tsx`
2. Locate the section with `fetch("https://eod9jvlvbo6511m.m.pipedream.net", {`
3. Update the URL and/or security token as needed
4. Save the file

5. Open the file `client/src/components/SignupForm.tsx`
6. Make the same changes to this file as well

## Pipedream Webhook Setup Instructions

1. **Create a Pipedream account** at [pipedream.com](https://pipedream.com) if you don't already have one
2. **Create a new workflow**:
   - Select "HTTP / Webhook" as the trigger
   - Copy the generated webhook URL
3. **Add processing steps** to your workflow:
   - Configure your webhook trigger to check for Bearer token authentication
   - Verify that the token matches "PIPEDREAM_SECURITY_TOKEN" in your Pipedream workflow
   - Consider adding steps to save submissions to Google Sheets, send email notifications, etc.
   - You'll need to distinguish between contact form and signup form based on the presence of a message field
4. **Deploy the workflow**
5. **Update the code** in the website as described above

## Benefits of the Dual-Storage Approach

- **Data Resilience**: Even if the server restarts and in-memory data is lost, you'll have a backup in Pipedream
- **Simplified Analytics**: Pipedream can forward data to analytics platforms
- **Flexible Processing**: Easy to add email notifications, Slack alerts, or other integrations through Pipedream
- **No Single Point of Failure**: If either system experiences issues, the other can still capture submissions

## Customizing the Pipedream Integration

You can modify the data structure sent to Pipedream by editing the `body: JSON.stringify({...})` sections in each form component. This allows you to add additional metadata or transform the data before it's sent to Pipedream.

## Personalized Response Messages

The integration now shows a personalized message to users after form submission:

```
"Thank you, [name]! FlingPing.co is happy to have you join the fight for herd awareness. We'll be in touch soon."
```

While the code was initially set up to expect a specific JSON response format from Pipedream, we've now updated it to generate the personalized message client-side for greater reliability. Here's how it works:

1. The form data is sent to both your backend API and the Pipedream webhook
2. The backend API responds with a standard success message
3. After a short delay (1.5 seconds), a second toast notification appears with the personalized message
4. This personalized message uses the name from the form submission

This approach has several benefits:
- Works reliably even if Pipedream's response format changes
- Ensures users always see the personalized message
- Maintains consistent branding with the correct "FlingPing.co" capitalization
- Provides a better user experience with sequenced notifications

You can still customize the Pipedream workflow to return any response format you need for your own tracking and processing purposes.

This personalized touch enhances user experience while maintaining brand consistency.