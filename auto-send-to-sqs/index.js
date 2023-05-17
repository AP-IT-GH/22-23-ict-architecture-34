const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  sessionToken: process.env.SESSION_TOKEN,
});

exports.handler = async (event) => {
  try {
    // Get the object key of the S3 file that triggered the Lambda function
    const objectKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    console.log("the key of the object is: " + objectKey);
    const message = {
      objectKey: objectKey,
      sizes: "large,640x360",
      quality: 85,
    };

    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: process.env.SQS_URL,
    };


    console.log(message);
    await sqs.sendMessage(params).promise();

    const response = {
      statusCode: 200,
      body: "Message sent successfully",
    };
    return response;
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};