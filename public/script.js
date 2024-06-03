document.getElementById("summonerSearch").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { // Verifică dacă tasta apăsată este Enter
        event.preventDefault(); // Previne comportamentul implicit al tastării Enter
        document.getElementById("searchButton").click(); // Simulează clicul pe butonul de căutare
    }
});

async function searchSummoner() {
    const gameName = document.getElementById("gameName").value.trim(); // Obține valoarea introdusă în câmpul pentru numele de joc
    const tagLine = document.getElementById("tagLine").value.trim(); // Obține valoarea introdusă în câmpul pentru tag-ul jucătorului
    if (!gameName || !tagLine) return; // Verifică dacă ambele câmpuri sunt completate; în caz contrar, se oprește executarea funcției

    const apiUrl = `http://localhost:3001/summoner/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`; // Construiește URL-ul pentru apelul către API
    console.log(`Fetching data from API URL: ${apiUrl}`); // Afișează în consolă URL-ul API-ului de la care se preiau datele

    try {
        const response = await fetch(apiUrl); // Se face o cerere către API-ul specificat
        if (!response.ok) { // Verifică dacă răspunsul este ok (status 200-299)
            throw new Error(`Network response was not ok: ${response.statusText}`); // Aruncă o excepție cu un mesaj specific dacă răspunsul nu este ok
        }
        const data = await response.json(); // Se transformă răspunsul în format JSON
        displayPlayerInfo(data.summonerData, data.rankData, gameName, tagLine); // Se afișează informațiile despre jucătorul găsit
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error); // Se afișează un mesaj de eroare în consolă în cazul în care apare o problemă la efectuarea cererii
    }
}

function displayPlayerInfo(summonerData, rankData, gameName, tagLine) {
    const playerInfoDiv = document.getElementById("playerInfo"); // Se obține div-ul în care se vor afișa informațiile despre jucător

    if (summonerData.error) { // Verifică dacă există o eroare în datele despre jucător
        playerInfoDiv.innerHTML = `<p>${summonerData.error}</p>`; // Afișează mesajul de eroare
    } else {
        let rankInfo = ""; // Inițializează un șir de caractere pentru informațiile despre rang
        let rankImage = ""; // Inițializează un șir de caractere pentru imaginea cu rangul

        rankData.forEach(entry => { // Parcurge toate înregistrările din datele despre rang
            if (entry.queueType === "RANKED_SOLO_5x5") { // Verifică dacă este vorba despre modul RANKED_SOLO_5x5
                rankInfo = `
                    <p>Rank: ${entry.tier} ${entry.rank}</p>
                    <p>Summoner Level: ${summonerData.summonerLevel}</p>
                `; // Construiește informațiile despre rang și nivelul jucătorului
                rankImage = `<img src="Ranked Emblems Latest/Rank=${entry.tier.toLowerCase()}.png" alt="${entry.tier} ${entry.rank}">`; // Construiește calea către imaginea cu rangul jucătorului
            }
        });

        playerInfoDiv.innerHTML = `
            <img src="https://ddragon.leagueoflegends.com/cdn/14.8.1/img/profileicon/${summonerData.profileIconId}.png">
            <p>Summoner Name: ${gameName}</p>
            ${rankImage}
            ${rankInfo}
        `; // Afișează imaginea cu profilul jucătorului, numele jucătorului, imaginea și informațiile despre rang
    }
}
