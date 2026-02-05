function FilterBar(props) {
  const types = [
    'all', 'normal', 'fire', 'water', 'grass', 'electric', 
    'ice', 'fighting', 'poison', 'ground', 'flying', 
    'psychic', 'bug', 'rock', 'ghost', 'dragon', 
    'dark', 'steel', 'fairy'
  ]
  
  const colors = [
    'all', 'black', 'blue', 'brown', 'gray', 'green', 
    'pink', 'purple', 'red', 'white', 'yellow'
  ]
  
  const generations = [
    'all', 'generation-i', 'generation-ii', 'generation-iii', 
    'generation-iv', 'generation-v', 'generation-vi', 
    'generation-vii', 'generation-viii', 'generation-ix'
  ]

  return (
    <div className="filter-bar">
      <div>
        <label>Type : </label>
        <select onChange={(e) => props.onFilterChange('type', e.target.value)}>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Couleur : </label>
        <select onChange={(e) => props.onFilterChange('color', e.target.value)}>
          {colors.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Génération : </label>
        <select onChange={(e) => props.onFilterChange('generation', e.target.value)}>
          {generations.map((gen) => (
            <option key={gen} value={gen}>{gen}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
