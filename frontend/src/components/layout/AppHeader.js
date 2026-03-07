function AppHeader({ selectedLanguage, onLanguageChange }) {
  return (
    <>
      <h1>Pokemon Compendium</h1>
      <div className="language-selector">
        <label>Language: </label>
        <select value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="it">Italiano</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="zh-Hans">简体中文</option>
        </select>
      </div>
    </>
  )
}

export default AppHeader
