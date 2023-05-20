
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const session = require('express-session');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const app = express();
const port = 3000; // Update with your desired port number

// Load environment variables
dotenvExpand.expand(dotenv.config());

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with your session secret
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  // Retrieve the authorization code from the query parameters
  const code = req.query.code;

  // Perform the token exchange
  axios.post(process.env.AXIOS_POST, qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URL,
    code: code
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(response => {
      // Handle the token exchange response
      const tokens = response.data;
      console.log(tokens); // Log the tokens object to inspect its structure

      // Store the email in the session for later use
      req.session.email = tokens.email || tokens.email_verified; // Use the appropriate property name

      res.send('Token exchange successful!'); // Send a response indicating success
    })
    .catch(error => {
      console.error('Token exchange failed:', error);
      res.status(500).send('Token exchange failed'); // Send an error response
    });
});

app.get('/uploads', (req, res) => {
  // Access the email stored in the session
  const email = req.session.email;

  // Use the email for further processing or retrieve data for that user

  res.send(`Email: ${email}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});