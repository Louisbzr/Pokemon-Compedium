import React from 'react';
import '../../styles/home/FicheStrategique.css';
import { getTypeName, getTypeColor, getTypeIcon } from '../../utils/typeIcons';
import { t } from '../../i18n/translations';

const TYPE_CHART = {
  fire:     { strong: ['grass','bug','ice','steel'],           weak: ['water','rock','fire','dragon'] },
  water:    { strong: ['fire','ground','rock'],                weak: ['grass','electric','water'] },
  grass:    { strong: ['water','ground','rock'],               weak: ['fire','flying','poison','bug','ice','grass','dragon','steel'] },
  electric: { strong: ['water','flying'],                      weak: ['grass','electric','dragon'] },
  psychic:  { strong: ['fighting','poison'],                   weak: ['psychic','steel','dark'] },
  ice:      { strong: ['grass','ground','flying','dragon'],    weak: ['steel','fire','water','ice'] },
  dragon:   { strong: ['dragon'],                              weak: ['steel'] },
  dark:     { strong: ['ghost','psychic'],                     weak: ['fighting','dark','fairy'] },
  fairy:    { strong: ['fighting','dragon','dark'],            weak: ['poison','steel','fire'] },
  fighting: { strong: ['normal','ice','rock','dark','steel'],  weak: ['poison','flying','psychic','bug','fairy'] },
  flying:   { strong: ['grass','fighting','bug'],              weak: ['electric','rock','steel'] },
  poison:   { strong: ['grass','fairy'],                       weak: ['poison','ground','rock','ghost','steel'] },
  ground:   { strong: ['fire','electric','poison','rock','steel'], weak: ['grass','bug'] },
  rock:     { strong: ['fire','ice','flying','bug'],           weak: ['fighting','ground','steel'] },
  bug:      { strong: ['grass','psychic','dark'],              weak: ['fire','flying','rock','ghost','steel','poison','fairy'] },
  ghost:    { strong: ['ghost','psychic'],                     weak: ['normal','dark'] },
  steel:    { strong: ['ice','rock','fairy'],                  weak: ['fire','water','electric','steel'] },
  normal:   { strong: [],                                      weak: ['rock','steel'] },
};

const TYPE_IMMUNITIES = {
  normal: ['ghost'], ghost: ['normal','fighting'], ground: ['electric'],
  flying: ['ground'], dark: ['psychic'], steel: ['poison'], fairy: ['dragon'],
};

const ROLES = {
  attack:  { labelKey: 'roleAttack',   icon: '⚔️', color: '#F08030', evKey: 'ATK / Vit.',    natureKey: 'natureJovial',   itemKey: 'itemCeinture' },
  spAtk:   { labelKey: 'roleSpAtk',    icon: '✨', color: '#7038F8', evKey: 'Atk.Sp / Vit.', natureKey: 'natureModeste',  itemKey: 'itemLunette'  },
  defense: { labelKey: 'roleDefense',  icon: '🛡️', color: '#B8A038', evKey: 'PV / Déf.',     natureKey: 'natureImpudent', itemKey: 'itemRestes'   },
  spDef:   { labelKey: 'roleSpDef',    icon: '🔮', color: '#6890F0', evKey: 'PV / Dés.Sp',   natureKey: 'natureDoux',     itemKey: 'itemRestes'   },
  speed:   { labelKey: 'roleSpeed',    icon: '💨', color: '#F8D030', evKey: 'ATK / Vit.',    natureKey: 'natureTimide',   itemKey: 'itemFoulard'  },
  hp:      { labelKey: 'roleHp',       icon: '💪', color: '#78C850', evKey: 'PV / Déf.',     natureKey: 'naturePrudent',  itemKey: 'itemRestes'   },
};

