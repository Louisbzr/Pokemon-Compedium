import './App.css';
import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import FilterBar from './components/FilterBar';
import SortBar from './components/SortBar';


function App() {
  const [pokemons, setPokemons] = useState([])
  const [filters, setFilters] = useState({
    type: 'all',
    color: 'all',
    generation: 'all'
  })
  const [sortBy, setSortBy] = useState('id')

  const fetchPokemon = async () => {
    console.log('Début du chargement...')
    const response = await fetch('http://localhost:5000/pokemon')
    const data = await response.json()
    setPokemons(data)
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
    fetchPokemon()
  }, [])

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
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name)
    }
    return 0
  })


  return (
    <div className="App">
      <h1>Pokemon MVP</h1>
      <p>Nombre de pokémon : {sortedPokemons.length}</p>
      
      <FilterBar onFilterChange={handleFilterChange} />
      <SortBar onSortChange={handleSortChange} />

      <div className="pokemon-grid">
        {sortedPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );

}

export default App;
