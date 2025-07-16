const express = require("express");
const AWS = require("aws-sdk");
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const router = express.Router();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({ dest: "uploads/" });

router.post("/get-upload-url", async (req,res) => {
  const {fileName, fileType} = req.body;
  const fileKey = `vods/${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Expires: 60,
    ContentType: fileType,
  };
  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    res.json({uploadURL, fileKey})
  } catch (err) {
    console.error("Error generating signed URL", err);
    res.status(500).json({error: "COULDNT generate signed URL: "});
  }
})

// router.post("/upload", upload.single("video"), async (req, res) => {
//   const { user_id } = req.body;
//   const inputPath = req.file.path;
//   const outputFilename = `compressed-${uuidv4()}.mp4`;
//   const outputPath = path.join("compressed", outputFilename);

//   try {
//     fs.mkdirSync("compressed", { recursive: true });

//     await new Promise((resolve, reject) => {
//       ffmpeg(inputPath)
//         .outputOptions(["-vcodec libx264", "-crf 28"])
//         .save(outputPath)
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     const s3Key = `vods/${outputFilename}`;
//     console.log("S3 KEY TO UPLOAD:", s3Key);
//     const fileStream = fs.createReadStream(outputPath);
//     const s3Res = await s3
//       .upload({
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: s3Key,
//         Body: fileStream,
//         ContentType: "video/mp4",
//       })
//       .promise();

//     const signedURL = await s3.getSignedUrlPromise("getObject", {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: s3Key,
//         Expires: 60 * 60 * 60,
//     })
//     res.status(201).json({
//         url: signedURL,
//         s3_key: s3Key,
//         date_uploaded: new Date().toISOString(),
//     });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).send("Error compressing or uploading VOD");
//   } finally {
//     fs.unlinkSync(inputPath);
//     if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
//   }
// });

  // router.post("/user/profile-image", upload.single("image"), async (req, res) => {
  //   const { user_id } = req.body;
  //   const inputPath = req.file.path;
  //   const fileExt = path.extname(req.file.originalname);
  //   const filename = `profile-${uuidv4()}${fileExt}`;
  //   const s3Key = `profile_images/${filename}`;

  //   try {
  //     const fileStream = fs.createReadStream(inputPath);

  //      const s3Res = await s3.upload({
  //       Bucket: process.env.S3_BUCKET_NAME,
  //       Key: s3Key,
  //       Body: fileStream,
  //       ContentType: req.file.mimetype,
  //     }).promise();

  //     const publicURL = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
  //   const { data, error } = await supabase
  //     .from("user_data")
  //     .update({ profile_img_url: publicURL })
  //     .eq("firebase_id", user_id)
  //     .select()
  //     .single();

  //   if (error) {
  //     console.error("DB update error:", error);
  //     return res.status(500).json({ error: "Failed to update user profile image" });
  //   }
  //   res.status(200).json(data);
  // } catch (err) {
  //   console.error("Image upload error:" (err));
  //   res.status(500).send("ERROR uploading pfp");
  // } finally {
  //   fs.unlinkSync(inputPath)
  // }
  // })

module.exports = router;
