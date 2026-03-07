import React, { useState, useEffect } from 'react';
import '../../styles/games/PokemonMemory.css';
import { t } from '../../i18n/translations';

export default function PokemonMemory({ allPokemons, onWin, language }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initGame();
  }, [allPokemons]);

  const initGame = () => {
    if (!allPokemons || allPokemons.length === 0) return;

    const shuffledPokemons = [...allPokemons].sort(() => 0.5 - Math.random());
    const selected = shuffledPokemons.slice(0, 6);

    const duplicated = [...selected, ...selected]
      .sort(() => 0.5 - Math.random())
      .map((pkmn, index) => ({ 
        ...pkmn, 
        uniqueId: index, 
        isFlipped: false, 
        isMatched: false 
      }));
    
    setCards(duplicated);
    setFlipped([]);
    setMatches(0);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].id === cards[newFlipped[1]].id;
      
      setTimeout(() => {
        const updatedCards = [...newCards];
        if (match) {
          updatedCards[newFlipped[0]].isMatched = true;
          updatedCards[newFlipped[1]].isMatched = true;
          
          setMatches(m => {
            const newMatches = m + 1;
            if (newMatches === 6 && onWin) {
              onWin();
            }
            return newMatches;
          });
        } else {
          updatedCards[newFlipped[0]].isFlipped = false;
          updatedCards[newFlipped[1]].isFlipped = false;
        }
        setCards(updatedCards);
        setFlipped([]);
      }, 1000);
    }
  };

  if (!cards.length) {
    return <div className="game-loading">{t('loading', language)}</div>;
  }

  return (
    <div className="memory-game">
      <h2>{t('memoryTitle', language)}</h2>
      <div className="memory-stats">
        <p>{t('pairsLabel', language)}: {matches} / 6</p>
        <p>{t('attemptsLabel', language)}: {moves}</p>
      </div>
      
      <div className="memory-grid">
        {cards.map((card, index) => (
          <div 
            key={card.uniqueId} 
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front">
                <div className="pokeball-back"></div>
              </div>
              <div className="memory-card-back">
                <img src={card.sprite} alt={card.name} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches === 6 && (
        <button className="memory-retry-btn" onClick={initGame}>
          {t('retryButton', language)}
        </button>
      )}
    </div>
  );
}
