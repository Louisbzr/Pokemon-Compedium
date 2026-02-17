import './App.css';
import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import FilterBar from './components/FilterBar';
import SortBar from './components/SortBar';
import GenerationNav from './components/GenerationNav'



const GENERATIONS = {
  1: { name: 'Generation I', start: 1, end: 151 },
  2: { name: 'Generation II', start: 152, end: 251 },
  3: { name: 'Generation III', start: 252, end: 386 },
  4: { name: 'Generation IV', start: 387, end: 493 },
  5: { name: 'Generation V', start: 494, end: 649 },
  6: { name: 'Generation VI', start: 650, end: 721 },
  7: { name: 'Generation VII', start: 722, end: 809 },
  8: { name: 'Generation VIII', start: 810, end: 905 },
  9: { name: 'Generation IX', start: 906, end: 1025 }
}

const getStatValue = (pokemon, statName) => {
  const stat = pokemon.stats.find(s => s.stat.name === statName)
  return stat ? stat.base_stat : 0
}

function App() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGeneration, setSelectedGeneration] = useState(1)
  const [filters, setFilters] = useState({
    type: 'all',
    color: 'all',
    generation: 'all'
  })
  const [sortBy, setSortBy] = useState('id')
    
  console.log('Composant App chargé')
  console.log('pokemons:', pokemons)
  console.log('loading:', loading)


  const fetchPokemonByGeneration = async (genNumber) => {
    try {
      setLoading(true)
      const gen = GENERATIONS[genNumber]
      const count = gen.end - gen.start + 1
      const offset = gen.start - 1
      
      const response = await fetch(`http://localhost:5000/pokemon?limit=${count}&offset=${offset}`)
      const data = await response.json()
      
      const pokemonsWithTotal = data.map(pokemon => {
        const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
        return {
          ...pokemon,
          totalStats: totalStats
        }
      })
      
      console.log('Premier Pokémon avec total:', pokemonsWithTotal[0])
      
      setPokemons(pokemonsWithTotal)
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }


  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    })
  }

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption)
  }

  useEffect(() => {
    fetchPokemonByGeneration(selectedGeneration)
  }, [selectedGeneration]) 

  const filteredPokemons = Array.isArray(pokemons) ? pokemons.filter((pokemon) => {
    const typeMatch = filters.type === 'all' || 
      pokemon.types.some((t) => t.type.name === filters.type)
    
    const colorMatch = filters.color === 'all' || 
      pokemon.color === filters.color
    
    const generationMatch = filters.generation === 'all' || 
      pokemon.generation === filters.generation
    
    return typeMatch && colorMatch && generationMatch
  }) : []

  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    if (sortBy === 'id') {
      return a.id - b.id
    }
    
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    
    if (sortBy === 'stats') return a.totalStats - b.totalStats
    if (sortBy === 'stats-desc') return b.totalStats - a.totalStats
    
    const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
    
    for (const statName of statNames) {
      if (sortBy === statName) {
        return getStatValue(a, statName) - getStatValue(b, statName)
      }
      if (sortBy === `${statName}-desc`) {
        return getStatValue(b, statName) - getStatValue(a, statName)
      }
    }
    
    return 0
  })

  const getBackgroundByType = (typeName) => {
    const backgrounds = {
      all: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Violet par défaut
      normal: 'linear-gradient(135deg, #A8A878 0%, #6D6D4E 100%)',
      fire: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      water: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
      electric: 'linear-gradient(135deg, #F8D030 0%, #EAB308 100%)',
      grass: 'linear-gradient(135deg, #78C850 0%, #48A068 100%)',
      ice: 'linear-gradient(135deg, #98D8D8 0%, #5DADE2 100%)',
      fighting: 'linear-gradient(135deg, #C03028 0%, #8B0000 100%)',
      poison: 'linear-gradient(135deg, #A040A0 0%, #6A1B9A 100%)',
      ground: 'linear-gradient(135deg, #E0C068 0%, #C19A6B 100%)',
      flying: 'linear-gradient(135deg, #A890F0 0%, #7E57C2 100%)',
      psychic: 'linear-gradient(135deg, #F85888 0%, #E91E63 100%)',
      bug: 'linear-gradient(135deg, #A8B820 0%, #7CB342 100%)',
      rock: 'linear-gradient(135deg, #B8A038 0%, #8D6E63 100%)',
      ghost: 'linear-gradient(135deg, #705898 0%, #512DA8 100%)',
      dragon: 'linear-gradient(135deg, #7038F8 0%, #5E35B1 100%)',
      dark: 'linear-gradient(135deg, #705848 0%, #3E2723 100%)',
      steel: 'linear-gradient(135deg, #B8B8D0 0%, #78909C 100%)',
      fairy: 'linear-gradient(135deg, #EE99AC 0%, #EC407A 100%)'
    }
    return backgrounds[typeName] || backgrounds.all
  }

  const currentBackground = getBackgroundByType(filters.type)



  return (
    <div className="App" style={{ background: currentBackground }}>
      <h1>Pokemon Compedium</h1>
      
      <GenerationNav 
        selectedGen={selectedGeneration}
        onSelectGeneration={setSelectedGeneration}
      />
      
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          color: 'white'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            marginTop: '20px',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>Loading of Pokémon... ⏳</p>
        </div>
      ) : (
        <>
          <p>Number of Pokemon : {sortedPokemons.length}</p>
          <FilterBar onFilterChange={handleFilterChange} />
          <SortBar onSortChange={handleSortChange} />
          <div className="pokemon-grid">
            {sortedPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </>
      )}
    </div>
  );


}

export default App;
