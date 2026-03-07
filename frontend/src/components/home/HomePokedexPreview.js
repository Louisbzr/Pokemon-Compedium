import React, { useState } from 'react';
import '../../styles/home/HomePokedexPreview.css';
import { getTypeName, getTypeColor } from '../../utils/typeIcons';
import { t } from '../../i18n/translations';
import PokemonFullPage from '../views/PokemonFullPage'; // adapte le chemin si besoin

export default function HomePokedexPreview({ previewPokemons, allPokemons, language, getPokemonName, onViewChange }) {
  const pokemonCount = allPokemons?.length || 0;
  const [fullPagePokemon, setFullPagePokemon] = useState(null);

  return (
    <section className="preview-section">
      <div className="section-header">
        <h2>{t('pokedexPreviewTitle', language)}</h2>
        <span className="section-subtitle">
          {t('pokedexPreviewSubtitle', language, { count: pokemonCount })}
        </span>
      </div>

      <div className="preview-grid">
        {previewPokemons.map(pkmn => (
          <div
            key={pkmn.id}
            className="preview-card"
            onClick={() => setFullPagePokemon(pkmn)} // ← changé
            title={getPokemonName(pkmn, language)}
          >
            <img src={pkmn.sprite} alt={pkmn.name} loading="lazy" />
            <div className="preview-name">{getPokemonName(pkmn, language)}</div>
            <div className="preview-types">
              {(pkmn.types || []).slice(0, 1).map(t => (
                <span
                  key={getTypeName(t)}
                  className="preview-type-dot"
                  style={{ background: getTypeColor(t) }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="see-all-btn"
        onClick={() => onViewChange('pokedex')}
      >
        {t('pokedexPreviewButton', language, { count: pokemonCount })}
      </button>

      {/* Fiche complète */}
      {fullPagePokemon && (
        <PokemonFullPage
          pokemonId={fullPagePokemon.id}
          language={language}
          allPokemons={allPokemons}
          onClose={() => setFullPagePokemon(null)}
        />
      )}
    </section>
  );
}
