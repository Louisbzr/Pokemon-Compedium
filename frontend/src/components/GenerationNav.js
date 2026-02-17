function GenerationNav(props) {
  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  return (
    <div className="generation-nav">
      <h2>Select one generation</h2>
      <div className="generation-buttons">
        {generations.map((gen) => (
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
