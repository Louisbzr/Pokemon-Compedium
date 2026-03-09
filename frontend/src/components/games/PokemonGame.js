import { useState, useEffect } from 'react'
import GameMenu from './GameMenu'
import GameHeader from './GameHeader'
import ResultModal from './ResultModal'
import HistoryBar from './HistoryBar'
import ShadowGame from './ShadowGame'
import DescriptionGame from './DescriptionGame'
import TypeGame from './TypeGame'
import HangmanGame from './HangmanGame'
import { t } from '../../i18n/translations';
import ClassicGame from './ClassicGame'
import PokemonMemory from './PokemonMemory'
import HigherLower from './HigherLower'
import TypeChallenge from './TypeChallenge'
import '../../styles/games/PokemonGame.css';
const MAX_ERRORS = { 
  shadow: 3, 
  description: 3, 
  type: 3, 
  hangman: 6, 
  memory: 99, 
  'higher-lower': 99, 
  'type-challenge': 99,
  'classic': 99,
}

function PokemonGame({ language, getPokemonName, allPokemons, onViewChange, initialGame  }) {
  const [gameMode, setGameMode] = useState(null)
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [userGuess, setUserGuess] = useState('')
  const [gameState, setGameState] = useState('playing')
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [shadowBlur, setShadowBlur] = useState(8)
  const [descriptionRevealLevel, setDescriptionRevealLevel] = useState(1)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [wrongTypes, setWrongTypes] = useState([])
  const [correctlyGuessedTypes, setCorrectlyGuessedTypes] = useState([])
  const [hangmanState, setHangmanState] = useState({ guessed: [], word: '', errors: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(!initialGame)

  useEffect(() => {
    if (initialGame && allPokemons.length > 0) {
      startGame(initialGame);
    }
  }, []);

  useEffect(() => {
    if (!showMenu && currentPokemon) {
      startGame(gameMode);
    }
  }, [language]);

  const startGame = async (mode) => {
    setLoading(true)
    setGameMode(mode)
    setShowMenu(false)
    setGameState('playing')
    setUserGuess('')
    setErrors(0)
    setShadowBlur(8)
    setDescriptionRevealLevel(1)
    setSelectedTypes([])
    setWrongTypes([])
    setCorrectlyGuessedTypes([])

    const randomIndex = Math.floor(Math.random() * allPokemons.length)
    const pokemon = allPokemons[randomIndex]

    let description = '';
    let descriptions = {};
    if (mode === 'description') {
      try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
        const speciesData = await speciesResponse.json()
        
        const descriptions = {};
        speciesData.flavor_text_entries.forEach(entry => {
          descriptions[entry.language.name] = entry.flavor_text.replace(/\f/g, ' ');
        });
        
        description = descriptions[language] || 'Description indisponible.';
        
        const name = getPokemonName(pokemon, language)
        description = description.replace(new RegExp(name, 'gi'), 'Ce Pokémon')
      } catch (e) { console.error(e) }
    }

    const pokemonName = getPokemonName(pokemon, language).toUpperCase()
    const newPokemon = {
      ...pokemon,
      nameRef: pokemonName,
      description: description,
      descriptions: descriptions, 
      types: pokemon.types.map(t => t.type.name)
    }
    setCurrentPokemon(newPokemon)

    if (mode === 'hangman') {
      const cleanWord = pokemon.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

      setHangmanState({
        guessed: [],
        word: cleanWord,
        errors: 0,
      });
    }
    setLoading(false)
  }

  const handleWin = () => {
    setGameState('won')
    setScore(s => s + (100 - (errors * 20)))
    setHistory(prev => [{ pokemon: currentPokemon, won: true }, ...prev].slice(0, 7))
  }

  const handleLose = () => {
    setGameState('lost')
    setHistory(prev => [{ pokemon: currentPokemon, won: false }, ...prev].slice(0, 7))
  }

  const handleError = () => {
    const newErrors = errors + 1
    setErrors(newErrors)
    if (newErrors >= MAX_ERRORS[gameMode]) {
      handleLose()
    } else {
      if (gameMode === 'shadow') setShadowBlur(prev => Math.max(0, prev - 4))
      if (gameMode === 'description') setDescriptionRevealLevel(prev => prev + 1)
    }
  }

  const submitGuess = () => {
    if (gameState !== 'playing' || !userGuess.trim()) return
    const guess = userGuess.trim().toUpperCase()
    if (guess === currentPokemon.nameRef || guess === currentPokemon.name.toUpperCase()) handleWin()
    else handleError()
    setUserGuess('')
  }

  const toggleType = (type) => {
    if (gameState !== 'playing' || wrongTypes.includes(type) || correctlyGuessedTypes.includes(type)) return
    if (selectedTypes.includes(type)) {
      setSelectedTypes(prev => prev.filter(t => t !== type))
    } else {
      const remainingSlots = currentPokemon.types.length - correctlyGuessedTypes.length
      if (selectedTypes.length < remainingSlots) {
        setSelectedTypes(prev => [...prev, type])
      }
    }
  }

  const submitTypeGuess = () => {
    if (gameState !== 'playing') return
    const correctTypes = currentPokemon.types
    const newCorrect = selectedTypes.filter(t => correctTypes.includes(t))
    const newWrong = selectedTypes.filter(t => !correctTypes.includes(t))
    if (newCorrect.length > 0) setCorrectlyGuessedTypes(prev => [...new Set([...prev, ...newCorrect])])
    if (newWrong.length > 0) setWrongTypes(prev => [...new Set([...prev, ...newWrong])])
    const allFound = correctTypes.every(t => [...correctlyGuessedTypes, ...newCorrect].includes(t))
    if (allFound && newWrong.length === 0) handleWin()
    else { handleError(); setSelectedTypes([]) }
  }

  const submitLetter = (letter) => {
    if (gameState !== 'playing' || hangmanState.guessed.includes(letter)) return
    const newGuessed = [...hangmanState.guessed, letter]
    if (!hangmanState.word.includes(letter)) {
      const newErrors = hangmanState.errors + 1
      setHangmanState(prev => ({ ...prev, guessed: newGuessed, errors: newErrors }))
      if (newErrors >= MAX_ERRORS.hangman) handleLose()
    } else {
      setHangmanState(prev => ({ ...prev, guessed: newGuessed }))
      const isWon = hangmanState.word.split('').every(char => newGuessed.includes(char))
      if (isWon) handleWin()
    }
  }

  const backToMenu = () => {
    setShowMenu(true); setGameMode(null); setCurrentPokemon(null); setErrors(0); setHistory([])
  }

  if (showMenu) {
    return <GameMenu 
             onStartGame={startGame} 
             onViewChange={onViewChange}
             language={language} 
           />
  }
  if (loading || !currentPokemon) return <div className="game-loading">Chargement...</div>

  const isInfiniteGame = ['memory', 'higher-lower', 'type-challenge', 'classic'].includes(gameMode);
  
  const errorsLeft = isInfiniteGame 
    ? '∞' 
    : MAX_ERRORS[gameMode] - (gameMode === 'hangman' ? hangmanState.errors : errors);
    
  return (
    <div className="game-container">
      <div className="game-content">      
        
        <GameHeader score={score} errorsLeft={errorsLeft} onBack={backToMenu} language={language} />

        {/* Modal de résultat (Caché pour les jeux infinis) */}
        {!isInfiniteGame && (
          <ResultModal
            gameState={gameState}
            currentPokemon={currentPokemon}
            gameMode={gameMode}
            errors={errors}
            onContinue={() => startGame(gameMode)}
            language={language}
          />
        )}

        {/* --- LES JEUX CLASSIQUES --- */}
        {gameMode === 'shadow' && (
          <ShadowGame 
            currentPokemon={currentPokemon} 
            gameState={gameState} 
            shadowBlur={shadowBlur} 
            language={language}
          />
        )}

        {gameMode === 'description' && (
          <DescriptionGame 
            currentPokemon={currentPokemon} 
            descriptionRevealLevel={descriptionRevealLevel} 
            language={language}  
          />
        )}

        {gameMode === 'type' && (
          <TypeGame
            currentPokemon={currentPokemon}
            selectedTypes={selectedTypes}
            wrongTypes={wrongTypes}
            correctlyGuessedTypes={correctlyGuessedTypes}
            onToggleType={toggleType}
            onSubmitGuess={submitTypeGuess}
            language={language}
          />
        )}

        {gameMode === 'hangman' && (
          <HangmanGame
            currentPokemon={currentPokemon}
            gameState={gameState}
            hangmanState={hangmanState}
            onSubmitLetter={submitLetter}
            language={language}
          />
        )}

        {/* --- LES NOUVEAUX JEUX --- */}
        {gameMode === 'memory' && (
          <PokemonMemory
            allPokemons={allPokemons}
            language={language}
            getPokemonName={getPokemonName}
            onWin={() => setScore(s => s + 50)} 
          />
        )}

        {gameMode === 'higher-lower' && (
          <HigherLower
            allPokemons={allPokemons}
            onWin={() => setScore(s => s + 10)}
            onLose={() => setScore(0)} 
            language={language}
          />
        )}

        {gameMode === 'type-challenge' && (
          <TypeChallenge
            allPokemons={allPokemons}
            onWin={() => setScore(s => s + 5)}
            language={language}
          />
        )}

        {gameMode === 'classic' && (
          <ClassicGame
            allPokemons={allPokemons}
            language={language}
            getPokemonName={getPokemonName}
            onWin={() => setScore(s => s + 20)}
          />
        )}


        {/* L'input de texte pour deviner (Uniquement pour Shadow et Description) */}
        {(gameMode === 'shadow' || gameMode === 'description') && gameState === 'playing' && (
          <div className="answer-section">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
              placeholder={t('searchPokemon', language)}
              className="guess-input"
              autoFocus
            />
            <button className="submit-button" onClick={submitGuess}>{t('validateButton', language)}</button>
          </div>
        )}

        {/* L'historique en bas de page (Caché pour les nouveaux jeux) */}
        {!isInfiniteGame && <HistoryBar history={history} language={language} />}

      </div>
    </div>
  )
}

export default PokemonGame