const getTier = (ts) => {
  if (ts >= 680) return { label: 'Uber', color: '#7038F8', descKey: 'tierUberDesc' };
  if (ts >= 600) return { label: 'OU',   color: '#E53935', descKey: 'tierOUDesc'   };
  if (ts >= 500) return { label: 'UU',   color: '#F08030', descKey: 'tierUUDesc'   };
  if (ts >= 420) return { label: 'RU',   color: '#F8D030', descKey: 'tierRUDesc'   };
  return              { label: 'NU',   color: '#78C850', descKey: 'tierNUDesc'   };
};

function getStat(pokemon, key) {
  if (!pokemon) return 0;
  if (typeof pokemon[key] === 'number' && pokemon[key] > 0) return pokemon[key];
  
  if (Array.isArray(pokemon.stats)) {
    const aliases = {
      hp:      ['hp'],
      attack:  ['attack'],
      defense: ['defense'],
      speed:   ['speed'],
      spAtk:   ['special-attack', 'spatk', 'sp_atk', 'specialAttack', 'special_attack'],
      spDef:   ['special-defense', 'spdef', 'sp_def', 'specialDefense', 'special_defense'],
    };
    const names = aliases[key] || [key];
    const found = pokemon.stats.find(s => names.includes(s.stat?.name || s.name));
    if (found) return found.base_stat ?? found.value ?? 0;
  }
  
  const altKeys = {
    spAtk: ['specialAttack', 'sp_atk', 'special-attack', 'special_attack'],
    spDef: ['specialDefense', 'sp_def', 'special-defense', 'special_defense'],
  };
  if (altKeys[key]) {
    for (const alt of altKeys[key]) {
      if (typeof pokemon[alt] === 'number' && pokemon[alt] > 0) return pokemon[alt];
    }
  }
  return 0;
}

function analyzeTypes(pokemonTypes) {
  const defTypes = pokemonTypes.map(type => getTypeName(type));
  const weaknesses = [], resistances = [], immunities = [];

  defTypes.forEach(def => {
    (TYPE_IMMUNITIES[def] || []).forEach(atkType => {
      if (!immunities.includes(atkType)) immunities.push(atkType);
    });
  });

  Object.keys(TYPE_CHART).forEach(atkType => {
    if (immunities.includes(atkType)) return;
    let multiplier = 1;
    defTypes.forEach(def => {
      if (TYPE_CHART[atkType].strong.includes(def)) multiplier *= 2;
      if (TYPE_CHART[atkType].weak.includes(def))   multiplier *= 0.5;
    });
    if (multiplier >= 2)        weaknesses.push({ type: atkType, x: multiplier });
    else if (multiplier <= 0.5) resistances.push({ type: atkType, x: multiplier });
  });

  weaknesses.sort((a, b) => b.x - a.x);
  resistances.sort((a, b) => a.x - b.x);
  return { weaknesses, resistances, immunities };
}

