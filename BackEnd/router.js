const express = require("express")
const admin = require("./firebase.js")
const router = express.Router()

router.post("/register", async (req, res) => {
    console.log(req.body)
    const {username, email, password, role} = req.body
    try {
        const user = await admin.auth().createUser({
            email,
            password,
        })
        // await admin.auth().setCustomUserClaims(user.uid, {role})
        // await admin.firestore().collection("users").doc(user.uid).set({
        //     username,
        //     email,
        //     role,
        //     createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // })
        res.status(201).json({message: "User registered", uid: user.uid})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message})
    }
})
module.exports = router