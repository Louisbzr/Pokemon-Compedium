const fetch = require('node-fetch');

async function getOnePokemon(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    const response = await fetch(url)
    const data = await response.json()
    const species = await getPokemonSpecies(data.id)
    const totalStats = data.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    const pokemon = {
        name: data.name,
        id: data.id,
        sprite: data.sprites.front_default,
        types: data.types,
        stats: data.stats,
        totalStats: totalStats,
        color: species.color,
        generation: species.generation
    }
    
    return pokemon
}



async function getPokemonSpecies(id) {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
        const response = await fetch(url)
        const data = await response.json()
        
        return {
            color: data.color.name,
            generation: data.generation.name
        }
    } catch (error) {
        return {
            color: 'unknown',
            generation: 'unknown'
        }
    }
}

async function getPokemonList(limit = 20, offset = 0){
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    const response = await fetch(url)
    const data = await response.json()

    return data.results
}

async function getAllPokemonWithDetails(limit = 20, offset = 0){
    const detailsPokemon = await getPokemonList(limit, offset)
    const promises = detailsPokemon.map((pokemon) => {
        return getOnePokemon(pokemon.name)
    })
    const resultats = await Promise.all(promises)
    return resultats
}

module.exports = {
    getOnePokemon,
    getPokemonList, 
    getAllPokemonWithDetails
}