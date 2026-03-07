import React from 'react';
import { t } from '../../i18n/translations';
import '../../styles/home/HomeHero.css';


const TABS = [
  { id: 'home',    labelKey: 'home' },
  { id: 'pokedex', labelKey: 'pokedex' },
  { id: 'games',   labelKey: 'miniGames' },
  { id: 'tactics', labelKey: 'tactics' },
];

const LANGUAGES = [
  { value: 'en',      label: 'EN' },
  { value: 'fr',      label: 'FR' },
  { value: 'de',      label: 'DE' },
  { value: 'es',      label: 'ES' },
  { value: 'it',      label: 'IT' },
  { value: 'ja',      label: 'JA' },
  { value: 'ko',      label: 'KO' },
  { value: 'zh-Hans', label: 'ZH' },
];


export default function HomeHero({ heroPokemons, onViewChange, currentView, selectedLanguage, onLanguageChange }) {
  return (
    <section className="hero-section">


      <div className="hero-floating-pokemon">
        {heroPokemons.map((pkmn, i) => (
          <div key={pkmn.id} className={`floating-pokemon fp-${i}`} style={{ animationDelay: `${i * 0.7}s` }}>
            <img src={pkmn.sprite} alt="" />
          </div>
        ))}
      </div>

      <div className="hero-grass">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`grass-blade grass-${i % 5}`}
            style={{ left: `${i * 5.2}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-badge">🌟 {t('welcome', selectedLanguage)}</div>
        <h1 className="hero-title">
          <span className="hero-title-poke">Poké</span>
          <span className="hero-title-world">World</span>
        </h1>
        <p className="hero-subtitle">{t('subtitle', selectedLanguage)}</p>
        <div className="hero-actions">
          <button className="cta-primary" onClick={() => onViewChange('games', 'classic')}>
            {t('launchSafari', selectedLanguage)}
          </button>
          <button className="cta-secondary" onClick={() => onViewChange('pokedex')}>
            {t('openPokedex', selectedLanguage)}
          </button>
        </div>
      </div>

      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
