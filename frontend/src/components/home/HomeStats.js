import React, { useState, useEffect, useRef } from 'react';
import '../../styles/home/HomeStats.css';
import { t } from '../../i18n/translations';


const FEATURES_COUNT = 6;


// ============================================================
// Fond de sprites aléatoires
// ============================================================
function BackgroundSprites({ allPokemons }) {
  const [sprites, setSprites] = useState([]);

  const SPAWN_INTERVAL = 2000;
  const LIFE_TIME = 28000;

  // 6 lignes verticales
  const LANES = [15, 30, 45, 60, 75, 85]; // % hauteur

  useEffect(() => {
    if (!allPokemons?.length) return;

    const spawnSprite = () => {
      setSprites(prev => {

        // lignes déjà utilisées
        const usedLanes = prev.map(s => s.lane);

        // lignes dispo
        const availableLanes = LANES.filter(l => !usedLanes.includes(l));

        // si toutes prises, on autorise quand même
        const lane =
          availableLanes.length > 0
            ? availableLanes[Math.floor(Math.random() * availableLanes.length)]
            : LANES[Math.floor(Math.random() * LANES.length)];

        const random =
          allPokemons[Math.floor(Math.random() * allPokemons.length)];

        const newSprite = {
          id: `${random.id}-${Date.now()}`,
          sprite: random.sprite,
          lane
        };

        // suppression automatique
        setTimeout(() => {
          setSprites(current =>
            current.filter(s => s.id !== newSprite.id)
          );
        }, LIFE_TIME);

        return [...prev, newSprite];
      });
    };

    const interval = setInterval(spawnSprite, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [allPokemons]);

  return (
    <div className="stats-bg-sprites" aria-hidden="true">
      {sprites.map(sprite => (
        <img
          key={sprite.id}
          src={sprite.sprite}
          alt=""
          className="stats-bg-pokemon"
          style={{ top: `${sprite.lane}%` }}
        />
      ))}
    </div>
  );
}
// ============================================================
// Compteur animé standard
// ============================================================
function StatCounter({ icon, label, value, visible }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!visible || !value) return;
    let current = 0;
    const step = Math.ceil(value / 60);
    const iv = setInterval(() => {
      current += step;
      if (current >= value) { setDisplayed(value); clearInterval(iv); }
      else setDisplayed(current);
    }, 16);
    return () => clearInterval(iv);
  }, [visible, value]);

  return (
    <div className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-number">{displayed.toLocaleString()}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}


// ============================================================
// Pokémon défilant
// ============================================================
function ScrollingPokemon({ allPokemons, visible, lang }) {
  const [displayed, setDisplayed] = useState(0);
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Compteur animé
  useEffect(() => {
    if (!visible || !allPokemons?.length) return;

    const value = allPokemons.length;
    let currentVal = 0;
    const step = Math.ceil(value / 60);

    const iv = setInterval(() => {
      currentVal += step;
      if (currentVal >= value) {
        setDisplayed(value);
        clearInterval(iv);
      } else {
        setDisplayed(currentVal);
      }
    }, 16);

    return () => clearInterval(iv);
  }, [visible, allPokemons]);

  // Crossfade sprite
  useEffect(() => {
    if (!allPokemons?.length) return;

    const initial =
      allPokemons[Math.floor(Math.random() * allPokemons.length)];
    setCurrent(initial);

    const interval = setInterval(() => {
      const random =
        allPokemons[Math.floor(Math.random() * allPokemons.length)];

      const img = new Image();
      img.src = random.sprite;
      setNext(random);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrent(prev => random);   // update sans casser le DOM
        setIsTransitioning(false);

        // 👇 IMPORTANT : on supprime next APRÈS le repaint
        requestAnimationFrame(() => {
          setNext(null);
        });

      }, 600);

    }, 10000);

    return () => clearInterval(interval);
  }, [allPokemons]);

  return (
    <div className="stat-item">
      <div className="stat-pokemon-sprite crossfade-container">
        {current && (
          <img
            src={current.sprite}
            alt={current.name}
            title={current.name}
            className={`pokemon-img ${
              isTransitioning ? "fade-out" : "fade-in"
            }`}
          />
        )}

        {next && (
          <img
            src={next.sprite}
            alt={next.name}
            title={next.name}
            className="pokemon-img fade-in"
          />
        )}
      </div>

      <span className="stat-number">
        {displayed.toLocaleString()}
      </span>
      <span className="stat-label">
        {t('availablePokemons', lang)}
      </span>
    </div>
  );
}


