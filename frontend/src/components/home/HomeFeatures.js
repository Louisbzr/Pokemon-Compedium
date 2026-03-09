import React from 'react';
import '../../styles/home/HomeFeatures.css';
import { t } from '../../i18n/translations';

const FEATURES = [
  { 
    id: 'safari',       
    titleKey: 'featureSafari',
    descKey: 'featureSafariDesc',
    badgeKey: 'featureSafariBadge',
    badgeColor: '#4CAF50', 
    view: 'games',   
    game: 'classic',
    statsKey: 'featureSafariStats',
    icon: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/safari.png'
  },
  { 
    id: 'pokedex',      
    titleKey: 'featurePokedex',
    descKey: 'featurePokedexDesc',
    badgeKey: 'featurePokedexBadge',
    badgeColor: '#E53935', 
    view: 'pokedex', 
    statsKey: 'featurePokedexStats',
    icon: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/poke-radar.png'
  },
  { 
    id: 'quiz',         
    titleKey: 'featureQuiz',
    descKey: 'featureQuizDesc',
    badgeKey: 'featureComingSoon',
    badgeColor: '#9E9E9E', 
    view: null,     
    statsKey: 'featureQuizStats',
    icon: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/vs-recorder.png'
  },
  { 
    id: 'team-builder', 
    titleKey: 'featureTeamBuilder',
    descKey: 'featureTeamBuilderDesc',
    badgeKey: 'featureComingSoon',
    badgeColor: '#9E9E9E', 
    view: null,     
    statsKey: 'featureTeamStats',
    icon: 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/choice-band.png'
  },
];

const LOCK_CAPSULE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/lock-capsule.png';

export default function HomeFeatures({ onViewChange, language }) {
  return (
    <section className="features-section">
      <div className="section-header">
        <h2>{t('featuresTitle', language)}</h2>
        <span className="section-subtitle">{t('featuresSubtitle', language)}</span>
      </div>

      <div className="features-grid">
        {FEATURES.map(feature => (
          <div
            key={feature.id}
            className={`feature-card ${!feature.view ? 'feature-locked' : ''}`}
            onClick={() => feature.view && onViewChange(feature.view, feature.game)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                feature.view && onViewChange(feature.view);
              }
            }}
          >
            {/* Badge */}
            <div className="feature-badge" style={{ background: feature.badgeColor }}>
              {t(feature.badgeKey, language)}
            </div>

            {/* Icône sprite Pokémon */}
            <img 
              src={feature.icon}
              alt={t(feature.titleKey, language)} 
              className="feature-icon-img"
              style={{width: '56px', height: '56px', objectFit: 'contain'}}
              loading="lazy"
              onLoad={(e) => {
                if (e.target.naturalWidth < 10) {
                  e.target.src = feature.icon.replace('msikma/pokesprite', 'play.pokemonshowdown.com/sprites/berrybag').replace(/[^\/]+$/, 'safariball.png');
                }
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Titre */}
            <h3 className="feature-title">{t(feature.titleKey, language)}</h3>

            {/* Description */}
            <p className="feature-desc">{t(feature.descKey, language)}</p>

            {/* Footer */}
            <div className="feature-footer">
              <span className="feature-stats">
                📊 {t(feature.statsKey, language)}
              </span>
              {feature.view ? (
                <span className="feature-play">
                  {t('featurePlay', language)}
                </span>
              ) : (
                <span className="feature-soon">
                  <img 
                    src={LOCK_CAPSULE}
                    alt="🔒"
                    className="locked-icon"
                    loading="lazy"
                  />
                  {t('featureComingSoon', language)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
