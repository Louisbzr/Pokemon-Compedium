import '../../styles/games/HangmanGame.css';
import { t } from '../../i18n/translations';

function HangmanGame({ currentPokemon, gameState, hangmanState, onSubmitLetter, language }) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const isWon = hangmanState.word
    .split('')
    .every(char => hangmanState.guessed.includes(char));

  return (
    <div className="game-display">
      <h2>{t('hangmanTitle', language)}</h2>
      
      <div className="pokemon-display">
        {gameState === 'playing' ? (
          <div className="pokeball-mystery">
            <div className="pokeball-top"></div>
            <div className="pokeball-bottom"></div>
            <div className="pokeball-button"></div>
          </div>
        ) : null}

        {gameState !== 'playing' && isWon && (
          <div className="revealed-pokemon-container capture-success">
            <img src={currentPokemon.sprite} className="pokemon-image" alt="pokemon" />
          </div>
        )}
      </div>

      <div className="word-display">
        {hangmanState.word.split('').map((char, i) => (
          <span key={i} className="letter-slot">
            {hangmanState.guessed.includes(char) || gameState !== 'playing' ? char : '_'}
          </span>
        ))}
      </div>

      {gameState === 'playing' && (
        <div className="modern-keyboard">
          {ALPHABET.map((letter) => {
            const isGuessed = hangmanState.guessed.includes(letter);
            const isWordLetter = hangmanState.word.includes(letter);
            
            let btnClass = "modern-key";
            if (isGuessed) {
              btnClass += isWordLetter ? " correct" : " wrong";
            }

            return (
              <button
                key={letter}
                className={btnClass}
                disabled={isGuessed}
                onClick={() => onSubmitLetter(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HangmanGame;
