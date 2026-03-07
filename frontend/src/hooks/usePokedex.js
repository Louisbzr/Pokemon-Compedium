import { useState, useEffect, useCallback, useMemo } from 'react'

const GENERATIONS = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1025 },
  all: { start: 1, end: 1025 }
}

const getStatValue = (pokemon, statName) => {
  const stat = pokemon.stats.find(s => s.stat.name === statName)
  return stat ? stat.base_stat : 0
}

export function usePokedex() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedGeneration, setSelectedGeneration] = useState('all')
  const [filters, setFilters] = useState({ type: 'all', color: 'all' })
  const [sortBy, setSortBy] = useState('id')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPokemonByGeneration = useCallback(async (genNumber) => {
    try {
      setLoading(true)
      setLoadingProgress(0)
      const gen = GENERATIONS[genNumber]
      const count = gen.end - gen.start + 1
      const offset = gen.start - 1

      if (genNumber === 'all') {
        const batchSize = 100
        let allPokemons = []
        for (let i = 0; i < count; i += batchSize) {
          const currentBatchSize = Math.min(batchSize, count - i)
          const response = await fetch(`http://localhost:5000/pokemon?limit=${currentBatchSize}&offset=${offset + i}`)
          const data = await response.json()
          const withTotal = data.map(p => ({ ...p, totalStats: p.stats.reduce((s, st) => s + st.base_stat, 0) }))
          allPokemons = [...allPokemons, ...withTotal]
          setLoadingProgress(Math.round((allPokemons.length / count) * 100))
        }
        setPokemons(allPokemons)
      } else {
        const response = await fetch(`http://localhost:5000/pokemon?limit=${count}&offset=${offset}`)
        const data = await response.json()
        setPokemons(data.map(p => ({ ...p, totalStats: p.stats.reduce((s, st) => s + st.base_stat, 0) })))
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
      setLoadingProgress(0)
    }
  }, [])

  useEffect(() => {
    fetchPokemonByGeneration(selectedGeneration)
  }, [selectedGeneration, fetchPokemonByGeneration])

  const processedPokemons = useMemo(() => {
    if (!Array.isArray(pokemons)) return []

    const filtered = pokemons.filter(pokemon => {
      const typeMatch = filters.type === 'all' || pokemon.types.some(t => t.type.name === filters.type)
      const colorMatch = filters.color === 'all' || pokemon.color === filters.color
      return typeMatch && colorMatch
    })

    const searched = searchTerm.trim() === '' ? filtered : filtered.filter(pokemon => {
      // Recherche MULTILINGUE
      const names = pokemon.names || [];
      const allNames = names.map(n => n.name.toLowerCase());
      allNames.push(pokemon.name.toLowerCase()); // Fallback anglais
      
      return allNames.some(name => name.includes(searchTerm.toLowerCase()));
    });

    return [...searched].sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      if (sortBy === 'stats') return b.totalStats - a.totalStats
      if (sortBy === 'stats-desc') return a.totalStats - b.totalStats
      const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
      for (const statName of statNames) {
        if (sortBy === statName) return getStatValue(b, statName) - getStatValue(a, statName)
        if (sortBy === `${statName}-desc`) return getStatValue(a, statName) - getStatValue(b, statName)
      }
      return 0
    })
  }, [pokemons, filters, sortBy, searchTerm])

  return {
    pokemons: processedPokemons,
    allPokemons: pokemons,
    loading,
    loadingProgress,
    selectedGeneration,
    setSelectedGeneration,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm
  }
}
