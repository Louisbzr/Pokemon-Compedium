import { useState } from 'react';
import GenerationNav from '../GenerationNav';
import SearchBar from '../common/SearchBar';
import FilterBar from '../filters/FilterBar';
import PokemonCard from '../cards/PokemonCard';
import PokemonFullPage from './PokemonFullPage';

function PokedexView(props) {
  const {
    pokemons, allPokemons, selectedGeneration, setSelectedGeneration,
    searchTerm, onSearchChange,
    onFilterChange, onSortChange,
    language, getPokemonName,
  } = props;

  const [fullPagePokemon, setFullPagePokemon] = useState(null);

  return (
    <>
      <GenerationNav
        selectedGen={selectedGeneration}
        onSelectGeneration={setSelectedGeneration}
        language={language}
      />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        language={language}
      />
      <FilterBar
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        language={language}
      />

      <div className="pokemon-grid">
        {pokemons?.length > 0 ? (
          pokemons.map(pokemon => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              language={language}
              getPokemonName={getPokemonName}
              onClick={() => setFullPagePokemon(pokemon)}
            />
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: 'white',
            padding: '2rem',
            fontSize: '1.2rem'
          }}>
            {pokemons?.length === 0 ? 'Aucun Pokémon trouvé' : ''}
          </div>
        )}
      </div>

      {fullPagePokemon && (
        <PokemonFullPage
          pokemonId={fullPagePokemon.id}
          language={language}
          allPokemons={allPokemons}
          onClose={() => setFullPagePokemon(null)}
          onEvoClick={(id) => setFullPagePokemon({ id })}
        />
      )}
    </>
  );
}

export default PokedexView;
