const express = require("express");
const router = express.Router();
const poolComment = require("../database");

router.post("/vod_comments", async(req, res) => {
    const {vod_id, timestamp_seconds, comments, created_at} = req.body;
    try {
        const result = await poolComment.query(
            `INSERT INTO vod_comments (vod_id, timestamp_seconds, comments, created_at)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [vod_id, timestamp_seconds, comments, created_at]
        );
            res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ERROR INSERTING VALUES", err);
        res.status(500).json({error: "SERVICE ERORR"});
    }
});

router.get("/vod_comments/:vodID", async (req, res) => {
    const { vodID } = req.params;
  try {
    const result = await poolComment.query("SELECT * FROM vod_comments WHERE vod_id = $1 ORDER BY timestamp_seconds ASC", [vodID]);
    res.json(result.rows);
    console.log("Fetched COMMENTS:", result.rows);
  } catch (err) {
    console.error("ERROR",err);
    res.status(500).send("Error retrieving COMMENTS dsfdnoasdf");
  }
});

module.exports = router