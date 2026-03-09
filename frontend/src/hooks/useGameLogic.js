import { useState, useCallback } from 'react';

export function useGameLogic(allPokemons, language, getPokemonName) {
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameState, setGameState] = useState('playing');

  const MAX_ERRORS = { shadow: 3, description: 3, type: 3, hangman: 6 };

  const startGame = useCallback(async (mode) => {
    return new Promise((resolve) => {
      const randomIndex = Math.floor(Math.random() * allPokemons.length);
      const pokemon = allPokemons[randomIndex];
      resolve(pokemon);
    });
  }, [allPokemons]);

  const handleWin = useCallback(() => {
    setGameState('won');
    setScore(s => s + 80);
  }, []);

  const handleLose = useCallback(() => {
    setGameState('lost');
  }, []);

  return {
    score, gameState, history,
    startGame, handleWin, handleLose, MAX_ERRORS
  };
}
