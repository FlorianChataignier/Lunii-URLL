import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

AWS.config.update({
  accessKeyId: process.env.LUNII_URLL_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.LUNII_URLL_AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-1'
});

// Create DynamoDB service object
export const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: 'latest' });
