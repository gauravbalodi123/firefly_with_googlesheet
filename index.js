// index.js
const express = require("express");
const bodyParser = require("body-parser");
const index2Router = require("./index2"); // Import the router from index2.js

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(index2Router); // Use the router from index2.js for the /fireflies-webhook route

// Optional: Define additional routes if needed
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

// Start the server on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
