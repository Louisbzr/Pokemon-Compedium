import './GenerationNav.css'


function GenerationNav(props) {
  return (
    <div className="generation-nav">
      <h2>Sélectionner une génération</h2>
      <div className="generation-buttons">
        <button
          className={props.selectedGen === 'all' ? 'active' : ''}
          onClick={() => props.onSelectGeneration('all')}
        >
          All
        </button>
        
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
          <button
            key={gen}
            className={props.selectedGen === gen ? 'active' : ''}
            onClick={() => props.onSelectGeneration(gen)}
          >
            Gen {gen}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenerationNav
