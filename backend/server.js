require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const pokemonService = require('./services/pokemonService');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware'); 

const app = express();
const PORT = process.env.PORT || 5000;
const host = '::'; 

const allowedOrigins = (process.env.FRONT_ORIGINS || 
  'http://localhost:3000').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    console.error(`CORS blocked: ${origin}`);  
    return callback(new Error(`CORS error: origin ${origin} not allowed`), false);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
  optionsSuccessStatus: 204  
}));

app.use(express.json());  

app.get('/ping', (req, res) => res.status(200).send('OK'));

app.get('/liste', async (req, res) => {
  try {
    const liste = await pokemonService.getPokemonList();
    res.json(liste);
  } catch (error) {
    console.error('💥 /liste ERROR:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/pokemon', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const pokemonWithDetails = await pokemonService.getRangeOfPokemon(limit, offset);
    res.json(pokemonWithDetails);
  } catch (error) {
    console.error('💥 /pokemon ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/pokemon/:name', async (req, res) => {
  try {
    const pokemon = await pokemonService.getOnePokemon(req.params.name);
    if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(pokemon);
  } catch (error) {
    console.error('💥 /pokemon/:name ERROR:', error);
    res.status(500).json({ error: 'Pokémon non trouvé' });
  }
});

app.use('/auth', authRoutes);

app.use(authMiddleware);
app.get('/private-data', (req, res) => {
  res.json({ secret: '💎 Données sensibles' });
});

app.listen(PORT, host, () => {
  console.log(`🚀 Serveur sur http://${host}:${PORT}`);
  console.log('Allowed Origins:', allowedOrigins);
});