export default function FicheStrategique({ pokemon, getPokemonName, language }) {
  if (!pokemon) return null;

  const hp      = getStat(pokemon, 'hp');
  const attack  = getStat(pokemon, 'attack');
  const defense = getStat(pokemon, 'defense');
  const speed   = getStat(pokemon, 'speed');
  const spAtk   = getStat(pokemon, 'spAtk');
  const spDef   = getStat(pokemon, 'spDef');
  const totalStats = pokemon.totalStats || (hp + attack + defense + speed + spAtk + spDef);

  const statMap     = { hp, attack, defense, speed, spAtk, spDef };
  const dominantStat = Object.entries(statMap).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const role        = ROLES[dominantStat] || ROLES.hp;
  const tier        = getTier(totalStats);

  const { weaknesses, resistances, immunities } = analyzeTypes(pokemon.types || []);

  return (
    <div className="fiche-strat">
      {/* HEADER */}
      <div className="fiche-header">
        <div className="fiche-title-block">
          <span className="fiche-title">{t('ficheTitle', language)}</span>
          <span className="fiche-pokemon-name">{getPokemonName(pokemon, language)}</span>
        </div>
        <span className="fiche-tier" style={{ background: tier.color }}>{tier.label}</span>
      </div>

      <p className="fiche-tier-desc">{t(tier.descKey, language)}</p>

      {/* RÔLE */}
      <div className="fiche-role" style={{ borderLeftColor: role.color }}>
        <span className="fiche-role-icon">{role.icon}</span>
        <div>
          <div className="fiche-role-sublabel">{t('recommendedRole', language)}</div>
          <div className="fiche-role-name" style={{ color: role.color }}>{t(role.labelKey, language)}</div>
        </div>
      </div>

      {/* BUILD */}
      <div className="fiche-build">
        {[
          { key: t('natureBuild', language), val: t(role.natureKey, language) },
          { key: t('evsBuild',    language), val: `252 ${role.evKey}`          },
          { key: t('itemBuild',   language), val: t(role.itemKey,  language)  },
        ].map(row => (
          <div key={row.key} className="fiche-build-row">
            <span className="fiche-build-key">{row.key}</span>
            <span className="fiche-build-val">{row.val}</span>
          </div>
        ))}
      </div>

      {/* STATS */}
      <div className="fiche-stats">
        {[
          { labelKey: 'statHp',    value: hp      },
          { labelKey: 'statAtk',   value: attack  },
          { labelKey: 'statDef',   value: defense },
          { labelKey: 'statSpAtk', value: spAtk   },
          { labelKey: 'statSpDef', value: spDef   },
          { labelKey: 'statSpeed', value: speed   },
        ].map(stat => (
          <div key={stat.labelKey} className="fiche-stat-row">
            <span className="fiche-stat-label">{t(stat.labelKey, language)}</span>
            <div className="fiche-stat-bar-bg">
              <div
                className="fiche-stat-bar-fill"
                style={{
                  width: `${Math.min(100, (stat.value / 255) * 100)}%`,
                  background: stat.value >= 110 ? '#4CAF50'
                              : stat.value >= 60  ? '#FFDE00'
                              : '#FF5252',
                }}
              />
            </div>
            <span className="fiche-stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* FAIBLESSES avec icônes */}
      {weaknesses.length > 0 && (
        <div className="fiche-type-section">
          <div className="fiche-type-label">{t('weaknesses', language)}</div>
          <div className="fiche-type-chips">
            {weaknesses.map(w => {
              const iconUrl = getTypeIcon(w.type);
              return (
                <span key={w.type} className="fiche-chip chip-weak" style={{ background: getTypeColor(w.type) }}>
                  {iconUrl && (
                    <img src={iconUrl} alt="" width="14" height="14" className="type-icon-small" />
                  )}
                  <span className="multiplier">×{w.x}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* RÉSISTANCES avec icônes */}
      {resistances.length > 0 && (
        <div className="fiche-type-section">
          <div className="fiche-type-label">{t('resistances', language)}</div>
          <div className="fiche-type-chips">
            {resistances.map(r => {
              const iconUrl = getTypeIcon(r.type);
              return (
                <span key={r.type} className="fiche-chip chip-resist" style={{ background: getTypeColor(r.type) }}>
                  {iconUrl && (
                    <img src={iconUrl} alt="" width="14" height="14" className="type-icon-small" />
                  )}
                  <span className="multiplier">×{r.x}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* IMMUNITÉS avec icônes */}
      {immunities.length > 0 && (
        <div className="fiche-type-section">
          <div className="fiche-type-label">{t('immunities', language)}</div>
          <div className="fiche-type-chips">
            {immunities.map(i => {
              const iconUrl = getTypeIcon(i);
              return (
                <span key={i} className="fiche-chip chip-immune" style={{ background: getTypeColor(i) }}>
                  {iconUrl && (
                    <img src={iconUrl} alt="" width="14" height="14" className="type-icon-small" />
                  )}
                  <span className="multiplier">×0</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
