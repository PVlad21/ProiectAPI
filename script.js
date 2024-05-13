function searchSummoner() {
    const gameName = document.getElementById("gameName").value.trim();
    const tagLine = document.getElementById("tagLine").value.trim();

    if (!gameName || !tagLine) {
        alert("Please enter both the game name and tag line.");
        return;
    }

    const apiKey = "RGAPI-64bb448c-2bb2-48b7-b525-719051712b03";

    // Step 1: Obtain PUUID from Riot ID
    const riotIdUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`;

    fetch(riotIdUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(riotIdData => {
            const encryptedPUUID = riotIdData.puuid;

            // Step 2: Obtain summoner data by PUUID
            const summonerUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}?api_key=${apiKey}`;

            fetch(summonerUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(summonerData => {
                    const encryptedSummonerId = summonerData.id;

                    // Step 3: Obtain rank data by summoner ID
                    const rankUrl = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`;

                    fetch(rankUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then(rankData => {
                            displayPlayerInfo(summonerData, rankData, gameName, tagLine);
                        })
                        .catch(error => {
                            console.error("There was a problem with your fetch operation:", error);
                        });
                })
                .catch(error => {
                    console.error("There was a problem with your fetch operation:", error);
                });
        })
        .catch(error => {
            console.error("There was a problem with your fetch operation:", error);
        });
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
            <p>Summoner Name: ${gameName}#${tagLine}</p>
            ${rankImage}
            ${rankInfo}
        `;
    }
}
