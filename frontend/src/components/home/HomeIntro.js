import React, { useState, useEffect } from 'react';
import '../../styles/home/HomeIntro.css';
import professorOak from '../../assets/prof-oak.png';

const INTRO_KEY = 'pokeMorphoIntroSeen';  
const OAK_SPEECH = "Bienvenue dans le monde des Pokémon ! Ce vaste monde est peuplé de créatures extraordinaires. Certains les combattent, d'autres les élèvent, moi, je les étudie. Aujourd'hui, c'est votre tour de devenir un grand Dresseur !";

export default function HomeIntro({ onDone }) {
  const [phase, setPhase] = useState('press'); 
  const [oakText, setOakText] = useState('');

  useEffect(() => {
    const introSeen = localStorage.getItem(INTRO_KEY);
    if (introSeen) {
      setTimeout(onDone, 100);
      return;
    }
  }, [onDone]);

  useEffect(() => {
    if (phase !== 'oak') return;
    let i = 0;
    setOakText('');
    const iv = setInterval(() => {
      i++;
      setOakText(OAK_SPEECH.slice(0, i));
      if (i >= OAK_SPEECH.length) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, [phase]);

  const handleClick = () => {
    if (phase === 'press') {
      setPhase('oak');
    } else if (phase === 'oak' && oakText.length >= OAK_SPEECH.length) {
      setPhase('done');
      localStorage.setItem(INTRO_KEY, 'true');
      setTimeout(onDone, 600);
    }
  };

  return (
    <div
      className={`intro-screen ${phase === 'done' ? 'intro-exit' : ''}`}
      onClick={handleClick}
    >
      <div className="intro-bg-pokeballs">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`intro-pokeball pokeball-${i}`} />
        ))}
      </div>

      <div className="intro-content">
        {phase === 'press' && (
          <>
            <div className="intro-logo">
              <span className="logo-poke">Poké</span>
              <span className="logo-world">World</span>
            </div>
            <div className="intro-press-start">▶ APPUYEZ POUR COMMENCER</div>
            <div className="intro-version">Version 1.0</div>
          </>
        )}

        {(phase === 'oak' || phase === 'done') && (
          <div className="oak-dialogue">
            <div className="oak-portrait">
              <div className="oak-avatar">
                <img src={professorOak} alt="Professeur Chen" />
              </div>
              <div className="oak-name">Prof. Chen</div>
            </div>
            <div className="oak-text-box">
              <p>{oakText}</p>
              {oakText.length >= OAK_SPEECH.length && (
                <span className="dialogue-next">▼ Cliquez pour continuer</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
