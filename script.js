function searchSummoner() {
    const gameName = document.getElementById("gameName").value.trim();
    const tagLine = document.getElementById("tagLine").value.trim();

    if (!gameName || !tagLine) {
        alert("Please enter both the game name and tag line.");
        return;
    }

    const apiKey = "RGAPI-64bb448c-2bb2-48b7-b525-719051712b03";
    const riotIdUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`;

    fetch(riotIdUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(riotIdData => {
            const encryptedPUUID = riotIdData.puuid;

            const summonerUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}?api_key=${apiKey}`;

            fetch(summonerUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok, status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(summonerData => {
                    const encryptedSummonerId = summonerData.id;
                    const rankUrl = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`;

                    fetch(rankUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Network response was not ok, status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(rankData => {})
                        .catch(error => {
                            console.error('There has been a problem with your fetch operation:', error);
                        });
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}