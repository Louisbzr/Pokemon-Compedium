import './PokemonCard.css'


function PokemonCard(props) {

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: 'linear-gradient(135deg, #A8A878 0%, #8A8A59 100%)',
      fire: 'linear-gradient(135deg, #F08030 0%, #DD6610 100%)',
      water: 'linear-gradient(135deg, #6890F0 0%, #386CEB 100%)',
      electric: 'linear-gradient(135deg, #F8D030 0%, #F0C108 100%)',
      grass: 'linear-gradient(135deg, #78C850 0%, #5CA935 100%)',
      ice: 'linear-gradient(135deg, #98D8D8 0%, #69C6C6 100%)',
      fighting: 'linear-gradient(135deg, #C03028 0%, #9D2721 100%)',
      poison: 'linear-gradient(135deg, #A040A0 0%, #803380 100%)',
      ground: 'linear-gradient(135deg, #E0C068 0%, #D4A82F 100%)',
      flying: 'linear-gradient(135deg, #A890F0 0%, #9180C4 100%)',
      psychic: 'linear-gradient(135deg, #F85888 0%, #F61C5D 100%)',
      bug: 'linear-gradient(135deg, #A8B820 0%, #8D9A1B 100%)',
      rock: 'linear-gradient(135deg, #B8A038 0%, #A48B28 100%)',
      ghost: 'linear-gradient(135deg, #705898 0%, #554374 100%)',
      dragon: 'linear-gradient(135deg, #7038F8 0%, #4C08EF 100%)',
      dark: 'linear-gradient(135deg, #705848 0%, #513F34 100%)',
      steel: 'linear-gradient(135deg, #B8B8D0 0%, #9797BA 100%)',
      fairy: 'linear-gradient(135deg, #EE99AC 0%, #EC6D9A 100%)'
    }
    return typeColors[typeName] || 'linear-gradient(135deg, #68A090 0%, #597D72 100%)'
  }

  return (
    <div className="pokemon-card">
      <h3>{props.pokemon.name}</h3>
      <img src={props.pokemon.sprite} alt={props.pokemon.name} />
      <div className="pokemon-types">
        {props.pokemon.types.map((typeInfo) => (
          <span 
            key={typeInfo.slot}
            style={{ background: getTypeColor(typeInfo.type.name) }}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
      <div className="pokemon-stats">
      <div className="total-stats">
          <span className="stat-name">Total</span>
          <span className="stat-value-total">{props.pokemon.totalStats}</span>
        </div>
        
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
