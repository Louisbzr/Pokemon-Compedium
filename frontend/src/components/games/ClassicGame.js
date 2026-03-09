import { useState, useRef, useEffect } from 'react';
import { getPokemonName } from '../../utils/pokemonUtils';
import { getTypeName, getTypeColor, getTypeIcon } from '../../utils/typeIcons';
import { t } from '../../i18n/translations';
import '../../styles/games/ClassicGame.css';

function compareTypes(guessTypes, targetTypes) {
  const g = guessTypes.map(getTypeName);
  const tg = targetTypes.map(getTypeName);
  const commonCount = g.filter(t => tg.includes(t)).length;
  if (commonCount === tg.length && g.length === tg.length) return 'correct';
  if (commonCount > 0) return 'partial';
  return 'wrong';
}

function compareGeneration(guessGen, targetGen) {
  if (!guessGen || !targetGen) return { result: 'wrong', hint: '?' }
  if (guessGen === targetGen) return { result: 'correct', hint: null }

  const ROMAN = { i:1, ii:2, iii:3, iv:4, v:5, vi:6, vii:7, viii:8, ix:9 }
  const toNum = g => {
    const key = g?.replace('generation-', '').toLowerCase()
    return ROMAN[key] || 0
  }

  return {
    result: 'wrong',
    hint: toNum(guessGen) < toNum(targetGen) ? '+' : '-'
  }
}


function compareNumber(guessVal, targetVal) {
  if (guessVal === targetVal) return { result: 'correct', hint: null };
  return {
    result: 'wrong',
    hint: guessVal < targetVal ? '+' : '-'
  };
}

function compareSimple(guessVal, targetVal) {
  if (guessVal == null && targetVal == null) return 'correct'
  if (guessVal == null || targetVal == null) return 'unknown'
  return guessVal === targetVal ? 'correct' : 'wrong'
}
function computeComparison(guess, target) {
  return {
    types:         compareTypes(guess.types, target.types),
    generation:    compareGeneration(guess.generation, target.generation),
    color:         compareSimple(guess.color, target.color),
    shape:          compareSimple(guess.shape, target.shape), 
    evolutionStage: compareSimple(guess.evolutionStage, target.evolutionStage),
    height:        compareNumber(guess.height, target.height),
    weight:        compareNumber(guess.weight, target.weight),
  };
}

function TypeBadge({ type }) {
  const name = getTypeName(type);
  const icon = getTypeIcon(name);
  const color = getTypeColor(type);
  return (
    <span
      className="classic-type-badge"
      style={{ backgroundColor: color }}
      title={name}  
    >
      {icon
        ? <img src={icon} alt={name} className="classic-type-icon" />
        : <span>{name}</span> 
      }
    </span>
  );
}

function Cell({ result, hint, children }) {
  const state = typeof result === 'object' ? result?.result : result
  return (
    <div className={`classic-cell classic-cell--${state ?? 'unknown'}`}>
      {children}
      {hint && <span className="classic-hint">{hint}</span>}
    </div>
  )
}


function GuessRow({ guess, comparison, language }) {
  const evolutionLabels = { 0: '🥚', 1: 'I', 2: 'II', 3: 'III' }

  const genNumber = guess.generation?.replace('generation-', '').toUpperCase() || '?'

  return (
    <div className="classic-row">
      <div className="classic-cell classic-cell--name">
        <img src={guess.sprite} alt={guess.nameRef} className="classic-sprite" />
        <span>{getPokemonName(guess, language)}</span>
      </div>

      <Cell result={comparison.types.result ?? comparison.types}>
        <div className="classic-types">
          {guess.types.map((t, i) => <TypeBadge key={i} type={t} />)}
        </div>
      </Cell>

      <Cell result={comparison.generation.result} hint={comparison.generation.hint}>
        {genNumber}
      </Cell>

      <Cell result={comparison.color}>
        <span className="classic-color-dot" style={{ backgroundColor: guess.color }} />
        {t(`classic.color.${guess.color}`, language)}
      </Cell>

      <Cell result={comparison.shape}>
        <span>{t(`classic.shape.${guess.shape}`, language)}</span>
      </Cell>


      {/* ← evolutionLabels utilisé ici, dans le return */}
      <Cell result={comparison.evolutionStage}>
        {guess.evolutionStage != null
          ? (evolutionLabels[guess.evolutionStage] ?? guess.evolutionStage)
          : '…'}
      </Cell>

      <Cell result={comparison.height.result} hint={comparison.height.hint}>
        {(guess.height / 10).toFixed(1)}m
      </Cell>

      <Cell result={comparison.weight.result} hint={comparison.weight.hint}>
        {(guess.weight / 10).toFixed(1)}kg
      </Cell>
    </div>
  )
}

