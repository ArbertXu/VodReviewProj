
const express = require("express");
const router = express.Router();
const pool = require("../database");

router.get("/vods", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vods");
    res.json(result.rows);
    console.log("Fetched VODs:", result.rows);
  } catch (err) {
    console.error("ERROR",err);
    res.status(500).send("Error retrieving VODs dsfdnoasdf");
  }
});

router.post("/vods", async (req, res) => {
  const { url, user_id, date_uploaded, s3key } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO vods VALUES ($1, $2, $3, $4) RETURNING *",
      [url, user_id, date_uploaded, s3key]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading VOD");
  }
});

module.exports = router;
