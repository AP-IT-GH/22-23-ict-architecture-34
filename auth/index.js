// server/index.js
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const app = express();
const port = 3000; // Update with your desired port number

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
      // Do further processing or store the tokens as per your requirements
      console.log(tokens);
      res.send('Token exchange successful!'); // Send a response indicating success
    })
    .catch(error => {
      console.error('Token exchange failed:', error);
      res.status(500).send('Token exchange failed'); // Send an error response
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
