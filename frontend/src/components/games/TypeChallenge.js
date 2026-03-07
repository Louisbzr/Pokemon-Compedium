import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/games/TypeChallenge.css';
import { t } from '../../i18n/translations';
import { getTypeIcon } from '../../utils/typeIcons';
import { getPokemonName } from '../../utils/pokemonUtils';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function TypeChallenge({ 
  allPokemons, 
  onWin, 
  language,
}) {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);

  const generateQuestion = useCallback(() => {
    if (!allPokemons?.length) return;

    const randomPkmn = allPokemons[Math.floor(Math.random() * allPokemons.length)];
    setCurrentPokemon(randomPkmn);

    const trueType = randomPkmn.types[0]?.type?.name;
    if (!trueType) return;

    const wrongTypes = ALL_TYPES
      .filter(t => t !== trueType)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const choices = [trueType, ...wrongTypes].sort(() => Math.random() - 0.5);
    setOptions(choices);
  }, [allPokemons]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    if (isGameOver || timeLeft <= 0) {
      if (timeLeft <= 0) setIsGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver]);

  const handleTypeClick = (selectedType) => {
    if (isGameOver) return;

    const isCorrect = currentPokemon.types.some(t => t.type.name === selectedType);
    if (isCorrect) {
      setScore(s => s + 1);
      if (onWin) onWin(score + 1);
      setTimeLeft(t => Math.min(60, t + 2));
      generateQuestion();
    } else {
      setTimeLeft(t => Math.max(0, t - 4));
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    generateQuestion();
  };

  if (!currentPokemon) {
    return <div className="game-loading">{t('loading', language)}</div>;
  }

  return (
    <div className="type-challenge-game">
      {/* HUD */}
      <div className="hud">
        <span className="score">{t('scoreLabel', language)}: {score}</span>
        <span className={`timer ${timeLeft <= 5 ? 'danger' : ''}`}>
          ⏱️ {timeLeft}s
        </span>
      </div>

      {/* Pokémon cible */}
      <div className="pokemon-target">
        <img src={currentPokemon.sprite} alt={currentPokemon.name} loading="lazy" />
        {isGameOver ? (
          <h3 className="gameover-text">
            {t('timeUpMessage', language).replace('{score}', score)}
          </h3>
        ) : (
          <h3>
            {t('typeQuestionPrefix', language)}
            <strong>
              {getPokemonName(currentPokemon, language)} ?
            </strong>
          </h3>
        )}
      </div>

      {/* Options de types */}
      {!isGameOver ? (
        <div className="type-options-grid">
          {options.map(type => {
            const iconUrl = getTypeIcon(type);
            const typeName = t(`pokedexKeys.${type}`, language);

            return (
              <button
                key={type}
                className={`type-btn type-${type}`}
                onClick={() => handleTypeClick(type)}
                disabled={timeLeft <= 0}
                title={typeName}
              >
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt={typeName}
                    width="18"
                    height="18"
                    className="type-icon"
                  />
                )}
                <span>{typeName}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="game-over-screen">
          <button className="tc-retry-btn" onClick={restartGame}>
            {t('arcadeRetry', language)}
          </button>
        </div>
      )}
    </div>
  );
}
