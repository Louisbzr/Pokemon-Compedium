import '../../styles/games/ResultModal.css';
import { t } from '../../i18n/translations';

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const getTypeColor = (type) => TYPE_COLORS[type] || '#777';

function ResultModal({ gameState, currentPokemon, gameMode, errors, onContinue, language }) {
  if (gameState === 'playing') return null;

  const isWin = gameState === 'won';
  const points = 100 - (errors * 20);

  return (
    <div className="modal-overlay-game">
      <div className={`result-modal ${gameState}`}>
        <h2>{isWin ? t('victoryTitle', language) : t('defeatTitle', language)}</h2>
        <img src={currentPokemon.sprite} className="result-image" alt="result" />
        <p className="result-name">{currentPokemon.nameRef}</p>

        {gameMode === 'type' && (
          <div className="correct-types-display">
            <p className="types-label">{t('correctTypesLabel', language)}</p>
            <div className="types-badges">
              {currentPokemon.types.map((type, index) => (
                <span
                  key={index}
                  className="type-badge-result"
                  style={{ backgroundColor: getTypeColor(type) }}
                  title={type}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {isWin && (
          <p className="points-gained">
            {t('pointsGained', language).replace('{points}', points)}
          </p>
        )}
        
        <button className="continue-btn" onClick={onContinue}>
          {t('continueButton', language)}
        </button>
      </div>
    </div>
  );
}

export default ResultModal;
