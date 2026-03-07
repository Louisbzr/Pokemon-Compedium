const fetch = require('node-fetch');

// Cache pour éviter les refetchs
const pokemonCache = new Map();

function extractChainIds(chain) {
  const id = parseInt(chain.species.url.split('/').filter(Boolean).pop());
  const ids = [id];
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    chain.evolves_to.forEach(next => {
      ids.push(...extractChainIds(next));
    });
  }
  return ids;
}


async function getPokemonSpecies(id) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    return {
      color: data.color.name,
      generation: data.generation.name,
      names: data.names,
      evolutionChainUrl: data.evolution_chain.url,
      isLegendary: data.is_legendary,
      isMythical: data.is_mythical,
      evolutionChainId: parseInt(
        data.evolution_chain.url.split('/').filter(Boolean).pop()
      ),
      shape: data.shape?.name || null,
      isBaby: data.is_baby || false,
      evolvesFromSpeciesUrl: data.evolves_from_species?.url || null,
      habitat: data.habitat?.name || null,
    };
  } catch (error) {
    return {
      color: 'unknown',
      generation: 'unknown',
      names: [],
      evolutionChainUrl: null,
    };
  }
}

async function getEvolutionStage(isBaby, evolvesFromSpeciesUrl) {
  if (isBaby) return 0; // Bébé (Pichu, Togepi...)
  if (!evolvesFromSpeciesUrl) return 1; // Forme de base (pas de pré-évolution)

  // A un parent → récupère le parent pour savoir s'il a lui-même un parent
  const parentId = parseInt(evolvesFromSpeciesUrl.split('/').filter(Boolean).pop());
  const parentSpecies = await getPokemonSpecies(parentId);

  if (!parentSpecies.evolvesFromSpeciesUrl) {
    // Parent = base ou bébé → moi je suis stage 2
    return 2;
  } else {
    // Parent a lui-même un parent → je suis stage 3
    return 3;
  }
}

async function getOnePokemon(id) {
  // Cache check
  if (pokemonCache.has(id)) return pokemonCache.get(id);

  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    const species = await getPokemonSpecies(data.id);

    const evolutionStage = await getEvolutionStage(
      species.isBaby,
      species.evolvesFromSpeciesUrl
    );

    const totalStats = data.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    const pokemon = {
      name: data.name,
      id: data.id,
      sprite: data.sprites.front_default,
      types: data.types,
      stats: data.stats,
      totalStats,
      color: species.color,
      generation: species.generation,
      names: species.names,
      height: data.height,
      weight: data.weight,
      evolutionChainId: species.evolutionChainId,
      evolutions: [],
      isLegendary: species.isLegendary,
      isMythical: species.isMythical,
      shape: species.shape,
      evolutionStage,
      habitat: species.habitat,
    };

    pokemonCache.set(id, pokemon);
    return pokemon;
  } catch (error) {
    console.error(`❌ Pokémon ${id} failed:`, error.message);
    return null;
  }
}

async function getPokemonList(limit = 20, offset = 0) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function getAllPokemonWithDetails(limit = 1025, offset = 0) {
  try {
    const pokemons = [];
    
    // Force fetch ID 1 à 1025
    const promises = [];
    for (let id = 1; id <= 1025; id++) {
      promises.push(getOnePokemon(id));
    }
    
    console.log('🚀 Fetching 1025 Pokémon by ID...');
    const results = await Promise.all(promises);
    
    // Filtre les null (Gen 9 manquants)
    const validPokemons = results.filter(p => p !== null);
    
    console.log(`✅ Loaded ${validPokemons.length}/1025 Pokémon`);
    return validPokemons;
  } catch (error) {
    console.error('pokemonService ERROR:', error);
    return [];
  }
}

async function getRangeOfPokemon(limit = 1025, offset = 0) {
  const pokemons = [];
  const promises = [];

  // Limite l'intervalle 1 → 1025
  const start = Math.max(1, offset + 1);
  const end = Math.min(1025, offset + limit);

  for (let id = start; id <= end; id++) {
    promises.push(getOnePokemon(id));
  }

  console.log(`📦 Fetching IDs ${start} → ${end}`);
  const results = await Promise.all(promises);
  const validPokemons = results.filter(p => p !== null);

  return validPokemons;
}

module.exports = {
  getOnePokemon,
  getPokemonList,
  getAllPokemonWithDetails,
  getRangeOfPokemon,
};
