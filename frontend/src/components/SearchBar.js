import './SearchBar.css'

function SearchBar(props) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search a Pokemon..."
          value={props.searchTerm}
          onChange={(e) => props.onSearchChange(e.target.value)}
        />
        {props.searchTerm && (
          <button 
            className="clear-button"
            onClick={() => props.onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
