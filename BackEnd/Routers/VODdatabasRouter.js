
const express = require("express");
const router = express.Router();
const supabase = require("../database")
const verifyFirebaseToken = require("../Routers/authmiddleware")
const admin = require("firebase-admin")
router.get("/explore", async (req, res) => {
  const {data, error} = await supabase.from("vods").select(`*, user_data(username, profile_img_url)`);
  if (error) {
    console.error("ERROR at explore" ,error)
    return res.status(500).send("Error retrieving VODS");
  }
  
  console.log("Fetched VODs:", data)
  res.json(data);
});

router.get("/user", verifyFirebaseToken,  async(req, res) => {
  const user_id  = req.uid;
  if(!user_id) {
    return res.status(401).json({error: "LOGIN"})
  }
   const {data: userData, error: userError} = await supabase.from("user_data")
  .select("*").eq("firebase_id", user_id).single();
  
  if (userError || !userData) {
    console.error("Could not find user UUID:", userError);
    return res.status(404).json({ error: "User not found" });
  }
  console.log("UserData recieved", userData);
  res.json(userData)
})

router.get("/vods/user", verifyFirebaseToken, async(req, res) => {
  const user_id = req.uid;

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

router.post("/vods", verifyFirebaseToken, async (req, res) => {
  const { url, date_uploaded, s3_key, game } = req.body;
  const { data: userData, error: userError } = await supabase
  .from("user_data")
  .select("id")
  .eq("firebase_id", req.uid)
  .single();

  if (userError || !userData) {
    console.error("Could not find user UUID:", userError);
    return res.status(400).json({ error: "User not found" });
  }

  const uuid = userData.id;

  const {data, error } = await supabase
  .from("vods")
  .insert([{url, user_id: uuid, date_uploaded, s3_key, Game: game}])
  .select()
  .single();
  if(error) {
    console.error(error)
    return res.status(500).send("Error uploading Vod");
  }
  res.status(201).json(data);
});

router.post("/user/profile-image", verifyFirebaseToken, async (req, res) => {
  const { profile_img_url } = req.body
  console.log(req.uid)
  const { data, error } = await supabase
      .from("user_data")
      .update({ profile_img_url })
      .eq("firebase_id", req.uid)
      .select()
      .single();
  if(error) {
    console.error("Error changing pfp url:", error);
    return res.status(500).json({error: "Failed to upload image url "});
  }
  res.status(200).json(data);
})

router.put("/user/username", verifyFirebaseToken, async(req, res) => {
  const user_id = req.uid;
  try {
    const {newUserName} = req.body;

    const {data, error} = await supabase.from("user_data").update({username: newUserName})
    .eq("firebase_id", user_id)
    .select()
    .single();

    if (error) {
      console.error("Error changing username:", error);
    }
    return res.status(200).json(data)
  } catch (error) {
    console.error("Error updating:", error);
    return res.status(500).json({error: "Failed to update username"});
  }
})

router.put("/user/role", verifyFirebaseToken, async (req, res) => {
  const user_id = req.uid
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

// router.get("/getCommentLikes/:comment_id", verifyFirebaseToken, async(req,res) => {
//   const {comment_id} = req.params;
//   try {
//   const {count, error} = await supabase
//   .from("comment_likes")
//   .select('*', {count: 'exact'})
//   .eq('comment_id', comment_id);
//   if (error) {
//     console.error("Error getting likes:", error);
//     return res.status(500).json({ error: error.message });
//   }
//   return res.status(200).json({likeCount: count});
//   } catch (error) {
//     console.error("Error getting likes:", error);
//     return res.status(500).json({Error: "Error getting likes"});
//   }
// })

router.get("/user_comment_likes", verifyFirebaseToken, async(req, res) => {
  const firebase_id = req.uid;
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

  try {
    const {data, error} = await supabase
    .from("comment_likes")
    .select("comment_id")
    .eq("user_id", uuid)

    if(error) throw error;
    const likedCommentsID = data.map(item => item.comment_id);
    return res.json(likedCommentsID);
  } catch (error) {
    console.error("Error fetching liked comments.", error);
    return res.status(500).json({ error: "Failed to fetch liked comments" });
  }
})

router.post("/commentAdd/:comment_id", verifyFirebaseToken, async(req, res) => {
  const firebase_id = req.uid;
  const { comment_id } = req.params;
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
  try {
    const {data, error} = await supabase
    .from("comment_likes")
    .insert([{comment_id: comment_id, user_id: uuid}])
    if(error) {
      if(error.code === '23505') {
        await supabase
        .from("comment_likes")
        .delete()
        .eq('comment_id', comment_id)
        .eq('user_id', uuid);
      } else {
        console.error("Could not delete like:", error);
      }
    }
  } catch (error) {
    console.error("Error deleting like: ", error);
    return res.status(500).json({error: "Failed to delete or add comment."});
  }
  const {count} = await supabase
  .from("comment_likes")
  .select('*', {count: 'exact'})
  .eq('comment_id', comment_id);
  return res.status(200).json({likeCount: count});
})


module.exports = router;
