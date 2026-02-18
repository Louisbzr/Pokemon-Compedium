import './Filter.css'
import { useState } from 'react'

function FilterBar(props) {
  const [type, setType] = useState('all')
  const [color, setColor] = useState('all')

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

  const handleTypeChange = (e) => {
    const newType = e.target.value
    setType(newType)
    props.onFilterChange({ type: newType, color: color })
  }

  const handleColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    props.onFilterChange({ type: type, color: newColor })
  }

  return (
    <div className="filter-bar">
      <div>
        <label>Type : </label>
        <select value={type} onChange={handleTypeChange}>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Color : </label>
        <select value={color} onChange={handleColorChange}>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
