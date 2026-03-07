// src/components/layout/AppNavigation.jsx
function AppNavigation({ currentView, onViewChange }) {
  const tabs = [
    { id: 'home',    label: '🏠 Accueil' },      // 👈 Ajouté en premier
    { id: 'pokedex', label: '📋 Pokédex' },
    { id: 'games',   label: '🎮 Mini-Jeux' },
    { id: 'tactics', label: '⚔️ Tactics (Nouveau)' },
  ];

  return (
    <div className="main-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => onViewChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AppNavigation;
