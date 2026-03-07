import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/games/HigherLower.css';
import { t } from '../../i18n/translations';
import { getPokemonName } from '../../utils/pokemonUtils';

export default function HigherLower({ allPokemons, onWin, onLose, language }) {
  const [currentA, setCurrentA] = useState(null);
  const [currentB, setCurrentB] = useState(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing');

  // Fonction pour obtenir un Pokémon au hasard
  const getRandomPokemon = useCallback(() => {
    return allPokemons[Math.floor(Math.random() * allPokemons.length)];
  }, [allPokemons]);

  // Fonction d'initialisation du jeu
  const initGame = useCallback(() => {
    if (!allPokemons || allPokemons.length < 2) return;

    let pA = getRandomPokemon();
    let pB = getRandomPokemon();

    while (pA.id === pB.id) {
      pB = getRandomPokemon();
    }

    setCurrentA(pA);
    setCurrentB(pB);
    setScore(0);
    setGameState('playing');
  }, [allPokemons, getRandomPokemon]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleGuess = (guess) => {
    if (gameState !== 'playing') return;

    const isHigherOrEqual = currentB.weight >= currentA.weight;
    const isCorrect = (guess === 'higher' && isHigherOrEqual) || (guess === 'lower' && !isHigherOrEqual);

    if (isCorrect) {
      setScore(s => s + 1);
      setGameState('guessed');
      if (onWin) onWin();

      setTimeout(() => {
        let newB = getRandomPokemon();
        while (newB.id === currentB.id || newB.id === currentA.id) {
          newB = getRandomPokemon();
        }
        setCurrentA(currentB);
        setCurrentB(newB);
        setGameState('playing');
      }, 2000);
    } else {
      setGameState('gameover');
      if (onLose) onLose();
    }
  };

  if (!currentA || !currentB) {
    return <div className="game-loading">{t('loading', language)}</div>;
  }

  return (
    <div className="higher-lower-game">
      <h2>{t('higherLowerTitle', language)}</h2>
      <h3 className="score">{t('scoreLabel', language)}: {score}</h3>
      
      <div className="vs-container">
        {/* POKEMON A */}
        <div className="pokemon-card reference">
          <img src={currentA.sprite} alt={currentA.name} />
          <h4>{getPokemonName(currentA, language)}</h4>
          <p className="stat-value">{currentA.weight / 10} {t('weightUnit', language)}</p>
        </div>

        <div className="vs-badge">{t('vs', language)}</div>

        {/* POKEMON B */}
        <div className="pokemon-card challenger">
          <img src={currentB.sprite} alt={currentB.name} />
          <h4>{getPokemonName(currentB, language)}</h4>
          
          {gameState === 'playing' ? (
            <div className="action-buttons">
              <button className="btn-higher" onClick={() => handleGuess('higher')}>
                {t('heavierButton', language)}
              </button>
              <button className="btn-lower" onClick={() => handleGuess('lower')}>
                {t('lighterButton', language)}
              </button>
            </div>
          ) : (
            <p className={`stat-value ${gameState === 'gameover' ? 'wrong' : 'correct'}`}>
              {currentB.weight / 10} kg
            </p>
          )}
        </div>
      </div>
      
      {gameState === 'gameover' && (
         <button className="hl-retry-btn" onClick={initGame}>
           {t('retryButton', language)}
         </button>
      )}
    </div>
  );
}
