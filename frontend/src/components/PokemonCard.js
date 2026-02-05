import './PokemonCard.css'


function PokemonCard(props) {
  return (
    <div className="pokemon-card">
      <h3>{props.pokemon.name}</h3>
      <img src={props.pokemon.sprite} alt={props.pokemon.name} />
      <div className="pokemon-types">
        {props.pokemon.types.map((typeInfo) => (
          <span key={typeInfo.slot}>{typeInfo.type.name}</span>
        ))}
      </div>
      <div className="pokemon-stats">
        {props.pokemon.stats.map((statInfo) => (
            <div key={statInfo.stat.name} className="stat-item">
            <span className="stat-name">{statInfo.stat.name}:</span>
            <span className="stat-value">{statInfo.base_stat}</span>
            </div>
        ))}
    </div>

    </div>
    
  )
}

export default PokemonCard
