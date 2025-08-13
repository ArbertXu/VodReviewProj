const express = require("express");
const router = express.Router();
const supabase = require("../database");
const verifyFirebaseToken = require("../Routers/authmiddleware")
router.post("/vod_comments", verifyFirebaseToken, async(req, res) => {
    const {vod_id, timestamp_seconds, comments, created_at} = req.body;
    const user_id = req.uid;

    const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("id")
        .eq("firebase_id", user_id)
        .single();

        if (userError || !userData) {
            console.error("Could not find user UUID:", userError);
            return res.status(400).json({ error: "User not found" });
        }
    const uuid = userData.id;


    const {data, error} = await supabase
    .from("vod_comments")
    .insert([{vod_id, timestamp_seconds, comments, created_at, user_id: uuid}])
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
    .select(`*, user_data(username, profile_img_url)`)
    .eq("vod_id", vodID)
    .order("timestamp_seconds", {ascending:true})
    if (error) {
        console.error("error getting comments", error)
        return res.status(500).send("Error retrieving comments");
    }
    res.json(data);
});



module.exports = router