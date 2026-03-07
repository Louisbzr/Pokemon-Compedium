import './Filter.css'
import { useState } from 'react'
import { t } from '../../i18n/translations';

function FilterBar({ onFilterChange, onSortChange, language }) { 
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
    onFilterChange({ type: newType, color }) 
  }

  const handleColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    onFilterChange({ type, color: newColor }) 
  }

  return (
    <div className="filter-bar">
      <div>
        <label>{t('filterType', language)} : </label> 
        <select value={type} onChange={handleTypeChange}>
          {types.map((typeName) => (
            <option key={typeName} value={typeName}>
              {typeName === 'all' ? t('allGenerations', language) : t(typeName, language)} {/* ✅ Traduit */}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>{t('filterColor', language)} : </label>
        <select value={color} onChange={handleColorChange}>
          {colors.map((colorName) => (
            <option key={colorName} value={colorName}>
              {colorName === 'all' ? t('allGenerations', language) : t(colorName, language)} {/* ✅ Traduit */}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>{t('sortBy', language)} : </label>
        <select onChange={(e) => onSortChange(e.target.value)}>
          <option value="id">{t('sortNumber', language)}</option>
          <option value="name">{t('sortNameAsc', language)}</option>
          <option value="name-desc">{t('sortNameDesc', language)}</option>
          <option value="stats">{t('sortTotalStatsDesc', language)}</option>
          <option value="stats-desc">{t('sortTotalStatsAsc', language)}</option>
          <option value="hp">{t('sortHpDesc', language)}</option>
          <option value="hp-desc">{t('sortHpAsc', language)}</option>
          <option value="attack">{t('sortAttackDesc', language)}</option>
          <option value="attack-desc">{t('sortAttackAsc', language)}</option>
          <option value="defense">{t('sortDefenseDesc', language)}</option>
          <option value="defense-desc">{t('sortDefenseAsc', language)}</option>
          <option value="special-attack">{t('sortSpAtkDesc', language)}</option>
          <option value="special-attack-desc">{t('sortSpAtkAsc', language)}</option>
          <option value="special-defense">{t('sortSpDefDesc', language)}</option>
          <option value="special-defense-desc">{t('sortSpDefAsc', language)}</option>
          <option value="speed">{t('sortSpeedDesc', language)}</option>
          <option value="speed-desc">{t('sortSpeedAsc', language)}</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
