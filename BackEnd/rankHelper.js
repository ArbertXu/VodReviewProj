const lolRankMap = {
    "Iron": 1, "Bronze": 2, "Silver": 3, "Gold": 4, "Platinum": 5, "Emerald": 6, "Diamond": 7, "Master": 8, "Grand Master": 9, "Challenger": 10
}

const valorantRankMap = {
    "Iron": 1, "Bronze": 2, "Silver": 3, "Gold": 4, "Platinum": 5, "Diamond": 6, "Ascendant": 7, "Immortal": 8, "Radiant": 9
}

const dotaRankMap = {
    0: 0,
    1: 1,
    2: 2,
    3: 3, 
    4: 4, 
    5: 5, 
    6: 6, 
    7: 7, 
    8: 8
}

const minCoachRank = {
    lol: 7,
    valorant: 6,
    dota2: 6
}

function normalizeDota(rank) {
    if (!rank) return 0;
    return Math.floor(rank / 10)
}

function canBeCoach(rank, game) {
    let rankValue;
    switch(game) {
        case "lol":
            rankValue = lolRankMap[rank] || 0;
            break;
        case "valorant":
            rankValue = valorantRankMap[rank] || 0;
            break;
        case "dota2":
            rankValue = dotaRankMap[normalizeDota(rank)] || 0;
            break;
        default:
            rankValue = 0;
    }
    return rankValue >= minCoachRank[game]
}



module.exports = {canBeCoach}