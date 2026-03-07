export const getPokemonName = (pokemon, language) => {
  if (!pokemon.names?.length) return pokemon.name;

  const pokeapiLang = {
    'fr': 'fr', 'en': 'en', 'de': 'de', 'es': 'es', 
    'it': 'it', 'ja': 'ja', 'ko': 'ko', 
    'zh': 'zh-hans',      // Simplifié
    'zh-hans': 'zh-hans', // Simplifié
    'zh-hant': 'zh-hant'  // Traditionnel
  };
  
  const targetLang = pokeapiLang[language?.toLowerCase()] || 'en';
  return pokemon.names.find(n => n.language.name === targetLang)?.name || pokemon.name;
}



export const getStatValue = (pokemon, statName) => {
  const stat = pokemon.stats.find(s => s.stat.name === statName)
  return stat ? stat.base_stat : 0
}

export const getBackgroundByType = (typeName) => {
  const backgrounds = {
    all:      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    normal:   'linear-gradient(135deg, #A8A878 0%, #6D6D4E 100%)',
    fire:     'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    water:    'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
    electric: 'linear-gradient(135deg, #F8D030 0%, #EAB308 100%)',
    grass:    'linear-gradient(135deg, #78C850 0%, #48A068 100%)',
    ice:      'linear-gradient(135deg, #98D8D8 0%, #5DADE2 100%)',
    fighting: 'linear-gradient(135deg, #C03028 0%, #8B0000 100%)',
    poison:   'linear-gradient(135deg, #A040A0 0%, #6A1B9A 100%)',
    ground:   'linear-gradient(135deg, #E0C068 0%, #C19A6B 100%)',
    flying:   'linear-gradient(135deg, #A890F0 0%, #7E57C2 100%)',
    psychic:  'linear-gradient(135deg, #F85888 0%, #E91E63 100%)',
    bug:      'linear-gradient(135deg, #A8B820 0%, #7CB342 100%)',
    rock:     'linear-gradient(135deg, #B8A038 0%, #8D6E63 100%)',
    ghost:    'linear-gradient(135deg, #705898 0%, #512DA8 100%)',
    dragon:   'linear-gradient(135deg, #7038F8 0%, #5E35B1 100%)',
    dark:     'linear-gradient(135deg, #705848 0%, #3E2723 100%)',
    steel:    'linear-gradient(135deg, #B8B8D0 0%, #78909C 100%)',
    fairy:    'linear-gradient(135deg, #EE99AC 0%, #EC407A 100%)',
  }
  return backgrounds[typeName] || backgrounds.all
}
