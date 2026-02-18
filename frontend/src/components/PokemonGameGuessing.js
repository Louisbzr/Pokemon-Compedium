import './PokemonGameGuessing.css'
import { useState, useEffect } from 'react'

function PokemonGame({ language, getPokemonName, allPokemons }) {
  const [gameMode, setGameMode] = useState(null) 
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [userGuess, setUserGuess] = useState('')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [gameState, setGameState] = useState('playing') 
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [blurLevel, setBlurLevel] = useState(20)
  const [revealedColors, setRevealedColors] = useState([])
  const [descriptionWords, setDescriptionWords] = useState([])
  const [showMenu, setShowMenu] = useState(true)

  const MAX_HINTS = 2

  const startGame = async (mode) => {
    setGameMode(mode)
    setShowMenu(false)
    setHintsUsed(0)
    setGameState('playing')
    setUserGuess('')
    setBlurLevel(20)
    setRevealedColors([])
    setDescriptionWords([])
    
    // Sélectionner un Pokémon aléatoire
    const randomIndex = Math.floor(Math.random() * allPokemons.length)
    const pokemon = allPokemons[randomIndex]
    
    // Charger les détails du Pokémon
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
    const speciesData = await speciesResponse.json()
    
    const description = speciesData.flavor_text_entries.find(
      entry => entry.language.name === language
    )?.flavor_text.replace(/\f/g, ' ') || 'Aucune description disponible'
    
    setCurrentPokemon({
      ...pokemon,
      description: description,
      types: pokemon.types.map(t => t.type.name)
    })
  }

  const useHint = () => {
    if (hintsUsed >= MAX_HINTS || gameState !== 'playing') return

    setHintsUsed(hintsUsed + 1)

    switch (gameMode) {
      case 'blur':
        setBlurLevel(Math.max(0, blurLevel - 7))
        break
      
      case 'shadow':
        // Révéler progressivement l'image
        setBlurLevel(20 - (hintsUsed + 1) * 7)
        break
      
      case 'colors':
        // Révéler une couleur supplémentaire
        if (currentPokemon && revealedColors.length < currentPokemon.types.length) {
          setRevealedColors([...revealedColors, currentPokemon.types[revealedColors.length]])
        }
        break
      
      case 'description':
        // Révéler plus de mots de la description
        if (currentPokemon) {
          const words = currentPokemon.description.split(' ')
          const wordsToReveal = Math.ceil(words.length * 0.3 * (hintsUsed + 1))
          setDescriptionWords(words.slice(0, wordsToReveal))
        }
        break
    }
  }

  // Vérifier la réponse
  const checkAnswer = () => {
    if (!currentPokemon || !userGuess.trim()) return

    const correctName = getPokemonName(currentPokemon, language).toLowerCase()
    const guess = userGuess.toLowerCase().trim()

    if (guess === correctName || guess === currentPokemon.name.toLowerCase()) {
      setGameState('won')
      const points = Math.max(100 - (hintsUsed * 20), 20)
      setScore(score + points)
      setStreak(streak + 1)
    } else {
      setGameState('lost')
      setStreak(0)
    }
  }

  // Passer au Pokémon suivant
  const nextPokemon = () => {
    startGame(gameMode)
  }

  // Retour au menu
  const backToMenu = () => {
    setShowMenu(true)
    setGameMode(null)
    setCurrentPokemon(null)
    setScore(0)
    setStreak(0)
  }

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    }
    return typeColors[typeName] || '#68A090'
  }

  // Menu de sélection du mode de jeu
  if (showMenu) {
    return (
      <div className="game-container">
        <div className="game-menu">
          <h1>🎮 Devinez le Pokémon !</h1>
          <p className="game-subtitle">Choisissez votre mode de jeu</p>
          
          <div className="game-modes">
            <div className="game-mode-card" onClick={() => startGame('shadow')}>
              <div className="mode-icon">🌑</div>
              <h3>Ombre mystérieuse</h3>
              <p>Devinez le Pokémon à partir de son ombre</p>
            </div>

            <div className="game-mode-card" onClick={() => startGame('description')}>
              <div className="mode-icon">📖</div>
              <h3>Description cachée</h3>
              <p>Découvrez le Pokémon grâce à sa description</p>
            </div>

            <div className="game-mode-card" onClick={() => startGame('blur')}>
              <div className="mode-icon">🌫️</div>
              <h3>Image floutée</h3>
              <p>L'image est floue, saurez-vous deviner ?</p>
            </div>

            <div className="game-mode-card" onClick={() => startGame('colors')}>
              <div className="mode-icon">🎨</div>
              <h3>Couleurs & Types</h3>
              <p>Trouvez le Pokémon avec ses couleurs</p>
            </div>
          </div>

          {score > 0 && (
            <div className="total-score">
              <h2>Score total : {score} points</h2>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!currentPokemon) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <div className="spinner"></div>
          <p>Chargement du Pokémon...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={backToMenu}>← Menu</button>
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Série</span>
            <span className="stat-value">{streak} 🔥</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Indices</span>
            <span className="stat-value">{hintsUsed}/{MAX_HINTS}</span>
          </div>
        </div>
      </div>

      <div className="game-content">
        {/* Mode Ombre */}
        {gameMode === 'shadow' && (
          <div className="game-display">
            <h2>Qui est ce Pokémon ?</h2>
            <div className="pokemon-display shadow-mode">
              <img
                src={currentPokemon.sprite}
                alt="Pokemon"
                className="pokemon-image"
                style={{
                  filter: gameState === 'playing' 
                    ? `brightness(0) blur(${blurLevel}px)`
                    : 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Mode Description */}
        {gameMode === 'description' && (
          <div className="game-display">
            <h2>Lisez la description</h2>
            <div className="description-display">
              {gameState === 'playing' ? (
                <p className="hidden-description">
                  {descriptionWords.length > 0 
                    ? descriptionWords.join(' ') + '...'
                    : '??? ??? ??? ??? ???'}
                </p>
              ) : (
                <p>{currentPokemon.description}</p>
              )}
            </div>
            {gameState !== 'playing' && (
              <img src={currentPokemon.sprite} alt="Pokemon" className="revealed-image" />
            )}
          </div>
        )}

        {/* Mode Flou */}
        {gameMode === 'blur' && (
          <div className="game-display">
            <h2>Image mystérieuse</h2>
            <div className="pokemon-display blur-mode">
              <img
                src={currentPokemon.sprite}
                alt="Pokemon"
                className="pokemon-image"
                style={{
                  filter: gameState === 'playing' 
                    ? `blur(${blurLevel}px)`
                    : 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Mode Couleurs */}
        {gameMode === 'colors' && (
          <div className="game-display">
            <h2>Devinez avec les types</h2>
            <div className="colors-display">
              {gameState === 'playing' ? (
                <div className="type-hints">
                  {revealedColors.length === 0 ? (
                    <p className="hint-text">Utilisez un indice pour révéler un type !</p>
                  ) : (
                    <div className="revealed-types">
                      {revealedColors.map((type, index) => (
                        <div
                          key={index}
                          className="type-badge-large"
                          style={{ backgroundColor: getTypeColor(type) }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="reveal-section">
                  <img src={currentPokemon.sprite} alt="Pokemon" className="revealed-image" />
                  <div className="all-types">
                    {currentPokemon.types.map((type, index) => (
                      <div
                        key={index}
                        className="type-badge-large"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zone de réponse */}
        {gameState === 'playing' ? (
          <div className="answer-section">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Entrez le nom du Pokémon..."
              className="guess-input"
            />
            <div className="game-buttons">
              <button 
                className="hint-button"
                onClick={useHint}
                disabled={hintsUsed >= MAX_HINTS}
              >
                💡 Indice ({MAX_HINTS - hintsUsed} restants)
              </button>
              <button className="submit-button" onClick={checkAnswer}>
                Valider
              </button>
            </div>
          </div>
        ) : (
          <div className={`result-section ${gameState}`}>
            {gameState === 'won' ? (
              <>
                <h2 className="result-title">🎉 Bravo !</h2>
                <p className="result-text">
                  C'était bien <strong>{getPokemonName(currentPokemon, language)}</strong> !
                </p>
                <p className="points-earned">
                  +{Math.max(100 - (hintsUsed * 20), 20)} points
                </p>
              </>
            ) : (
              <>
                <h2 className="result-title">😢 Raté !</h2>
                <p className="result-text">
                  C'était <strong>{getPokemonName(currentPokemon, language)}</strong>
                </p>
                <img src={currentPokemon.sprite} alt="Pokemon" className="revealed-image" />
              </>
            )}
            <button className="next-button" onClick={nextPokemon}>
              Pokémon suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonGame
