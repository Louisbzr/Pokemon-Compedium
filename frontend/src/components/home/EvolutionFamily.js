import React from 'react';
import { t } from '../../i18n/translations';

import {
  getTypeName,
  getTypeColor,
  getTypeIcon,
  getTypeDisplayName
} from '../../utils/typeIcons';

import '../../styles/home/EvolutionFamily.css';

export default function EvolutionFamily({
  pokemon,
  allPokemons,
  getPokemonName,
  language,
  onPokemonClick
}) {
  if (!pokemon || !Array.isArray(allPokemons)) return null;

  const chainId = pokemon.evolutionChainId;

  if (!chainId) return null;

  const family = allPokemons
    .filter((p) => p.evolutionChainId === chainId)
    .sort((a, b) => a.id - b.id);

  if (family.length <= 1) return null;

  return (
    <div className="evo-family">
      <div className="evo-family-title">
        {t('evolutionFamilyTitle', language)}
      </div>

      <div className="evo-family-chain">
        {family.map((member, index) => {
          const isActive = member.id === pokemon.id;
          const memberName = getPokemonName(member, language);

          return (
            <React.Fragment key={member.id}>
              <div
                className={`evo-member ${isActive ? 'evo-member-active' : ''}`}
                onClick={() => onPokemonClick && onPokemonClick(member)}
                title={`${memberName} - ${t('pokedexMemberTooltip', language)}`}
              >
                <div className="evo-member-number">
                  #{String(member.id).padStart(3, '0')}
                </div>

                <div className="evo-member-img-wrap">
                  <img
                    src={member.sprite}
                    alt={memberName}
                    loading="lazy"
                  />
                  {isActive && <div className="evo-member-glow" />}
                </div>

                <div className="evo-member-name">
                  {memberName}
                </div>

                {/* Types (couleur + icône) */}
                <div className="evo-member-types">
                  {(member.types || []).map((typeObj, typeIndex) => {
                    const typeKey = getTypeName(typeObj);
                    const typeColor = getTypeColor(typeObj);
                    const typeDisplayName = getTypeDisplayName(typeObj, language);
                    const typeIcon = getTypeIcon(typeKey);

                    return (
                      <span
                        key={`${typeKey}-${typeIndex}`}
                        className="evo-type-dot"
                        style={{ backgroundColor: typeColor }}
                        title={typeDisplayName}
                      />
                    );
                  })}
                </div>

                <div className="evo-member-total">
                  {t('totalStatsLabel', language, { total: member.totalStats || 0 })}
                </div>
              </div>

              {index < family.length - 1 && (
                <div className="evo-arrow">
                  <div className="evo-arrow-line" />
                  <span className="evo-arrow-icon">▶</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
