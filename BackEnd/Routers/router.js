const express = require("express")
const {admin, setCoachClaim} = require("../firebase.js")
const supabase = require("../database");
const router = express.Router()

router.post("/register", async (req, res) => {
    console.log(req.body)
    const {username, email, password, role} = req.body
    try {
        const user = await admin.auth().createUser({
            email,
            password,
        })  
        if (role == "coach") {
            await setCoachClaim(user.uid)
        }

        const {data, error} = await supabase.from("user_data")
        .insert([
            {
                firebase_id: user.uid,
                email,
                username,
                profile_img_url: "https://picsum.photos/200/200",
                role,
                created_at: new Date().toISOString(),
            }
        ]).select()
        if (error) {
            console.error("error creating user:", error);
            return res.status(500).json({error: error.message})
        }
        res.status(201).json({message: "User registered", uid: user.uid})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message})
    }
})
module.exports = router