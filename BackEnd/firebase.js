const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})


async function setCoachClaim(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, {coach: true})
    console.log(`User ${uid} is now a coach`);
  } catch (error) {
    console.log("ERROR SETTING CLAIM", error);
  }
}

module.exports = {admin, setCoachClaim}
