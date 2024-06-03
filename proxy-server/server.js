import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;
const RIOT_API_KEY = 'RGAPI-37cbebe0-a278-4c6f-881f-97cdf4d36a23';

app.use(cors());

app.get('/summoner/:gameName/:tagLine', async (req, res) => {
    const { gameName, tagLine } = req.params;
    const riotIdApiUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${RIOT_API_KEY}`;
    
    try {
        const riotIdResponse = await fetch(riotIdApiUrl);
        const riotIdData = await riotIdResponse.json();
        
        if (riotIdResponse.ok) {
            const puuid = riotIdData.puuid;
            const summonerApiUrl = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
            const summonerResponse = await fetch(summonerApiUrl);
            const summonerData = await summonerResponse.json();
            
            if (summonerResponse.ok) {
                const rankApiUrl = `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${RIOT_API_KEY}`;
                const rankResponse = await fetch(rankApiUrl);
                const rankData = await rankResponse.json();
                res.json({ summonerData, rankData });
            } else {
                res.status(summonerResponse.status).json(summonerData);
            }
        } else {
            res.status(riotIdResponse.status).json(riotIdData);
        }
    } catch (error) {
        res.status(500).send('Error fetching data from Riot API');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
