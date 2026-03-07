function LoadingScreen({ progress }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '50vh', color: 'white'
    }}>
      <div style={{
        width: '60px', height: '60px',
        border: '5px solid rgba(255,255,255,0.3)',
        borderTop: '5px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: '600' }}>
        Loading the Pokémon... ⏳
      </p>
      {progress > 0 && (
        <>
          <div style={{
            marginTop: '15px', width: '300px', height: '20px',
            background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)',
              transition: 'width 0.3s ease', borderRadius: '10px'
            }} />
          </div>
          <p style={{ marginTop: '10px', fontSize: '1rem' }}>{progress}% chargés</p>
        </>
      )}
    </div>
  )
}

export default LoadingScreen
