import { Client } from '@notionhq/client';
import { google } from 'googleapis';

// ======= Google Sheets Integration =======

interface GoogleSheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  sheetId: number;
}

// If you wish to use service account authentication
const googleSheetsConfig: GoogleSheetsConfig = {
  clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
  sheetId: parseInt(process.env.GOOGLE_SHEET_ID || '0', 10)
};

export async function sendToGoogleSheets(formData: any): Promise<boolean> {
  // If not configured, skip
  if (!googleSheetsConfig.clientEmail || !googleSheetsConfig.privateKey || !googleSheetsConfig.spreadsheetId) {
    console.log('Google Sheets integration not configured, skipping');
    return false;
  }

  try {
    // Use the Google Sheets API directly
    const auth = new google.auth.JWT({
      email: googleSheetsConfig.clientEmail,
      key: googleSheetsConfig.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Format data for insertion
    const values = [
      [
        formData.timestamp,
        formData.name,
        formData.email,
        formData.source,
        formData.form_name || '',
        formData.form_id || '',
        JSON.stringify(formData.custom_fields || {}),
        JSON.stringify(formData.raw_data || {}).substring(0, 50000) // Avoid exceeding cell size limits
      ]
    ];
    
    // Append the data
    await sheets.spreadsheets.values.append({
      spreadsheetId: googleSheetsConfig.spreadsheetId,
      range: `Sheet${googleSheetsConfig.sheetId + 1}!A:H`, // Sheets are 1-indexed in the API
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });
    
    console.log(`Added row to Google Sheets for ${formData.email}`);
    return true;
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    return false;
  }
}

// ======= Notion Integration =======

interface NotionConfig {
  apiKey: string;
  databaseId: string;
}

const notionConfig: NotionConfig = {
  apiKey: process.env.NOTION_API_KEY || '',
  databaseId: process.env.NOTION_DATABASE_ID || ''
};

export async function sendToNotion(formData: any): Promise<boolean> {
  // If not configured, skip
  if (!notionConfig.apiKey || !notionConfig.databaseId) {
    console.log('Notion integration not configured, skipping');
    return false;
  }

  try {
    // Initialize Notion client
    const notion = new Client({
      auth: notionConfig.apiKey
    });

    // Create a new page in the database
    await notion.pages.create({
      parent: {
        database_id: notionConfig.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: formData.name || 'Unknown'
              }
            }
          ]
        },
        Email: {
          rich_text: [
            {
              text: {
                content: formData.email || 'Unknown'
              }
            }
          ]
        },
        Source: {
          select: {
            name: formData.source || 'Unknown'
          }
        },
        'Form Name': {
          rich_text: [
            {
              text: {
                content: formData.form_name || 'Unknown'
              }
            }
          ]
        },
        'Submitted At': {
          date: {
            start: formData.timestamp || new Date().toISOString()
          }
        },
        'Custom Fields': {
          rich_text: [
            {
              text: {
                content: JSON.stringify(formData.custom_fields || {}).substring(0, 2000) // Notion has character limits
              }
            }
          ]
        }
      }
    });

    console.log(`Added entry to Notion for ${formData.email}`);
    return true;
  } catch (error) {
    console.error('Error sending data to Notion:', error);
    return false;
  }
}

// ======= Webhook Security =======

const WEBHOOK_SECRET = process.env.SYSTEME_WEBHOOK_SECRET || '';

export function validateWebhookRequest(req: any): boolean {
  // If no secret is configured, skip validation (not recommended for production)
  if (!WEBHOOK_SECRET) {
    console.warn('WARNING: No SYSTEME_WEBHOOK_SECRET configured. Webhook validation is disabled.');
    return true;
  }

  // Get the secret from the headers
  const headerSecret = req.headers['x-webhook-secret'] as string;
  if (!headerSecret) {
    console.error('Webhook request rejected: Missing X-Webhook-Secret header');
    return false;
  }

  // Compare the received secret with the expected secret
  const isValid = headerSecret === WEBHOOK_SECRET;
  
  if (!isValid) {
    console.error('Webhook request rejected: Invalid X-Webhook-Secret');
  }
  
  return isValid;
}