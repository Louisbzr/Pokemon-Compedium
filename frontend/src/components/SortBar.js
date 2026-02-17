import './Filter.css'

function SortBar(props) {
  return (
    <div className="sort-bar">
      <label>Trier par : </label>
      <select onChange={(e) => props.onSortChange(e.target.value)}>
        <option value="id">Numéro (ID)</option>
        <option value="name">Nom (A-Z)</option>
        <option value="name-desc">Nom (Z-A)</option>
        <option value="stats">Stats totales (↓)</option>
        <option value="stats-desc">Stats totales (↑)</option>
        <option value="hp">HP (↓)</option>
        <option value="hp-desc">HP (↑)</option>
        <option value="attack">Attaque (↓)</option>
        <option value="attack-desc">Attaque (↑)</option>
        <option value="defense">Défense (↓)</option>
        <option value="defense-desc">Défense (↑)</option>
        <option value="special-attack">Att. Spé. (↓)</option>
        <option value="special-attack-desc">Att. Spé. (↑)</option>
        <option value="special-defense">Déf. Spé. (↓)</option>
        <option value="special-defense-desc">Déf. Spé. (↑)</option>
        <option value="speed">Vitesse (↓)</option>
        <option value="speed-desc">Vitesse (↑)</option>
      </select>
    </div>
  )
}

export default SortBar

