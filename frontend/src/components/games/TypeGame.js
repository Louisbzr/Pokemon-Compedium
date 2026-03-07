import '../../styles/games/TypeGame.css';
import { t } from '../../i18n/translations';

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const getTypeColor = (type) => TYPE_COLORS[type] || '#777';

const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function TypeGame({ 
  currentPokemon, 
  selectedTypes, 
  wrongTypes, 
  correctlyGuessedTypes, 
  onToggleType, 
  onSubmitGuess, 
  language 
}) {
  return (
    <div className="game-display">
      <h2>
        {t('typeGameTitle', language)} 
        (<span className="types-count">{currentPokemon.types.length}</span> {t('toFind', language)})
      </h2>
      <div className="pokemon-display">
        <img src={currentPokemon.sprite} className="pokemon-image" alt={currentPokemon.name} />
      </div>

      <div className="type-grid-uniform">
        {TYPES.map(type => {
          const isSelected = selectedTypes.includes(type);
          const isWrong = wrongTypes.includes(type);
          const isValidated = correctlyGuessedTypes.includes(type);
          const typeName = t(`pokedexKeys.${type}`, language);
          return (
            <button
              key={type}
              className={`type-btn-uniform 
                ${isValidated ? 'validated' : ''} 
                ${isSelected ? 'selected' : ''} 
                ${isWrong ? 'wrong' : ''}`}
              style={{
                backgroundColor: isWrong ? '#e0e0e0' : getTypeColor(type),
                borderColor: (isSelected || isValidated) ? '#4CAF50' : 'transparent'
              }}
              onClick={() => onToggleType(type)}
              disabled={isWrong || isValidated}
              title={typeName}
            >
              <span className="type-name">{typeName}</span>
              {isWrong && <span className="status-mark wrong" aria-label="Incorrect">❌</span>}
              {isValidated && <span className="status-mark valid" aria-label="Correct">✔️</span>}
            </button>
          );
        })}
      </div>

      <button
        className="validate-btn"
        onClick={onSubmitGuess}
        disabled={selectedTypes.length === 0}
      >
        {t('validateButton', language)}
      </button>
    </div>
  );
}

export default TypeGame;
