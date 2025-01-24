const express = require("express");
const bodyParser = require("body-parser");
const { router, getStoredTranscript } = require("./index2"); // Import the router and the getter function
const { createTableAndAddData } = require('./google');

const app = express();

// Middleware
app.use(bodyParser.json());

// Use the router from index2.js for the /fireflies-webhook route
app.use(router); // This applies the routes from index2.js to the main app
// app.use(createTableAndAddData);
console.log("test bdskjb")
// Endpoint to get stored transcript data

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

app.get("/get-transcript", (req, res) => {
    const transcript = getStoredTranscript(); // Access storedTranscript using the getter function
    res.json(transcript); // Return the stored transcript as a response
});

app.get("/create-table", async (req, res) => {
    try {
        await createTableAndAddData(); // Ensure it's completed before sending a response
        res.status(200).send("Table created and data added successfully!");
    } catch (error) {
        console.error("Error creating table and adding data:", error);
        res.status(500).send("Failed to create table and add data");
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
