import React from 'react';
import '../../styles/games/GameMenu.css';
import { t } from '../../i18n/translations';

const ITEM_ICONS = {
  shadow: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/other-item/odd-keystone.png',           // #117
  description: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/band-autograph.png',     // #338
  type: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/plate/draco.png',                        // #695
  hangman: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/cleanse-tag.png',           // #247
  memory: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/adventure-guide.png',         // #331
  'higher-lower': 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/mystery-egg.png',     // #451
  'type-challenge': 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/tr/dragon.png',              // #949
  safarizone: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/safari.png',                  // #33
  fallback: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/gb-sounds.png'              // #396
};

const GAME_MODES = [
  { id: 'shadow', titleKey: 'shadow', descriptionKey: 'shadowDesc' },
  { id: 'description', titleKey: 'description', descriptionKey: 'descriptionDesc' },
  { id: 'type', titleKey: 'type', descriptionKey: 'typeDesc' },
  { id: 'hangman', titleKey: 'hangman', descriptionKey: 'hangmanDesc' },
  { id: 'memory', titleKey: 'memory', descriptionKey: 'memoryDesc' },
  { id: 'higher-lower', titleKey: 'higherLower', descriptionKey: 'higherLowerDesc' },
  { id: 'type-challenge', titleKey: 'typeChallenge', descriptionKey: 'typeChallengeDesc', mode: 'arcade' },
  { id: 'classic', titleKey: 'PokeWordle', descriptionKey: 'classicGameDesc' }, 
];

function GameMenu({ onStartGame, onViewChange, language }) {
  return (
    <div className="game-container" style={{ padding: 0 }}>
      <div className="section-header">
        <div className="header-title">
          <img src={ITEM_ICONS.fallback} alt="Games" className="header-icon" />
          <h2>{t('gameModes', language)}</h2>
        </div>
        <p className="section-subtitle">{t('gameSubtitle', language)}</p>
      </div>

      <div className="game-modes">
        {GAME_MODES.map((mode) => (
          <div
            key={mode.id}
            className={`game-mode-card ${mode.mode === 'arcade' ? 'arcade-mode' : ''}`}
            onClick={() => onStartGame(mode.id)}
          >
            <img 
              src={ITEM_ICONS[mode.id] || ITEM_ICONS.fallback} 
              alt={`${mode.id} game`} 
              className="game-icon"
            />
            <h3>{t(mode.titleKey, language)}</h3>
            <p>{t(mode.descriptionKey, language)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameMenu;
