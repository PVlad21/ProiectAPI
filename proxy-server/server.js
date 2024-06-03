// Importam modulele necesare pentru server
import express from 'express'; // Express este un framework Node.js pentru crearea de servere HTTP
import fetch from 'node-fetch'; // node-fetch este un modul care oferă funcționalitate de a face cereri HTTP din Node.js
import cors from 'cors'; // cors este un middleware Express pentru gestionarea cererilor HTTP de resurse încrucișate

// Creăm o instanță de aplicație Express
const app = express();

// Definim portul pe care serverul nostru va asculta cererile
const PORT = 3001;

// Cheia API pentru Riot Games
const RIOT_API_KEY = 'RGAPI-37cbebe0-a278-4c6f-881f-97cdf4d36a23';

// Folosim middleware-ul cors pentru a permite cererile încrucișate (CORS)
app.use(cors());

// Definim ruta pentru căutarea unui jucător de League of Legends
app.get('/summoner/:gameName/:tagLine', async (req, res) => {
    // Extragem parametrii gameName și tagLine din obiectul req.params
    const { gameName, tagLine } = req.params;
    
    // Construim URL-ul pentru obținerea Riot ID-ului jucătorului
    const riotIdApiUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${RIOT_API_KEY}`;
    
    try {
        // Facem o cerere către API-ul Riot Games pentru obținerea Riot ID-ului
        const riotIdResponse = await fetch(riotIdApiUrl);
        const riotIdData = await riotIdResponse.json();
        
        // Verificăm dacă răspunsul este OK
        if (riotIdResponse.ok) {
            // Extragem PUUID-ul jucătorului din datele obținute
            const puuid = riotIdData.puuid;
            // Construim URL-ul pentru obținerea datelor despre jucător
            const summonerApiUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
            // Facem o cerere către API-ul Riot Games pentru obținerea datelor despre jucător
            const summonerResponse = await fetch(summonerApiUrl);
            const summonerData = await summonerResponse.json();
            
            // Verificăm dacă răspunsul este OK
            if (summonerResponse.ok) {
                // Construim URL-ul pentru obținerea datelor despre rangul jucătorului
                const rankApiUrl = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${RIOT_API_KEY}`;
                // Facem o cerere către API-ul Riot Games pentru obținerea datelor despre rangul jucătorului
                const rankResponse = await fetch(rankApiUrl);
                const rankData = await rankResponse.json();
                // Returnăm datele despre jucător și rangul său sub formă de JSON
                res.json({ summonerData, rankData });
            } else {
                // Returnăm eroarea în cazul în care nu am putut obține datele despre jucător
                res.status(summonerResponse.status).json(summonerData);
            }
        } else {
            // Returnăm eroarea în cazul în care nu am putut obține Riot ID-ul jucătorului
            res.status(riotIdResponse.status).json(riotIdData);
        }
    } catch (error) {
        // Returnăm o eroare internă a serverului în cazul unei excepții
        res.status(500).send('Error fetching data from Riot API');
    }
});

// Pornim serverul și ascultăm pe portul definit anterior
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
