import { t } from '../../i18n/translations';

function ShadowGame({ currentPokemon, gameState, shadowBlur, language }) {
  return (
    <div className="game-display">
      <h2>{t('shadowTitle', language)}</h2>
      <div className="pokemon-display shadow-mode">
        <img 
          src={currentPokemon.sprite} 
          className="pokemon-image"
          style={{ 
            filter: gameState === 'playing' 
              ? `brightness(0) blur(${shadowBlur}px)` 
              : 'none' 
          }}
          alt="Shadow Pokémon"
        />
      </div>
    </div>
  );
}

export default ShadowGame;
