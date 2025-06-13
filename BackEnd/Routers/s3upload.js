const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();
require("dotenv").config()
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

router.post("/get-presigned-url", async (req, res) => {
  const { filename, filetype } = req.body;

  if (!filename || !filetype) {
    return res.status(400).json({ error: "Missing filename or filetype" });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `vods/${Date.now()}-${filename}`,
    Expires: 60, // 1 minute
    ContentType: filetype,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.json({ uploadURL, key: params.Key });
  } catch (err) {
    console.error("S3 URL error:", err);
    res.status(500).json({ error: "Failed to get signed URL" });
  }
});

module.exports = router;
