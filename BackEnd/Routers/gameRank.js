const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("./authmiddleware.js");
const { canBeCoach } = require("../rankHelper")
const supabase = require("../database")
const RIOT_API_KEY = process.env.TEMP_RIOT_KEY;
const fetch = require("node-fetch");

async function getLeagueRank(riotID, tagLine) {
    const res = await fetch(`https://na1.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${riotID}/${tagLine}`, {
        headers: {"X-Riot-Token": process.env.RIOT_API_KEY}
    })
    const accountData = await res.json();
    const puuid = accountData.puuid;
    const rankRes = await fetch(`https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`, {
        headers: {"X-Riot-Token": process.env.RIOT_API_KEY}
    })
    const rankData = await rankRes.json();
    const soloQueue = rankData.find(entry => entry.queueType === "RANKED_SOLO_5x5");
    return soloQueue ? `${soloQueue.tier} ${soloQueue.rank}` : 0;   
}

async function getDotaRank(account) {
    const res = await fetch(`https://api.opendota.com/api/players/${account}`)
    const data = await res.json();
    return data.rank_tier || 0;
}

async function getValorantRank(riotID, tagLine) {
    const res = await fetch(`https://api.kyroskoh.xyz/valorant/v1/mmr/na/${riotID}/${tagLine}`)
    const data = await res.text();
    const rank = data.split(" ")[0]
    return rank || 0;
}




router.post("/apply-coach", verifyFirebaseToken, async(req, res) => {
    const user_id = req.uid;
    const {game} = req.body;
    let rank;
    try {
        if (game === "lol") {
            const {riotID, tagLine} = req.body;
            if (!riotID || !tagLine) return res.status(400).json({error: "Missing riot ID or tagline"});
            rank = await getLeagueRank(riotID, tagLine);
        }
        else if (game === "valorant") {
            const {riotID, tagLine} = req.body;
            if (!riotID || !tagLine) return res.status(400).json({error: "Missing riot ID or tagline"});
            rank = await getValorantRank(riotID, tagLine);
        }
        else if (game === "dota2") {
            const {account} = req.body;
            if (!account) return res.status(400).json({error: "Missing account number"});
             rank = await getDotaRank(account)
        }
        else return res.status(400).json({error: "unsupported game"});
        const eligible = canBeCoach(rank, game);
        const {data: userData, error: userError} = await supabase.from("user_data")
        .update({
            [`${game}_rank`]: rank,
            [`is_${game}_coach`]: eligible,
        })
        .eq("firebase_id", user_id)
        .select();
        if (userError) throw error;
        res.json({rank, eligible, updatedUser: userData[0]});
    } catch (err) {
        console.error(err)
        res.status(500).json({error: "Failed to submit rank."});
    }
})


module.exports = router