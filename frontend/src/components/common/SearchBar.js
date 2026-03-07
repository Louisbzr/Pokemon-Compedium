import './SearchBar.css'
import { t } from '../../i18n/translations';

function SearchBar({ searchTerm, onSearchChange, language }) { 
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchPokemon', language)} 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && ( 
          <button 
            className="clear-button"
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
