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
   - Ready to send the same data to Pipedream with an added `form_type: "contact_message"` identifier

2. **Email Signup Form** (`SignupForm.tsx`)
   - Sends name and email to the backend API
   - Also initiates Stripe checkout in a new tab
   - Ready to send name and email to Pipedream with an added `form_type: "email_signup"` identifier

## How to Enable Pipedream Integration

Once your Pipedream webhook is properly deployed:

1. Open the file `client/src/components/ContactForm.tsx`
2. Locate the commented section that begins with `/* Once your Pipedream webhook is properly deployed...`
3. Uncomment this section
4. Replace `"YOUR_PIPEDREAM_WEBHOOK_URL"` with your actual Pipedream webhook URL
5. Save the file

6. Open the file `client/src/components/SignupForm.tsx`
7. Repeat steps 2-5 for this file as well

## Pipedream Webhook Setup Instructions

1. **Create a Pipedream account** at [pipedream.com](https://pipedream.com) if you don't already have one
2. **Create a new workflow**:
   - Select "HTTP / Webhook" as the trigger
   - Copy the generated webhook URL
3. **Add processing steps** to your workflow:
   - You can add steps to handle different form types based on the `form_type` field
   - Consider adding steps to save submissions to Google Sheets, send email notifications, etc.
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

The integration now expects a specific response format from Pipedream:

```json
{
  "status": "success",
  "message": "Thank you, [name]! FlingPing.co is happy to have you join the fight for herd awareness. We'll be in touch soon."
}
```

The code is set up to display this message as a toast notification to provide a personalized experience to users. In your Pipedream workflow, you should:

1. Format the response with the user's name using string interpolation
2. Return this JSON structure as the HTTP response from your Pipedream workflow
3. Ensure the message includes proper branding ("FlingPing.co" with the correct capitalization)

Example Pipedream code to format the response:

```javascript
// In your Pipedream workflow response step
const name = steps.trigger.event.body.name || "there";
return {
  status: "success",
  message: `Thank you, ${name}! FlingPing.co is happy to have you join the fight for herd awareness. We'll be in touch soon.`
};
```

This personalized touch enhances user experience while maintaining brand consistency.