import './App.css';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usePokemonFetch } from './hooks/usePokemonFetch';
import { getPokemonName } from './utils/pokemonUtils';
import LoadingScreen from './components/layout/LoadingScreen';
import PokedexView from './components/views/PokedexView';
import PokemonGame from './components/games/PokemonGame';
import HomePage from './components/home/HomePage';
import AppNavbar from './components/layout/AppNavbar';
import AuthModal from './components/AuthModal';
import ResetPassword from './components/ResetPassword';

function AppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  
  const [currentView, setCurrentView] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [initialGame, setInitialGame] = useState(null);
  const [resetData, setResetData] = useState(null);

  
  const {
    pokemons, allPokemons, loading: pokeLoading, loadingProgress,
    selectedGeneration, setSelectedGeneration,
    setFilters, setSortBy, searchTerm, setSearchTerm
  } = usePokemonFetch(selectedLanguage);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token && email) {
      setResetData({ token, email });
      setCurrentView('reset-password');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleViewChange = (view, game = null) => {
    setInitialGame(game);
    setCurrentView(view);
  };

  if (authLoading || pokeLoading) {
    return <LoadingScreen progress={loadingProgress || 0} />;
  }

  return (
    <div className="App" data-menu-open={menuOpen}>
      <AppNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        language={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        menuOpen={menuOpen}
        onMenuToggle={setMenuOpen}
        user={user}
        onLogout={logout}
        onAuthToggle={setIsAuthModalOpen}
      />
      
      <main className="main-content">
        {/* Home */}
        {currentView === 'home' && (
          <HomePage
            allPokemons={allPokemons}
            language={selectedLanguage}
            getPokemonName={getPokemonName}
            onViewChange={handleViewChange}
            currentView={currentView}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        )}

        {/* Pokedex */}
        {currentView === 'pokedex' && (
          <PokedexView
            pokemons={pokemons}
            selectedGeneration={selectedGeneration}
            setSelectedGeneration={setSelectedGeneration}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilters}
            onSortChange={setSortBy}
            language={selectedLanguage}
            getPokemonName={getPokemonName}
            selectedPokemon={selectedPokemon}
            onPokemonSelect={setSelectedPokemon}
          />
        )}

        {/* Games */}
        {currentView === 'games' && allPokemons.length > 0 && (
          <PokemonGame
            language={selectedLanguage}
            getPokemonName={getPokemonName}
            allPokemons={allPokemons}
            onViewChange={handleViewChange}
            initialGame={initialGame}
          />
        )}

        {/* ✅ ResetPassword (lien email + state) */}
        {currentView === 'reset-password' && resetData && (
          <ResetPassword
            token={resetData.token}
            email={resetData.email}
            onClose={() => {
              setCurrentView('home');
              setResetData(null);
            }}
            language={selectedLanguage}
          />
        )}

        {/* AuthModal */}
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            language={selectedLanguage}
          />
        )}

        {/* Fallback loading games */}
        {(currentView === 'games' || currentView === 'comparison' || currentView === 'tactics') 
         && allPokemons.length === 0 && (
          <div style={{ textAlign: 'center', color: 'white', padding: '50px', fontSize: '1.3rem' }}>
            <p>⏳ Chargement des Pokémon en cours...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
