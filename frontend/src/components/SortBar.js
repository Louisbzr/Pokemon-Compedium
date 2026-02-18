import './Filter.css'

function SortBar(props) {
  return (
    <div className="sort-bar">
      <label>Sort of : </label>
      <select onChange={(e) => props.onSortChange(e.target.value)}>
        <option value="id">Number (ID)</option>
        <option value="name">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="stats">Total statistics (↓)</option>
        <option value="stats-desc">Total statistics (↑)</option>
        <option value="hp">HP (↓)</option>
        <option value="hp-desc">HP (↑)</option>
        <option value="attack">Attack (↓)</option>
        <option value="attack-desc">Attack (↑)</option>
        <option value="defense">Defense (↓)</option>
        <option value="defense-desc">Defense (↑)</option>
        <option value="special-attack">Atk. Spe. (↓)</option>
        <option value="special-attack-desc">Atk. Spe. (↑)</option>
        <option value="special-defense">Def. Spe. (↓)</option>
        <option value="special-defense-desc">Def. Spe. (↑)</option>
        <option value="speed">Speed (↓)</option>
        <option value="speed-desc">Speed (↑)</option>
      </select>
    </div>
  )
}

export default SortBar

