require('dotenv').config();  
const express = require('express');
const cors = require('cors');
const pokemonService = require('./services/pokemonService');
const authRoutes = require('./routes/auth');  

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://pokemon-compedium.vercel.app',
    'http://localhost:3000' 
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(express.json()); 

app.use('/auth', authRoutes); 

app.get('/liste', async (req, res) => {
  try {
    const liste = await pokemonService.getPokemonList();
    res.json(liste);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

app.get('/pokemon', async function (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 1025;
    const offset = parseInt(req.query.offset) || 0;

    const pokemonWithDetails = await pokemonService.getRangeOfPokemon(limit, offset);

    res.json(pokemonWithDetails);
  } catch (error) {
    console.error('💥 Backend ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/pokemon/:name', async function (req, res) {
  try {
    const pokemonName = req.params.name;
    const pokemon = await pokemonService.getOnePokemon(pokemonName);
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }
    res.json(pokemon);
  } catch (error) {
    console.error('💥 /pokemon/:name ERROR:', error);
    res.status(500).json({ error: 'Pokémon non trouvé' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
