const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const apiRoute = require("./api.route");

const app = express();

// Middleware to redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.secure) {
    // If the request is already using HTTPS, no redirection is needed
    next();
  } else {
    // Redirect HTTP to HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use the API routes
app.use("/api", apiRoute);

// Load SSL/TLS certificate and key
const options = {
  key: fs.readFileSync("ssl/private.key"),
  cert: fs.readFileSync("ssl/certificate.crt"),
};

// Create an HTTP server for redirection
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Create an HTTPS server
const httpsServer = https.createServer(options, app);

// Start the HTTP server on port 80
httpServer.listen(80, () => {
  console.log("HTTP server listening on port 80!");
});

// Start the HTTPS server on port 443
httpsServer.listen(443, () => {
  console.log("HTTPS server listening on port 443!");
});