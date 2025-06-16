const express = require("express");
const router = express.Router();
const pool = require("../database");
router.get("/vods/user/:userID", async(req, res) => {
    const {userID} = req.params;
    try {
        const result = await pool.query(
            "SELECT * from vods WHERE user_id = $1", [userID]
        );
        res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).send("Failed to fetch user's VODs");
    }
});

module.exports = router;