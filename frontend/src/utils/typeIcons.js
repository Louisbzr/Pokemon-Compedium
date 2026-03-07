// src/utils/typeIcons.js
import { t } from '../i18n/translations';

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
  electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

const TYPE_ICONS = {
  normal:   'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/normal.svg',
  fire:     'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg',
  water:    'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg',
  grass:    'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg',
  electric: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg',
  ice:      'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg',
  fighting: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fighting.svg',
  poison:   'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg',
  ground:   'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg',
  flying:   'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/flying.svg',
  psychic:  'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg',
  bug:      'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/bug.svg',
  rock:     'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg',
  ghost:    'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg',
  dragon:   'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg',
  dark:     'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dark.svg',
  steel:    'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/steel.svg',
  fairy:    'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fairy.svg',
};

export function getTypeName(t) {
  if (!t) return '';
  if (typeof t === 'string') return t.toLowerCase();
  if (t.type?.name) return t.type.name.toLowerCase();
  if (t.name) return t.name.toLowerCase();
  return '';
}

export function getTypeColor(t) {
  return TYPE_COLORS[getTypeName(t)] || '#777';
}

export function getTypeIcon(typeName) {
  return TYPE_ICONS[typeName] || null;
}

export function getTypeDisplayName(type, language = 'fr') {
  const englishKey = getTypeName(type);
  return t(`pokedexKeys.${englishKey}`, language);
}
