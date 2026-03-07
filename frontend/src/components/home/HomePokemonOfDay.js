// src/components/home/HomePokemonOfDay.jsx (section types corrigée)
import React, { useState } from 'react';
import '../../styles/home/HomePokemonOfDay.css';
import FicheStrategique from './FicheStrategique';
import EvolutionFamily from './EvolutionFamily';
import TypeBadge from '../common/TypeBadge';
import { getRandomBallUrl } from '../common/TypeBadge';
import { getTypeColor, getTypeIcon, getTypeDisplayName, getTypeName  } from '../../utils/typeIcons';
import { t } from '../../i18n/translations';

export default function HomePokemonOfDay({ pokemonOfDay, allPokemons, language, getPokemonName, onViewChange }) {
  const [ballUrl] = useState(() => getRandomBallUrl());

  if (!pokemonOfDay) return null;

  return (
    <section className="pod-section">
      <div className="section-header">
        <h2>
          <img
            src={ballUrl}
            alt="pokeball"
            className="pod-ball-icon"
            onError={(e) => console.error('Image failed to load:', e.target.src)}
          />
          {t('pokemonOfDay', language)}
        </h2>
        <span className="section-subtitle">{t('dailyRenewal', language)}</span>
      </div>

      <div className="pod-wrapper">
        <div className="pod-card">
          <div className="pod-bg-glow" style={{ background: getTypeColor(pokemonOfDay.types?.[0]) }} />

          <div className="pod-number">#{String(pokemonOfDay.id).padStart(3, '0')}</div>

          <img
            src={pokemonOfDay.spriteAnimated || pokemonOfDay.sprite}
            alt={getPokemonName(pokemonOfDay, language)}
            className="pod-sprite"
          />

          <h3 className="pod-name">{getPokemonName(pokemonOfDay, language)}</h3>

          {/* TYPES ✅ TRADUITS */}
          <div className="pod-types">
            {(pokemonOfDay.types || []).map((type, index) => {
              const typeEnglish = getTypeName(type);
              const typeDisplay = getTypeDisplayName(type, language);
              const iconUrl = getTypeIcon(typeEnglish);

              return (
                <div key={index} className="pod-type-item" style={{ background: getTypeColor(type) }}>
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      alt={typeDisplay}
                      width="16"
                      height="16"
                      className="pod-type-icon"
                    />
                  )}
                  <TypeBadge type={type} size="sm" language={language} />
                </div>
              );
            })}
          </div>

          <EvolutionFamily
            pokemon={pokemonOfDay}
            allPokemons={allPokemons}
            getPokemonName={getPokemonName}
            language={language}
            onViewChange={onViewChange}
          />
        </div>

        <FicheStrategique
          pokemon={pokemonOfDay}
          getPokemonName={getPokemonName}
          language={language}
        />
      </div>
    </section>
  );
}
