import React, { useState, useEffect } from 'react';
import '../../styles/games/DescriptionGame.css';
import { t } from '../../i18n/translations';

// Si tu veux lire PokéAPI dans DescriptionGame
function DescriptionGame({ currentPokemon, descriptionRevealLevel, language }) {
  const [apiDescription, setApiDescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalizeLangForPokeAPI = (lang) => {
      if (!lang) return 'en';
      const l = lang.toLowerCase();
      if (l === 'zh' || l.startsWith('zh-')) return 'zh-hans';
      return l;
    };

    const fetchDescription = async () => {
      try {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}`
        );
        const speciesData = await speciesResponse.json();

        const descriptionEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === normalizeLangForPokeAPI(language)
        );

        let desc = descriptionEntry?.flavor_text?.replace(/\f/g, ' ');

        if (!desc) {
          if (language.toLowerCase().startsWith('zh')) {
            desc = '暂无描述';
          } else {
            desc = 'Aucune description disponible';
          }
        }

        setApiDescription(desc);
        setLoading(false);
      } catch (error) {
        console.error('Erreur récupération description PokéAPI:', error);
        setLoading(false);
      }
    };

    if (currentPokemon?.id) {
      fetchDescription();
    }
  }, [currentPokemon?.id, language]);

  const renderDescription = () => {
    // Si l’API fonctionne, utilise la description PokéAPI
    if (apiDescription) {
      const words = apiDescription.split(' ');
      const percentage = Math.min(1, descriptionRevealLevel * 0.35);
      const limit = Math.ceil(words.length * percentage);
      return words.slice(0, limit).join(' ') + (percentage < 1 ? '...' : '');
    }

    // Sinon, tu peux garder ton ancienne logique (descriptions, description, t(...))
    const localizedDesc =
      currentPokemon?.descriptions?.[language] ||
      currentPokemon?.description ||
      t('descriptionDesc', language);

    if (!localizedDesc) return t('descriptionDesc', language);

    const words = localizedDesc.split(' ');
    const percentage = Math.min(1, descriptionRevealLevel * 0.35);
    const limit = Math.ceil(words.length * percentage);
    return words.slice(0, limit).join(' ') + (percentage < 1 ? '...' : '');
  };

  if (loading) {
    return (
      <div className="description-game-page">
        <p>Chargement de la description...</p>
      </div>
    );
  }

  return (
    <div className="description-game-page">
      <header className="description-header">
        <h1>{currentPokemon?.name || t('descriptionTitle', language)}</h1>
      </header>

      <main className="description-content">
        <div className="description-box">
          <p>"{renderDescription()}"</p>
        </div>
      </main>
    </div>
  );
}

export default DescriptionGame;
