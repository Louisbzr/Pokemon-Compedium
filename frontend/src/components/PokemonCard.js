import './PokemonCard.css'


function PokemonCard({ pokemon, language, getPokemonName,  onClick}) {
  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    }
    return typeColors[typeName] || '#68A090'
  }
  
  const getTypeGradient = (typeName) => {
    const color = getTypeColor(typeName)
    return `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`
  }
  
  const types = pokemon.types.map(t => t.type.name)
  const mainType = types[0] || 'normal'
  
  let totalStatsBackground
  if (types.length === 2) {
    const color1 = getTypeColor(types[0])
    const color2 = getTypeColor(types[1])
    totalStatsBackground = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
  } else {
    totalStatsBackground = getTypeGradient(mainType)
  }

  // Obtenir le nom localisé du Pokémon
  const displayName = getPokemonName(pokemon, language)

  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <h3>{displayName}</h3>
      <img src={pokemon.sprite} alt={pokemon.name} />
      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => (
          <span 
            key={typeInfo.slot}
            style={{ background: getTypeGradient(typeInfo.type.name) }}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
      
      <div className="pokemon-stats">
        {pokemon.stats.map((statInfo) => (
          <div key={statInfo.stat.name} className="stat-item">
            <span className="stat-name">{statInfo.stat.name}:</span>
            <span className="stat-value">{statInfo.base_stat}</span>
          </div>
        ))}
      </div>
      <div 
          className="total-stats"
          style={{ background: totalStatsBackground }}
        >
          <span className="stat-name">Total</span>
          <span className="stat-value-total">{pokemon.totalStats}</span>
        </div>
    </div>
  )
}


export default PokemonCard
