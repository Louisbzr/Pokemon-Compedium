import { useState, useEffect } from 'react';
import { getStatValue } from '../utils/pokemonUtils';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
};

export function usePokemonFetch(language = 'fr') {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [filters, setFilters] = useState({ type: 'all', color: 'all' });
  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPokemonByGeneration = async (genNumber) => {
    try {
      setLoading(true);
      setLoadingProgress(0);

      if (genNumber === 'all') {
        const res = await fetch(`${API_BASE}/pokemon?limit=1025&offset=0`);
        const data = await res.json();
        const enriched = data.map(p => ({
          ...p,
          totalStats: p.stats.reduce((s, st) => s + st.base_stat, 0)
        }));
        setPokemons(enriched);
      } else {
        const gen = GENERATIONS[genNumber];
        const res = await fetch(`${API_BASE}/pokemon?limit=${gen.end-gen.start+1}&offset=${gen.start-1}`);
        const data = await res.json();
        const enriched = data.map(p => ({
          ...p,
          totalStats: p.stats.reduce((s, st) => s + st.base_stat, 0)
        }));
        setPokemons(enriched);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
      setLoadingProgress(100);
    }
  };

  useEffect(() => {
    fetchPokemonByGeneration(selectedGeneration || 'all');
  }, [selectedGeneration]);

  const filtered = Array.isArray(pokemons)
    ? pokemons.filter(p => {
        const typeMatch =
          filters.type === 'all' ||
          p.types.some(t => t.type.name === filters.type);
        const colorMatch =
          filters.color === 'all' || p.color === filters.color;
        return typeMatch && colorMatch;
      })
    : [];

  const searched =
    searchTerm.trim() === ''
      ? filtered
      : filtered.filter(p => {
          const allNames = (p.names || []).map(n => n.name.toLowerCase());
          allNames.push(p.name.toLowerCase());
          return allNames.some(name =>
            name.includes(searchTerm.toLowerCase())
          );
        });

  const sortedPokemons = [...searched].sort((a, b) => {
    if (sortBy === 'id') return a.id - b.id;

    const getDisplayName = p => {
      const chinese = p.names?.find(n => n.language.name === 'zh-Hans');
      if (chinese) return chinese.name;
      const french = p.names?.find(n => n.language.name === 'fr');
      if (french) return french.name;
      return p.name;
    };

    if (sortBy === 'name')
      return getDisplayName(a).localeCompare(getDisplayName(b));
    if (sortBy === 'name-desc')
      return getDisplayName(b).localeCompare(getDisplayName(a));

    if (sortBy === 'stats') return b.totalStats - a.totalStats;
    if (sortBy === 'stats-desc') return a.totalStats - b.totalStats;

    const stats = [
      'hp',
      'attack',
      'defense',
      'special-attack',
      'special-defense',
      'speed',
    ];
    for (const s of stats) {
      if (sortBy === s) return getStatValue(b, s) - getStatValue(a, s);
      if (sortBy === `${s}-desc`) return getStatValue(a, s) - getStatValue(b, s);
    }
    return 0;
  });

  return {
    pokemons: sortedPokemons,
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
    setSearchTerm,
  };
}
