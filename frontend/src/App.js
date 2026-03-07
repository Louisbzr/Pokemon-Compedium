import './App.css';
import { useState } from 'react';
import { usePokemonFetch } from './hooks/usePokemonFetch';
import { getPokemonName, getBackgroundByType } from './utils/pokemonUtils';
import LoadingScreen from './components/layout/LoadingScreen';
import PokedexView from './components/views/PokedexView';
import PokemonGame from './components/games/PokemonGame';
import HomePage from './components/home/HomePage';
import AppNavbar from './components/layout/AppNavbar';

function App() {
  const [currentView, setCurrentView]         = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedPokemon, setSelectedPokemon]   = useState(null);
  const [menuOpen, setMenuOpen]                = useState(false); 
  const [initialGame, setInitialGame] = useState(null);

  const {
    pokemons,
    allPokemons,
    loading, loadingProgress,
    selectedGeneration, setSelectedGeneration,
    setFilters, setSortBy,
    searchTerm, setSearchTerm
  } = usePokemonFetch(selectedLanguage);

  const handleViewChange = (view, game = null) => {
    setInitialGame(game);
    setCurrentView(view);
  };


  return (
    <div className="App" data-menu-open={menuOpen}>
      <AppNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        language={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        menuOpen={menuOpen}
        onMenuToggle={setMenuOpen}  // ← AJOUTÉ ICI
      />

      <main className="main-content">
        {loading && currentView === 'pokedex' ? (
          <LoadingScreen progress={loadingProgress} />
        ) : (
          <>
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

            {currentView === 'games' && allPokemons.length > 0 && (
              <PokemonGame
                language={selectedLanguage}
                getPokemonName={getPokemonName}
                allPokemons={allPokemons}
                onViewChange={handleViewChange}
                initialGame={initialGame} 
              />
            )}

            {(currentView === 'games' || currentView === 'comparison' || currentView === 'tactics') && allPokemons.length === 0 && (
              <div style={{ textAlign: 'center', color: 'white', padding: '50px', fontSize: '1.3rem' }}>
                <p>⏳ Chargement des Pokémon en cours...</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
