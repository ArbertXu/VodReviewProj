const express = require("express");
const router = express.Router();
const supabase = require("../database");

router.post("/vod_comments", async(req, res) => {
    const {vod_id, timestamp_seconds, comments, created_at, user_id} = req.body;
    const {data, error} = await supabase
    .from("vod_comments")
    .insert([{vod_id, timestamp_seconds, comments, created_at, user_id}])
    .select()
    .single();

    if(error) {
        console.error("error uploading comment", error)
        return res.status(500).json( {error: "SERVICE ERROR"});
    }
    res.status(201).json(data);
});

router.get("/vod_comments/:vodID", async (req, res) => {
    const { vodID } = req.params;
    const {data, error} = await supabase
    .from("vod_comments")
    .select("*")
    .eq("vod_id", vodID)
    .order("timestamp_seconds", {ascending:true})
    if (error) {
        console.error("error getting comments", error)
        return res.status(500).send("Error retrieving comments");
    }
    res.json(data);
});

module.exports = router