const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());
const express = require('express');
const session = require('express-session');
const https = require('https');
const http = require('http');
const fs = require('fs');
const AWS = require('aws-sdk');

const apiRoute = require('./api.route');
const authRoutes = require('./auth.route');

const app = express();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);


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
app.use(express.static('public'));


// Use the AUTH routes
app.use('/auth', authRoutes);
// Use the API routes
app.use('/api', apiRoute);

// Load SSL/TLS certificate and key
const options = {
  key: fs.readFileSync('ssl/private.key'),
  cert: fs.readFileSync('ssl/certificate.crt'),
  ca: fs.readFileSync('ssl/ca_bundle.crt')
};

// Create an HTTP server for redirection
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

// Create an HTTPS server
const httpsServer = https.createServer(options, app);

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  sessionToken: process.env.SESSION_TOKEN,
});

// Create an instance of the Amazon Cognito Identity Provider service
const cognitoIdentityProvider = new AWS.CognitoIdentityServiceProvider();

// Specify the user pool ID and user pool client ID
const userPoolId = 'us-east-1_0Od5IEFk6';

// Define a function to retrieve the user's email address
async function getUserEmail(accessToken) {
  const params = {
    AccessToken: accessToken
  };

  try {
    const response = await cognitoIdentityProvider.getUser(params).promise();
    const email = response.UserAttributes.find(attr => attr.Name === 'email').Value;
    return email;
  } catch (error) {
    console.error('Error retrieving user email:', error);
    throw error;
  }
}

// Start the HTTP server on port 80
httpServer.listen(80, () => {
  console.log('HTTP server listening on port 80!');
});

// Start the HTTPS server on port 443
httpsServer.listen(443, () => {
  console.log('HTTPS server listening on port 443!');
});
