const fetch = require('node-fetch');

async function getOnePokemon(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    const response = await fetch(url)
    const data = await response.json()
    
    const species = await getPokemonSpecies(data.id)
    
    const pokemon = {
        name: data.name,
        id: data.id,
        sprite: data.sprites.front_default,
        types: data.types,
        stats: data.stats,
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
        // Si erreur, retourne des valeurs par défaut
        return {
            color: 'unknown',
            generation: 'unknown'
        }
    }
}

async function getPokemonList(){
    const url = `https://pokeapi.co/api/v2/pokemon?limit=153s`
    const response = await fetch(url)
    const data = await response.json()

    return data.results
}

async function getAllPokemonWithDetails(){
    const detailsPokemon = await getPokemonList()
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