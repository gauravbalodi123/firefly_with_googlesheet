const express = require("express");
const bodyParser = require("body-parser");
const { router, getStoredTranscript } = require("./index2"); // Import the router and the getter function

const app = express();

// Middleware
app.use(bodyParser.json());

// Use the router from index2.js for the /fireflies-webhook route
app.use(router); // This applies the routes from index2.js to the main app
console.log("test bdskjb")
// Endpoint to get stored transcript data

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

app.get("/get-transcript", (req, res) => {
    const transcript = getStoredTranscript(); // Access storedTranscript using the getter function
    res.json(transcript); // Return the stored transcript as a response
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
