document.getElementById("summonerName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

function searchSummoner() {
    const summonerName = document.getElementById("summonerName").value.trim();
    if (!summonerName) return;

    const apiKey = "RGAPI-82121198-ef9f-4029-bc0e-f99c3afffdfa";
    const encodedSummonerName = encodeURIComponent(summonerName);
    const summonerUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummonerName}?api_key=${apiKey}`;

    fetch(summonerUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(summonerData => {
            const encryptedSummonerId = summonerData.id;
            const rankUrl = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`;

            fetch(rankUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(rankData => {
                    displayPlayerInfo(summonerData, rankData, summonerName);
                })
                .catch(error => {
                    console.error("There was a problem with your fetch operation:", error);
                });
        })
        .catch(error => {
            console.error("There was a problem with your fetch operation:", error);
        });
}

function displayPlayerInfo(summonerData, rankData, summonerName) {
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
            <p>Summoner Name: ${summonerName}</p>
            ${rankImage}
            ${rankInfo}
        `;
    }
}