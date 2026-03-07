import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/home/HomePage.css';
import HomeIntro from './HomeIntro';
import HomeHero from './HomeHero';
import HomeStats from './HomeStats';
import HomePokemonOfDay from './HomePokemonOfDay';
import HomeFeatures from './HomeFeatures';
import HomePokedexPreview from './HomePokedexPreview';

export default function HomePage({ 
  allPokemons, 
  language, 
  getPokemonName, 
  onViewChange, 
  currentView, 
  selectedLanguage, 
  onLanguageChange 
}) {
  const [showIntro, setShowIntro] = useState(true);  // ✅ Contrôlé par localStorage
  const [heroPokemons, setHeroPokemons] = useState([]);
  const [pokemonOfDay, setPokemonOfDay] = useState(null);
  const [previewPokemons, setPreviewPokemons] = useState([]);

  const dailySeed = useMemo(() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }, []);

  useEffect(() => {
    if (!allPokemons || allPokemons.length === 0) return;
    setPokemonOfDay(allPokemons[dailySeed % allPokemons.length]);
    setHeroPokemons([...allPokemons].sort(() => Math.random() - 0.5).slice(0, 8));
    setPreviewPokemons([...allPokemons].sort(() => Math.random() - 0.5).slice(0, 18));
  }, [allPokemons, dailySeed]);

  // ✅ SKIP INTRO si localStorage = true
  useEffect(() => {
    const introSeen = localStorage.getItem('pokeWorldIntroSeen');
    if (introSeen === 'true') {
      setShowIntro(false);
    }
  }, []);

  const handleIntroDone = () => {
    setShowIntro(false);
  };

  // ✅ RENDU CONDITIONNEL — clé du fix !
  if (showIntro) {
    return <HomeIntro onDone={handleIntroDone} />;
  }

  return (
    <div className="homepage">
      {/* Intro TERMINÉE → Contenu accueil */}
      <HomeHero
        heroPokemons={heroPokemons}
        onViewChange={onViewChange}
        currentView={currentView}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
      <HomeStats allPokemons={allPokemons} language={language} />
      <HomePokemonOfDay
        pokemonOfDay={pokemonOfDay}
        allPokemons={allPokemons}
        language={language}
        getPokemonName={getPokemonName}
        onViewChange={onViewChange}
      />
      <HomeFeatures 
        onViewChange={onViewChange}
        language={language}
      />
      <HomePokedexPreview
        previewPokemons={previewPokemons}
        allPokemons={allPokemons}
        language={language}
        getPokemonName={getPokemonName}
        onViewChange={onViewChange}
        
      />
      <footer className="homepage-footer">
        <div className="footer-pokeball" />
        <p>PokéWorld — Fan-made, non officiel. Pokémon © Nintendo / Game Freak.</p>
      </footer>
    </div>
  );
}
