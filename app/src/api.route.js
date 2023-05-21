const { Router } = require("express");
const AWS = require('aws-sdk');
const multer = require("multer");
const upload = multer({ dest: "../files/" }).single("file");
const {
  createUpload,
  getUpload,
  getUploads,
  deleteUpload,
} = require("./postgres");
const { uploadToS3, downloadFromS3 } = require("./s3");

const router = Router();

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  sessionToken: process.env.SESSION_TOKEN,
});

// Create an instance of the Amazon Cognito Identity Provider service
const cognitoIdentityProvider = new AWS.CognitoIdentityServiceProvider();

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

// Upload functionality for images. Use multer to handle the upload.
router.post("/uploads", upload, async (req, res) => {
  const { filename } = req.body;

  if (req.file) {
    const { mimetype, size } = req.file;
    let email = req.session.userEmail;

    if (!email) {
      console.log("Email value not found in session");
    }

    try {
      const { id } = await createUpload(mimetype, size, filename, email);
      await uploadToS3(req.file.path, id.toString());
      res.json({ id });
    } catch (error) {
      console.error("Error creating upload:", error);
      res.status(500).json({ error: "Error creating upload" });
    }
  } else {
    res.status(400).json({ error: "No file attached to the request" });
  }
});


router.get("/uploads", async (req, res) => {
  const uploads = await getUploads();
  res.json(uploads);
});

router.get("/uploads/:id", async (req, res) => {
  const upload = await getUpload(req.params.id);
  res.json(upload);
});

router.delete("/uploads/:id", async (req, res) => {
  await deleteUpload(req.params.id);
  res.json({ message: "ok" });
});

router.get("/file/:id", async (req, res) => {
  const upload = await getUpload(req.params.id);
  const body = await downloadFromS3(req.params.id);
  body.pipe(res);
});

router.get("/email", (req, res) => {
  const email = req.session.email;
  res.send(`Stored email: ${email}`);
});

module.exports = router;
