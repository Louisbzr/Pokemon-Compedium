import './PokemonDetailModal.css'
import { useState, useEffect } from 'react'

function PokemonDetailModal({ pokemon, language, getPokemonName, onClose }) {
  const [detailedData, setDetailedData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetailedInfo()
  }, [pokemon])

  const fetchDetailedInfo = async () => {
    try {
      setLoading(true)
      
      // Récupérer les informations détaillées
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
      const speciesData = await speciesResponse.json()
      
      // Récupérer la chaîne d'évolution
      const evolutionResponse = await fetch(speciesData.evolution_chain.url)
      const evolutionData = await evolutionResponse.json()
      
      // Récupérer les descriptions en français
      const frenchDescription = speciesData.flavor_text_entries.find(
        entry => entry.language.name === language
      )?.flavor_text.replace(/\f/g, ' ') || 'Aucune description disponible'
      
      setDetailedData({
        species: speciesData,
        evolution: evolutionData,
        description: frenchDescription,
        genus: speciesData.genera.find(g => g.language.name === language)?.genus || '',
        habitat: speciesData.habitat?.name || 'Inconnu',
        captureRate: speciesData.capture_rate,
        baseHappiness: speciesData.base_happiness,
        growthRate: speciesData.growth_rate.name,
        eggGroups: speciesData.egg_groups.map(eg => eg.name)
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error)
      setLoading(false)
    }
  }

  const getEvolutionChain = (chain) => {
    const evolutionList = []
    let current = chain
    
    while (current) {
      const speciesName = current.species.name
      const speciesId = current.species.url.split('/').slice(-2, -1)[0]
      
      evolutionList.push({
        name: speciesName,
        id: speciesId,
        minLevel: current.evolution_details[0]?.min_level || null
      })
      
      current = current.evolves_to[0]
    }
    
    return evolutionList
  }

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    }
    return typeColors[typeName] || '#68A090'
  }

  if (!pokemon) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>
        
        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Chargement des détails...</p>
          </div>
        ) : (
          <div className="modal-body">
            {/* En-tête avec image et infos principales */}
            <div className="modal-header">
              <div className="pokemon-header-info">
                <h1>
                  {getPokemonName(pokemon, language)}
                  <span className="pokemon-number">N° {pokemon.id.toString().padStart(4, '0')}</span>
                </h1>
                <p className="pokemon-genus">{detailedData?.genus}</p>
                <div className="pokemon-types-modal">
                  {pokemon.types.map((typeInfo) => (
                    <span 
                      key={typeInfo.slot}
                      style={{ background: getTypeColor(typeInfo.type.name) }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pokemon-image-container">
                <img 
                  src={pokemon.sprite} 
                  alt={pokemon.name}
                  className="pokemon-modal-image"
                />
              </div>
            </div>

            {/* Description */}
            <div className="modal-section">
              <h2>Description</h2>
              <p className="pokemon-description">{detailedData?.description}</p>
            </div>

            {/* Informations générales */}
            <div className="modal-section">
              <h2>Informations générales</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Taille :</span>
                  <span className="info-value">{(pokemon.height || 0) / 10} m</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Poids :</span>
                  <span className="info-value">{(pokemon.weight || 0) / 10} kg</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Couleur :</span>
                  <span className="info-value">{pokemon.color}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Génération :</span>
                  <span className="info-value">{pokemon.generation}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Taux de capture :</span>
                  <span className="info-value">{detailedData?.captureRate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Bonheur de base :</span>
                  <span className="info-value">{detailedData?.baseHappiness}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Groupes d'œufs :</span>
                  <span className="info-value">{detailedData?.eggGroups.join(', ')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Habitat :</span>
                  <span className="info-value">{detailedData?.habitat}</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="modal-section">
              <h2>Statistiques de base</h2>
              <div className="stats-container">
                {pokemon.stats.map((statInfo) => (
                  <div key={statInfo.stat.name} className="stat-bar-container">
                    <div className="stat-info">
                      <span className="stat-name-modal">{statInfo.stat.name}</span>
                      <span className="stat-value-modal">{statInfo.base_stat}</span>
                    </div>
                    <div className="stat-bar-bg">
                      <div 
                        className="stat-bar-fill"
                        style={{ 
                          width: `${(statInfo.base_stat / 255) * 100}%`,
                          backgroundColor: getTypeColor(pokemon.types[0].type.name)
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="stat-bar-container total-stat">
                  <div className="stat-info">
                    <span className="stat-name-modal">Total</span>
                    <span className="stat-value-modal">{pokemon.totalStats}</span>
                  </div>
                  <div className="stat-bar-bg">
                    <div 
                      className="stat-bar-fill"
                      style={{ 
                        width: `${(pokemon.totalStats / 720) * 100}%`,
                        backgroundColor: '#667eea'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Chaîne d'évolution */}
            {detailedData?.evolution && (
              <div className="modal-section">
                <h2>Évolutions</h2>
                <div className="evolution-chain">
                  {getEvolutionChain(detailedData.evolution.chain).map((evo, index) => (
                    <div key={evo.id} className="evolution-item">
                      {index > 0 && (
                        <div className="evolution-arrow">
                          →
                          {evo.minLevel && <span className="evolution-level">Niv. {evo.minLevel}</span>}
                        </div>
                      )}
                      <div className="evolution-pokemon">
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                          alt={evo.name}
                        />
                        <p>{evo.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonDetailModal
