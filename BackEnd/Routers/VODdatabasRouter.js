
const express = require("express");
const router = express.Router();
const supabase = require("../database")

router.get("/explore", async (req, res) => {
  const {data, error} = await supabase.from("vods").select(`*, user_data(username, profile_img_url)`);
  if (error) {
    console.error("ERROR at explore" ,error)
    return res.status(500).send("Error retrieving VODS");
  }
  
  console.log("Fetched VODs:", data)
  res.json(data);
});

router.get("/user/:user_id", async(req, res) => {
  const { user_id } = req.params;
  if(user_id == "null") {
    return res.status(400).json({error: "LOGIN"})
  }
   const {data: userData, error: userError} = await supabase.from("user_data")
  .select("*").eq("firebase_id", user_id).single();
  
  if (userError || !userData) {
    console.error("Could not find user UUID:", userError);
    return res.status(400).json({ error: "User not found" });
  }
  console.log("UserData recieved", userData);
  res.json(userData)
})

router.get("/vods/user/:user_id", async(req, res) => {
  const { user_id } = req.params;

  if (user_id == "null") {
    return res.status(400).json({error: "LOGIN"})
  }

  const {data: userData, error: userError} = await supabase.from("user_data")
  .select("id").eq("firebase_id", user_id).single();
  
  if (userError || !userData) {
    console.error("Could not find user UUID:", userError);
    return res.status(400).json({ error: "User not found" });
  }
  const uuid = userData.id;

  const { data, error } = await supabase
  .from("vods")
  .select("*")
  .eq("user_id", uuid)
  

  if(error) {
    console.error("Error", error);
    return res.status(500).send("Error getting Vods")
  }
  console.log("Vods for User", data)
  res.json(data)
})

router.get("/vods/id/:vod_id", async (req, res) => {
  const { vod_id } = req.params;

  const {data, error} = await supabase
  .from("vods")
  .select("*")
  .eq("vod_id", vod_id)
  .single()

  if(error) {
    console.error("error retrieving vod:", error);
    return res.status(500).send("Error retrieving vod");
  }
  res.json(data);
})

router.post("/vods", async (req, res) => {
  const { url, user_id: firebase_id, date_uploaded, s3_key } = req.body;
  const { data: userData, error: userError } = await supabase
  .from("user_data")
  .select("id")
  .eq("firebase_id", firebase_id)
  .single();

  if (userError || !userData) {
    console.error("Could not find user UUID:", userError);
    return res.status(400).json({ error: "User not found" });
  }

  const uuid = userData.id;

  const {data, error } = await supabase
  .from("vods")
  .insert([{url, user_id: uuid, date_uploaded, s3_key}])
  .select()
  .single();
  if(error) {
    console.error(error)
    return res.status(500).send("Error uploading Vod");
  }
  res.status(201).json(data);
});

router.post("/user/profile-image", async (req, res) => {
  const { user_id, profile_img_url} = req.body
  const { data, error } = await supabase
      .from("user_data")
      .update({ profile_img_url })
      .eq("firebase_id", user_id)
      .select()
      .single();

  if(error) {
    console.error("Error changing pfp url:", error);
    return res.status(500).json({error: "Failed to upload image url "});
  }
  res.status(200).json(data);
})

router.post("/user/:user_id/role", async (req, res) => {
  const {user_id} = req.params
  const {role} = req.body
  const {data, error} = await supabase
    .from("user_data")
    .update({role})
    .eq("firebase_id", user_id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({error: "Failed to update error"});
  }
  res.status(200).json(data);
})


module.exports = router;
