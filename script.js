document.getElementById("summonerSearch").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

async function searchSummoner() {
    const gameName = document.getElementById("gameName").value.trim();
    const tagLine = document.getElementById("tagLine").value.trim();
    if (!gameName || !tagLine) return;

    const apiUrl = `http://localhost:3001/summoner/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    console.log(`Fetching data from API URL: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        displayPlayerInfo(data.summonerData, data.rankData, gameName, tagLine);
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
}

function displayPlayerInfo(summonerData, rankData, gameName, tagLine) {
    const playerInfoDiv = document.getElementById("playerInfo");

    if (summonerData.error) {
        playerInfoDiv.innerHTML = `<p>${summonerData.error}</p>`;
    } else {
        let rankInfo = "";
        let rankImage = "";
        rankData.forEach(entry => {
            if (entry.queueType === "RANKED_SOLO_5x5") {
                rankInfo = `
                    <p>Rank: ${entry.tier} ${entry.rank}</p>
                    <p>Summoner Level: ${summonerData.summonerLevel}</p>
                `;
                rankImage = `<img src="Ranked Emblems Latest/Rank=${entry.tier.toLowerCase()}.png" alt="${entry.tier} ${entry.rank}">`;
            }
        });

        playerInfoDiv.innerHTML = `
            <img src="https://ddragon.leagueoflegends.com/cdn/14.8.1/img/profileicon/${summonerData.profileIconId}.png">
            <p>Summoner Name: ${gameName}</p>
            ${rankImage}
            ${rankInfo}
        `;
    }
}
