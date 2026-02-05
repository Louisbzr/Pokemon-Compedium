function SortBar(props) {
  return (
    <div className="sort-bar">
      <label>Trier par : </label>
      <select onChange={(e) => props.onSortChange(e.target.value)}>
        <option value="id">Numéro (ID)</option>
        <option value="name">Nom (A-Z)</option>
        <option value="name-desc">Nom (Z-A)</option>
      </select>
    </div>
  )
}

export default SortBar
