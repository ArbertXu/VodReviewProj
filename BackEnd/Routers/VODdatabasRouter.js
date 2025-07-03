
const express = require("express");
const router = express.Router();
const supabase = require("../database")

router.get("/explore", async (req, res) => {
  const {data, error} = await supabase.from("vods").select("*");
  if (error) {
    console.error("ERROR at explore" ,error)
    return res.status(500).send("Error retrieving VODS");
  }
  console.log("Fetched VODs:", data)
  res.json(data);
});

router.get("/vods/user/:user_id", async(req, res) => {
  const { user_id } = req.params;
  if (user_id == "null") {
    return res.status(400).json({error: "LOGIN"})
  }
  const { data, error } = await supabase
  .from("vods")
  .select("*")
  .eq("user_id", user_id)

  if(error) {
    console.error("Error", error);
    return res.status(500).send("Error getting Vods")
  }
  console.log("Vods for User", data)
  res.json(data)
})

router.post("/vods", async (req, res) => {
  const { url, user_id, date_uploaded, s3key } = req.body;
  const {data, error } = await superbase
  .from("vods")
  .insert([{url, user_id, date_uploaded, s3key}])
  .select()
  .single();
  if(error) {
    console.error(error)
    return res.status(500).send("Error uploading Vod");
  }
  res.status(201).json(data);
});

module.exports = router;
