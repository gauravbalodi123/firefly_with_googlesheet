const { google } = require('googleapis');
const fs = require('fs');
// const fsh = require('./credentials-google.json');
require("dotenv").config();

// Load your service account credentials
const credentials = require('./credentials-google.json'); // Replace with your JSON key file

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets API Client
async function createTableAndAddData() {
  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  // The ID of the Google Sheet you want to work with
  const spreadsheetId = process.env.spreadsheetId; // Replace with your Google Sheet ID
  console.log(spreadsheetId);

  // Add data dynamically
  const data = [
    ['Name', 'Age', 'Email'], // Header row
    ['Alice', 25, 'alice@example.com'],
    ['Bob', 30, 'bob@example.com'],
    ['Charlie', 22, 'charlie@example.com'],
    ['Char', 24, 'charlie@example.com']
  ];

  try {
    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1', // Change "Sheet1" if your sheet name is different
      valueInputOption: 'USER_ENTERED', // USER_ENTERED or RAW
      requestBody: {
        values: data,
      },
    });

    console.log('Data successfully added:', response.data);
  } catch (error) {
    console.error('Error writing to Google Sheets:', error.message);
  }
}

// Call the function
createTableAndAddData();