// ============================================================
// Légendaire aléatoire
// ============================================================
function LegendaryCounter({ allPokemons, visible, lang }) {
  const [displayed, setDisplayed] = useState(0);
  const [current, setCurrent] = useState(null);
  const [next, setNext] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const LEGENDARY_IDS = [
    144,145,146,150,151,243,244,245,249,250,251,377,378,379,380,381,
    382,383,384,385,386,480,481,482,483,484,485,486,487,488,489,490,
    491,492,493,494,638,639,640,641,642,643,644,645,646,647,648,649,
    716,717,718,719,720,721,772,773,785,786,787,788,789,790,791,792,
    800,801,802,807,808,888,889,890,893,894,895,896,897,898,1001,1002,
    1003,1004,1007,1008,1014,1015,1016,1017,1024,1025
  ];

  const legendaries =
    allPokemons?.filter(p => LEGENDARY_IDS.includes(p.id)) || [];

  // Compteur
  useEffect(() => {
    if (!visible || !legendaries.length) return;
    const value = legendaries.length;
    let currentVal = 0;
    const step = Math.ceil(value / 60);
    const iv = setInterval(() => {
      currentVal += step;
      if (currentVal >= value) {
        setDisplayed(value);
        clearInterval(iv);
      } else {
        setDisplayed(currentVal);
      }
    }, 16);
    return () => clearInterval(iv);
  }, [visible, legendaries.length]);

  // Crossfade
  useEffect(() => {
    if (!legendaries.length) return;

    // initial
    setCurrent(
      legendaries[Math.floor(Math.random() * legendaries.length)]
    );

    const interval = setInterval(() => {
      const random =
        legendaries[Math.floor(Math.random() * legendaries.length)];

      setNext(random);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrent(random);
        setNext(null);
        setIsTransitioning(false);
      }, 600); // durée transition
    }, 10000);

    return () => clearInterval(interval);
  }, [legendaries.length]);

  return (
    <div className="stat-item">
      <div className="stat-legendary-sprite crossfade-container">
        {current && (
          <img
            src={current.sprite}
            alt={current.name}
            title={current.name}
            className={`legendary-img ${isTransitioning ? 'fade-out' : 'fade-in'}`}
          />
        )}
        {next && (
          <img
            src={next.sprite}
            alt={next.name}
            title={next.name}
            className="legendary-img fade-in"
          />
        )}
      </div>

      <span className="stat-number">
        {displayed.toLocaleString()}
      </span>
      <span className="stat-label">
        {t('legendaries', lang)}
      </span>
    </div>
  );
}


// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function HomeStats({ allPokemons, language }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById('stats-section');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalGenerations = allPokemons
    ? [...new Set(allPokemons.map(p => p.generation))].filter(Boolean).length
    : 0;

  return (
    <section className="stats-section" id="stats-section">

      <BackgroundSprites allPokemons={allPokemons} />

      <ScrollingPokemon allPokemons={allPokemons} visible={visible} lang={language} />
      <div className="stats-divider" />
      <StatCounter icon="🎮" label={t('miniGamesLabel', language)} value={FEATURES_COUNT} visible={visible} />
      <div className="stats-divider" />
      <LegendaryCounter allPokemons={allPokemons} visible={visible} lang={language} />

    </section>
  );
}
