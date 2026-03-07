import './PokemonCard.css';
import { getTypeIcon, getTypeColor, getTypeDisplayName } from '../../utils/typeIcons';

function PokemonCard({ pokemon, language, getPokemonName, onClick }) {
  const displayName = getPokemonName(pokemon, language);


  const getTypeGradient = (typeName) =>
    `linear-gradient(135deg, ${getTypeColor(typeName)} 0%, ${getTypeColor(typeName)}DD 100%)`;

  return (
    <div className="pokemon-card" onClick={() => onClick(pokemon)}>
      <h3>{displayName}</h3>
      <img src={pokemon.sprite} alt={displayName} loading="lazy" />

      <div className="pokemon-types">
        {pokemon.types.map((typeInfo) => {
          const typeEnglish = typeInfo.type.name;  
          const typeDisplay = getTypeDisplayName(typeInfo, language); 
          const iconUrl = getTypeIcon(typeEnglish); 

          return (
            <span
              key={typeInfo.slot}
              className="pokemon-type-badge"
              style={{ background: getTypeGradient(typeEnglish) }}
              title={typeDisplay}
            >
              {iconUrl && (
                <img src={iconUrl} alt="" width="12" height="12" />
              )}
              {typeDisplay}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PokemonCard;
