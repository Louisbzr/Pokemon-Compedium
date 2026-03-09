const fetch = require('node-fetch');
const pLimit = require('p-limit').default;

const pokemonCache = new Map();
const speciesCache = new Map();

const limitConcurrency = pLimit(15); // limite de requêtes simultanées

// -----------------------------
// Extraction des IDs d'évolution
// -----------------------------
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

// -----------------------------
// Species avec cache
// -----------------------------
async function getPokemonSpecies(id) {

  if (speciesCache.has(id)) {
    return speciesCache.get(id);
  }

  try {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    const species = {
      color: data.color?.name || 'unknown',
      generation: data.generation?.name || 'unknown',
      names: data.names || [],
      evolutionChainUrl: data.evolution_chain?.url || null,
      evolutionChainId: data.evolution_chain
        ? parseInt(data.evolution_chain.url.split('/').filter(Boolean).pop())
        : null,
      isLegendary: data.is_legendary || false,
      isMythical: data.is_mythical || false,
      shape: data.shape?.name || null,
      isBaby: data.is_baby || false,
      evolvesFromSpeciesUrl: data.evolves_from_species?.url || null,
      habitat: data.habitat?.name || null,
    };

    speciesCache.set(id, species);

    return species;

  } catch (error) {
    console.error(`Species ${id} failed`, error.message);

    return {
      color: 'unknown',
      generation: 'unknown',
      names: [],
      evolutionChainUrl: null,
    };
  }
}

// -----------------------------
// Evolution stage
// -----------------------------
async function getEvolutionStage(isBaby, evolvesFromSpeciesUrl) {

  if (isBaby) return 0;
  if (!evolvesFromSpeciesUrl) return 1;

  const parentId = parseInt(
    evolvesFromSpeciesUrl.split('/').filter(Boolean).pop()
  );

  const parentSpecies = await getPokemonSpecies(parentId);

  if (!parentSpecies.evolvesFromSpeciesUrl) {
    return 2;
  } else {
    return 3;
  }
}

// -----------------------------
// Pokémon unique
// -----------------------------
async function getOnePokemon(id) {

  if (pokemonCache.has(id)) {
    return pokemonCache.get(id);
  }

  try {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    const species = await getPokemonSpecies(data.id);

    const evolutionStage = await getEvolutionStage(
      species.isBaby,
      species.evolvesFromSpeciesUrl
    );

    const totalStats = data.stats.reduce(
      (sum, stat) => sum + stat.base_stat,
      0
    );

    const pokemon = {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,

      types: data.types,
      stats: data.stats,
      totalStats,

      height: data.height,
      weight: data.weight,

      color: species.color,
      generation: species.generation,
      names: species.names,

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

// -----------------------------
// Liste simple
// -----------------------------
async function getPokemonList(limit = 20, offset = 0) {

  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}

// -----------------------------
// Range optimisé
// -----------------------------
async function getRangeOfPokemon(limit = 50, offset = 0) {

  const start = Math.max(1, offset + 1);
  const end = Math.min(1025, offset + limit);

  const promises = [];

  for (let id = start; id <= end; id++) {

    promises.push(
      limitConcurrency(() => getOnePokemon(id))
    );

  }

  const results = await Promise.all(promises);

  return results.filter(Boolean);
}

// -----------------------------
// Chargement complet optimisé
// -----------------------------
async function getAllPokemonWithDetails() {

  const promises = [];

  for (let id = 1; id <= 1025; id++) {

    promises.push(
      limitConcurrency(() => getOnePokemon(id))
    );

  }

  const results = await Promise.all(promises);

  return results.filter(Boolean);
}

module.exports = {
  getOnePokemon,
  getPokemonList,
  getRangeOfPokemon,
  getAllPokemonWithDetails,
};