function HintPanel({ guessCount, targetPokemon, language, getPokemonName }) {
  const hints = [];
  const THRESHOLDS = [3, 6, 9, 12, 15, 18];
  const nextThreshold = THRESHOLDS.find(n => n > guessCount);

  if (guessCount >= 3) {
    const name = getPokemonName(targetPokemon, language);
    hints.push({
      label: t('classic.hint.firstLetter', language),
      value: name[0].toUpperCase(),
    });
  }

  if (guessCount >= 6) {
    hints.push({
      label: t('classic.hint.type', language),
      value: t(`types.${targetPokemon.types[0]?.type?.name}`, language),
    });
  }

  if (guessCount >= 9) {
    hints.push({
      label: t('classic.hint.generation', language),
      value: targetPokemon.generation?.replace('generation-', '').toUpperCase(),
    });
  }

  if (guessCount >= 12) {
    const evolutionLabels = { 0: '🥚 Baby', 1: 'I', 2: 'II', 3: 'III' };
    hints.push({
      label: t('classic.hint.evolutionStage', language),
      value: evolutionLabels[targetPokemon.evolutionStage] ?? targetPokemon.evolutionStage,
    });
  }

  if (guessCount >= 15) {
    const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${targetPokemon.id}.ogg`;
    hints.push({
      label: t('classic.hint.cry', language),
      value: null,
      cry: cryUrl,
    });
  }

  if (guessCount >= 18) {
    hints.push({
      label: t('classic.hint.silhouette', language),
      value: null,
      sprite: targetPokemon.sprite,
    });
  }

  return (
    <div className="classic-hints-panel">
      {/* Prochain indice */}
      {nextThreshold && (
        <div className="classic-hints-next">
          💡 {t('classic.hint.next', language, {
            remaining: nextThreshold - guessCount,
            s: language === 'de'
              ? (nextThreshold - guessCount > 1 ? 'en' : '')
              : (nextThreshold - guessCount > 1 ? 's' : '')
          })}
        </div>
      )}

      {/* Indices débloqués */}
      {hints.length > 0 && (
        <>
          <div className="classic-hints-list">
            {hints.map((hint, i) => (
              <div key={i} className="classic-hint-item">
                <span className="classic-hint-icon">{hint.icon}</span>
                <span className="classic-hint-label">{hint.label} :</span>
                {hint.sprite ? (
                  <img
                    src={hint.sprite}
                    alt="?"
                    className="classic-hint-silhouette"
                  />
                ) : hint.cry ? (
                  <audio controls src={hint.cry} className="classic-hint-cry" />
                ) : (
                  <strong className="classic-hint-value">{hint.value}</strong>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export default function ClassicGame({ allPokemons, language, getPokemonName, onWin }) {
  const [targetPokemon, setTargetPokemon] = useState(() => {
    return allPokemons[Math.floor(Math.random() * allPokemons.length)];
  });

  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const inputRef = useRef(null);
  

  useEffect(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) { setSuggestions([]); return; }

    const guessedIds = guesses.map(g => g.id); // ← calculé ici

    const results = allPokemons
      .filter(p => !guessedIds.includes(p.id))
      .filter(p => {
        const allNames = (p.names || []).map(n => n.name.toLowerCase());
        allNames.push(p.name.toLowerCase());
        return allNames.some(n => n.includes(query));
      })

    setSuggestions(results);
  }, [inputValue, guesses, allPokemons]);

  const resetGame = () => {
    setTargetPokemon(allPokemons[Math.floor(Math.random() * allPokemons.length)]);
    setGuesses([]);
    setInputValue('');
    setSuggestions([]);
    setGameState('playing');
    };

  const submitGuess = (pokemon) => {
    if (gameState !== 'playing') return;

    const nameRef = getPokemonName(pokemon, language).toUpperCase();
    const enrichedGuess = { ...pokemon, nameRef };
    const comparison = computeComparison(enrichedGuess, targetPokemon);

    const newGuesses = [{ pokemon: enrichedGuess, comparison }, ...guesses];
    setGuesses(newGuesses);
    setInputValue('');
    setSuggestions([]);

    const isWon = Object.values(comparison).every(v => {
      if (typeof v === 'string') return v === 'correct';
      return v.result === 'correct';
    });

    if (isWon) {
      setGameState('won');
      onWin?.();
    }
  };

  const COLUMNS = ['name', 'types', 'generation', 'color', 'shape', 'evolutionStage', 'height', 'weight'];

  return (
    <div className="classic-game">

      {/* Input autocomplete */}
      {gameState === 'playing' && (
        <div className="classic-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="guess-input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={t('searchPokemon', language)}
            autoFocus
          />
          {suggestions.length > 0 && (
            <ul className="classic-suggestions">
              {suggestions.map(p => (
                <li key={p.id} onClick={() => submitGuess(p)} className="classic-suggestion-item">
                  <img src={p.sprite} alt={p.name} />
                  <span>{getPokemonName(p, language)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Message victoire */}
      {gameState === 'won' && (
        <div className="classic-win-banner">
          <span>
            {t('classic.won', language, {
              name: getPokemonName(targetPokemon, language),
              count: guesses.length,
              s: language === 'de'
                ? (guesses.length > 1 ? 'e' : '')
                : (guesses.length > 1 ? 's' : '')
            })}
          </span>
          <button className="classic-replay-btn" onClick={resetGame}>
            {t('retryButton', language)}
          </button>
        </div>
      )}

      {/* Indices progressifs */}
      <HintPanel
        guessCount={guesses.length}
        targetPokemon={targetPokemon}
        language={language}
        getPokemonName={getPokemonName}
      />


      {/* En-tête tableau */}
      {guesses.length > 0 && (
        <div className="classic-table">
          <div className="classic-header">
            {COLUMNS.map(col => (
              <div key={col} className="classic-header-cell">
                {t(`classic.col.${col}`, language)}
              </div>
            ))}
          </div>

          {/* Lignes de résultats */}
          {guesses.map(({ pokemon, comparison }, i) => (
            <GuessRow
              key={i}
              guess={pokemon}
              comparison={comparison}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
}
