const express = require("express");
const verifyFirebaseToken = require("./authmiddleware.js");

const router = express.Router();

router.get("/protected", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "You accessed a protected route!",
    uid: req.user.uid,
    email: req.user.email,
  });
});

module.exports = router;
