const express = require("express");
const https = require("https");
const fs = require("fs");
const apiRoute = require("./api.route");

const app = express();

// ... Add your API routes and other middleware here

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use the API routes
app.use("/api", apiRoute);

// Load SSL/TLS certificate and key
const options = {
  key: fs.readFileSync("ssl/private.key"),
  cert: fs.readFileSync("ssl/certificate.crt"),
};

// Create an HTTPS server
const server = https.createServer(options, app);

// Start the server on port 443 (HTTPS default)
server.listen(443, () => {
  console.log("Server listening on port 443 (HTTPS)!");
});
