import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ],
});

export async function addToSheet(sheetTitle: string, data: Record<string, any>) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', serviceAccountAuth);
    await doc.loadInfo();
    
    // Get or create sheet
    let sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) {
      sheet = await doc.addSheet({ 
        title: sheetTitle,
        headerValues: Object.keys(data)
      });
    } else {
      // Explicitly load header row if sheet exists
      await sheet.loadHeaderRow();
      
      // Check for missing headers
      const missingHeaders = Object.keys(data).filter(
        key => !sheet.headerValues.includes(key)
      );
      
      if (missingHeaders.length > 0) {
        await sheet.setHeaderRow([...sheet.headerValues, ...missingHeaders]);
      }
    }
    
    await sheet.addRow(data);
    return true;
    
  } catch (error) {
    console.error('Google Sheets Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      data: { sheetTitle, attemptedData: data }
    });
    return false;
  }
}