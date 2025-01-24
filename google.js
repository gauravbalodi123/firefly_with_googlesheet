const { google } = require('googleapis');
const fs = require('fs');
// const { getStoredTranscript } = require("./index2");
// const fsh = require('./credentials-google.json');
require("dotenv").config();

// Load your service account credentials
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Replace with your JSON key file

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets API Client
async function createTableAndAddData(transcriptData) {
    const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

    // The ID of the Google Sheet you want to work with
    const spreadsheetId = process.env.spreadsheetId; // Replace with your Google Sheet ID
    console.log(spreadsheetId);
    // const transcriptData = getStoredTranscript();
    // Add data dynamically
    const data = [
        ['Meeting ID', 'Title', 'Organizer Email', 'Participants', 'Date', 'Overview', 'Bullet Gist', 'Short Summary'], // Header row
        [
            transcriptData.id,
            transcriptData.title,
            transcriptData.organizer_email,
            transcriptData.participants ? transcriptData.participants.join(", ") : '',  // Join participants by commas, if available
            new Date(transcriptData.date).toLocaleString(),  // Formatting date as string
            // transcriptData.speakers.name.join(", "),  
            // transcriptData.summary.keywords.join(", "),  
            transcriptData.summary.overview,  
            transcriptData.summary.bullet_gist,  
            transcriptData.summary.short_summary,  
        ]
    ];

    // const data = [
    //     ['Name', 'Age', 'Email'], // Header row
    //     ['Alice', 25, 'alice@example.com'],
    //     ['Bob', 30, 'bob@example.com'],
    //     ['Charlie', 22, 'charlie@example.com'],
    //   ];
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

module.exports = { createTableAndAddData }; // Named export


// Call the function
// createTableAndAddData();
