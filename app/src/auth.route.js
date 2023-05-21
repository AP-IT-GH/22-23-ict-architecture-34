const { Router } = require("express");
const axios = require("axios");

const router = Router();

router.get('/', (req, res) => {
  // Redirect the user to the Cognito OAuth consent screen
  res.redirect(process.env.AUTH_URL);
});


router.get('/logout', (req, res) => {
  // Clear the user session or remove the user token
  delete req.session.userToken;
  delete req.session.userEmail;
  res.redirect(process.env.ROOT_URL);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange the authorization code for an access token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.CLIENT_ID);
    params.append('code', code);
    params.append('redirect_uri', process.env.REDIRECT_URL);

    const response = await axios.post(process.env.TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    req.session.userToken = response.data.access_token;

    // Use the access token to retrieve the user's email
    const userInfoResponse = await axios.get(process.env.USER_INFO_URL, {
      headers: {
        'Authorization': `Bearer ${req.session.userToken}`
      }
    });
    req.session.userEmail = userInfoResponse.data.email;

    // Redirect the user back to main page
    const redirectUrl = process.env.ROOT_URL;
    res.redirect(process.env.ROOT_URL);

  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).send('Token exchange failed');
  }
});


router.post('/userEmail', (req, res) => {
  const { email } = req.body;
  req.session.userEmail = email;
  res.sendStatus(200);
});

router.get('/userEmail', (req, res) => {
  res.send(req.session.userEmail);
});


module.exports = router;
