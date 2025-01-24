// index2.js
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();
router.use(bodyParser.json());

const FIRELIES_WEBHOOK_SECRET = process.env.FIRELIES_WEBHOOK_SECRET;
const FIRELIES_API_KEY = process.env.FIRELIES_API_KEY;

const url = "https://api.fireflies.ai/graphql";
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FIRELIES_API_KEY}`,
};

// console.log("bdkjb");

let storedTranscript = {}; // Modifiable variable

// Endpoint to receive webhook
router.post("/fireflies-webhook", async (req, res) => {
    const signature = req.headers["x-hub-signature"];
    if (!signature) return res.status(400).send("Missing signature header");

    const payload = JSON.stringify(req.body);
    const hash = "sha256=" + crypto.createHmac("sha256", FIRELIES_WEBHOOK_SECRET).update(payload).digest("hex");

    if (signature !== hash) return res.status(401).send("Invalid signature");

    const { meetingId, eventType } = req.body;
    if (eventType === "Transcription completed") {
        try {
            const transcript = await waitForSummary(meetingId);
            storedTranscript = transcript;
            console.log("Updated storedTranscript:", storedTranscript);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }

    res.status(200).send("Webhook received");
});

async function fetchTranscriptData(transcriptId) {
    const data = {
        query: `query Transcript($transcriptId: String!) {
        transcript(id: $transcriptId) {
          id
          title
          organizer_email
          participants
          date
          transcript_url
          speakers {
            id
            name
          }
          user {
            user_id
            email
            name
            num_transcripts
            recent_meeting
            minutes_consumed
            is_admin
          }
          meeting_attendees {
            displayName
            email
            phoneNumber
            name
          }
          summary {
            keywords
            overview
            bullet_gist
            short_summary
            topics_discussed
          }
        }
      }`,
        variables: { transcriptId },
    };

    const response = await axios.post(url, data, { headers: headers });
    return response.data.data.transcript;
}

// Function to wait for the summary to be available
async function waitForSummary(transcriptId, interval = 10000, maxRetries = 12) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const transcript = await fetchTranscriptData(transcriptId);

            // Check that all attributes in summary have valid values
            if (
                transcript.summary &&
                Array.isArray(transcript.summary.keywords) && transcript.summary.keywords.length > 0 && // Check that keywords is a non-empty array
                typeof transcript.summary.overview === "string" && transcript.summary.overview.trim() !== "" && // Check overview is a non-empty string
                typeof transcript.summary.bullet_gist === "string" && transcript.summary.bullet_gist.trim() !== "" && // Check bullet_gist is a non-empty string
                typeof transcript.summary.short_summary === "string" && transcript.summary.short_summary.trim() !== "" // Check short_summary is a non-empty string
            ) {
                console.log("Transcript and Summary is available:");
                return transcript;
            } else {
                console.log("Summary not yet available, retrying...");
            }
        } catch (error) {
            console.error("Error fetching transcript data:", error);
        }

        // Wait for the next interval
        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("Summary did not become available within the expected time");
}

// Export the router and any other necessary function(s)
module.exports = {
    router,
    getStoredTranscript: () => storedTranscript, // Getter function to access storedTranscript
  };
