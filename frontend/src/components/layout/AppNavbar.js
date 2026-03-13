import React, { useState, useEffect } from 'react';
import '../../styles/layout/AppNavbar.css';
import { t } from '../../i18n/translations';

export default function AppNavbar({ 
  currentView, 
  onViewChange, 
  language, 
  onLanguageChange, 
  menuOpen,        
  onMenuToggle,
  user,           
  onLogout,
  onAuthToggle,
}) {


  const [scrolled, setScrolled] = useState(false);

  const handleLangChange = (e) => onLanguageChange(e.target.value);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = (view) => {
    onViewChange(view);
    onMenuToggle(false);
  };

  return (
    <header className="poke-navbar">
      <div className="poke-navbar-inner">
        <button className="poke-logo" onClick={() => handleViewChange('home')}>
          <span className="logo-poke">Poké</span>
          <span className="logo-world">Morpho</span>
        </button>

        <button
          className={`burger-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => onMenuToggle(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`poke-nav-links ${menuOpen ? 'menu-open' : ''}`}>
          <button className={`poke-nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => handleViewChange('home')}>
            <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/other-item/escape-rope.png" alt="Home" className="nav-sprite" />
            {t('navHome', language)}
          </button>
          
          <button className={`poke-nav-link ${currentView === 'pokedex' ? 'active' : ''}`} onClick={() => handleViewChange('pokedex')}>
            <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/poke-radar.png" alt="Pokédex" className="nav-sprite" />
            {t('navPokedex', language)}
          </button>
          
          <button className={`poke-nav-link ${currentView === 'games' ? 'active' : ''}`} onClick={() => handleViewChange('games')}>
            <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/gb-sounds.png" alt="Games" className="nav-sprite"/>
            {t('navGames', language)}
          </button>
        </nav>

        <div className="poke-nav-right">
          <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/tm/dragon.png" alt="Lang" className="nav-sprite" />
          <select className="lang-select" value={language} onChange={handleLangChange}>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
            <option value="it">IT</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="zh-Hans">中文</option>
          </select>
          <div className="auth-section">
            {user ? (
              <div className="user-info">
                <span className="username">@{user.username}</span>
                <button className="logout-btn" onClick={onLogout}>❌</button>
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => {onAuthToggle(true);}} 
              >
                {t('authModal.loginTitle', language)}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
