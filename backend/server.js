const express = require('express');
const cors = require('cors');
const pokemonService = require('./services/pokemonService')

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/liste', async (req, res) => {
    try {
        const liste = await pokemonService.getPokemonList()
        res.json(liste)
    } catch (error) {
        res.status(500).json({ error: 'Erreur' })
    }
})

app.get('/pokemon', async function(req, res){
  try{
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0
    
    const pokemonWithDetails = await pokemonService.getAllPokemonWithDetails(limit, offset)
    res.json(pokemonWithDetails)
  } catch (error){
     res.status(500).json({ error: 'Erreur' })
  }
})

app.get('/pokemon/:name', async function(req, res){
  try{
    const pokemonName = req.params.name
    const pokemon = await pokemonService.getOnePokemon(pokemonName)
    res.json(pokemon)
  } catch (error) {
    res.status(500).json({ error : 'Pokémon non trouvé' })
  }
})

app.listen(PORT, function(){
  console.log(`Serveur démarré sur le port ${PORT}`)
})