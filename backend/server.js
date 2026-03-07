const express = require('express');
const cors = require('cors');
const pokemonService = require('./services/pokemonService');

const app = express();
const PORT = 5000;

app.use(cors());

// GET /liste
app.get('/liste', async (req, res) => {
  try {
    const liste = await pokemonService.getPokemonList();
    res.json(liste);
  } catch (error) {
    res.status(500).json({ error: 'Erreur' });
  }
});

// GET /pokemon (avec limit et offset corrects)
app.get('/pokemon', async function (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 1025;
    const offset = parseInt(req.query.offset) || 0;

    console.log(`📦 /pokemon?limit=${limit}&offset=${offset}`);

    const pokemonWithDetails = await pokemonService.getRangeOfPokemon(limit, offset);

    console.log(`✅ OK: ${pokemonWithDetails.length} pokémons`);
    res.json(pokemonWithDetails);
  } catch (error) {
    console.error('💥 Backend ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /pokemon/:name
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

// Start server
app.listen(PORT, function () {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
