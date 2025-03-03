import { Client } from '@notionhq/client';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'googleapis/build/src/apis/jwt';

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
    // Create a new document
    const doc = new GoogleSpreadsheet(googleSheetsConfig.spreadsheetId);

    // Authenticate
    await doc.useServiceAccountAuth({
      client_email: googleSheetsConfig.clientEmail,
      private_key: googleSheetsConfig.privateKey,
    });

    // Load document properties and sheets
    await doc.loadInfo();

    // Get the sheet by ID (first sheet is 0)
    const sheet = doc.sheetsByIndex[googleSheetsConfig.sheetId];
    if (!sheet) {
      throw new Error(`Sheet with ID ${googleSheetsConfig.sheetId} not found`);
    }

    // Prepare the row to add
    const row = {
      Timestamp: formData.timestamp,
      Name: formData.name,
      Email: formData.email,
      Source: formData.source,
      'Form Name': formData.form_name,
      'Form ID': formData.form_id,
      'Custom Fields': JSON.stringify(formData.custom_fields || {}),
      'Raw Data': JSON.stringify(formData.raw_data || {})
    };

    // Add the row
    await sheet.addRow(row);
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
  if (!WEBHOOK_SECRET) return true;

  // Get the signature from the headers
  const signature = req.headers['x-systeme-signature'] as string;
  if (!signature) return false;

  // In a real implementation, you would validate the signature against the request body
  // This is a placeholder for that logic
  return true; // For now, we'll assume it's valid
}