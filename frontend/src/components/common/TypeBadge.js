// src/components/common/TypeBadge.jsx
import React from 'react';
import { getTypeName, getTypeColor, getTypeDisplayName } from '../../utils/typeIcons';
import '../../styles/common/TypeBadge.css';

const BALL_BASE_URL = 'https://cdn.jsdelivr.net/gh/msikma/pokesprite@master/items/ball';

export const POKEBALLS = [
  'poke', 'great', 'ultra', 'master', 'safari',
  'fast', 'level', 'lure', 'heavy', 'love',
  'friend', 'moon', 'sport', 'net', 'dive',
  'nest', 'repeat', 'timer', 'luxury', 'premier',
  'dusk', 'heal', 'quick', 'cherish', 'park',
  'dream', 'beast',
];

export function getRandomBallUrl() {
  const ball = POKEBALLS[Math.floor(Math.random() * POKEBALLS.length)];
  return `${BALL_BASE_URL}/${ball}.png`;
}

export default function TypeBadge({ type, size = 'md', language = 'fr' }) {
  const englishKey = getTypeName(type);
  const displayName = getTypeDisplayName(type, language);
  const color = getTypeColor(type);
  
  return (
    <span 
      className={`type-badge type-badge-${size}`} 
      style={{ background: color }} 
      title={displayName}
    >
      <span className="type-badge-label">{displayName.toUpperCase()}</span>
    </span>
  );
}
