import '../../styles/views/PokemonFullPage.css';
import { useState, useEffect, useRef } from 'react';
import { getTypeColor, getTypeDisplayName  } from '../../utils/typeIcons';
import { t } from '../../i18n/translations'; // ← ajout

const STAT_MAX = { hp: 255, attack: 190, defense: 230, 'special-attack': 194, 'special-defense': 230, speed: 200 };

// label passé en prop (traduit depuis le parent)
function StatBar({ name, base_stat, effort, label }) {
  const max = STAT_MAX[name] || 255;
  const pct = Math.min((base_stat / max) * 100, 100);
  const barColor = base_stat >= 100 ? '#4caf50' : base_stat >= 60 ? '#ff9800' : '#f44336';
  return (
    <div className="fp-stat-row">
      <span className="fp-stat-label">{label}</span>
      <span className="fp-stat-val">{base_stat}</span>
      <div className="fp-stat-bar-bg">
        <div className="fp-stat-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

function Badge({ label, color }) {
  return <span className="fp-badge" style={{ background: color || '#555' }}>{label}</span>;
}

function Section({ title, children }) {
  return (
    <div className="fp-section">
      <h2 className="fp-section-title">{title}</h2>
      <div className="fp-section-body">{children}</div>
    </div>
  );
}

function flattenChain(chain, depth = 0) {
  const nodes = [{ species: chain.species, details: chain.evolution_details, isBaby: chain.is_baby, depth }];
  (chain.evolves_to || []).forEach(next => nodes.push(...flattenChain(next, depth + 1)));
  return nodes;
}

function extractChainIds(chain) {
  const id = parseInt(chain.species.url.split('/').filter(Boolean).pop());
  const ids = [id];
  (chain.evolves_to || []).forEach(next => ids.push(...extractChainIds(next)));
  return ids;
}

// language passé en paramètre pour éviter le conflit avec t() importé
function formatEvolutionDetails(details, language) {
  if (!details || details.length === 0) return null;
  const d = details[0];
  const parts = [];
  if (d.min_level) parts.push(t('fp.evo.level', language, { level: d.min_level }));
  if (d.item) parts.push(t('fp.evo.useItem', language, { item: d.item.name }));
  if (d.held_item) parts.push(t('fp.evo.holdItem', language, { item: d.held_item.name }));
  if (d.trigger?.name === 'trade') parts.push(t('fp.evo.trade', language));
  if (d.min_happiness) parts.push(t('fp.evo.happiness', language, { value: d.min_happiness }));
  if (d.min_beauty) parts.push(t('fp.evo.beauty', language, { value: d.min_beauty }));
  if (d.min_affection) parts.push(t('fp.evo.affection', language, { value: d.min_affection }));
  if (d.known_move) parts.push(t('fp.evo.knownMove', language, { move: d.known_move.name }));
  if (d.known_move_type) parts.push(t('fp.evo.knownMoveType', language, { type: d.known_move_type.name }));
  if (d.location) parts.push(t('fp.evo.location', language, { location: d.location.name }));
  if (d.time_of_day) parts.push(t('fp.evo.timeOfDay', language, { time: d.time_of_day }));
  if (d.gender === 1) parts.push(t('fp.evo.femaleOnly', language));
  if (d.gender === 2) parts.push(t('fp.evo.maleOnly', language));
  if (d.needs_overworld_rain) parts.push(t('fp.evo.rain', language));
  if (d.turn_upside_down) parts.push(t('fp.evo.upsideDown', language));
  if (d.party_species) parts.push(t('fp.evo.partySpecies', language, { species: d.party_species.name }));
  if (d.party_type) parts.push(t('fp.evo.partyType', language, { type: d.party_type.name }));
  if (d.trade_species) parts.push(t('fp.evo.tradeSpecies', language, { species: d.trade_species.name }));
  if (parts.length === 0) parts.push(d.trigger?.name || '?');
  return parts.join(' · ');
}

export default function PokemonFullPage({ pokemonId, language = 'fr', allPokemons = [], onClose, onEvoClick }) {
  // TABS : key = valeur état, label = traduit
  const TABS = [
    { key: 'stats',      label: t('fp.tab.stats', language) },
    { key: 'capacités',  label: t('fp.tab.moves', language) },
    { key: 'sprites',    label: t('fp.tab.sprites', language) },
    { key: 'évolution',  label: t('fp.tab.evolution', language) },
    { key: 'pokédex',    label: t('fp.tab.pokedex', language) },
    { key: 'rencontres', label: t('fp.tab.encounters', language) },
    { key: 'langues',    label: t('fp.tab.languages', language) },
  ];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [moveFilter, setMoveFilter] = useState('level-up');
  const [flavorGame, setFlavorGame] = useState(null);
  const [showBurger, setShowBurger] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const tabsContainerRef = useRef(null);

  const normLang = (l) => {
    if (!l) return 'en';
    const lo = l.toLowerCase();
    if (lo === 'zh' || lo.startsWith('zh-')) return 'zh-hans';
    return lo;
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (!tabsContainerRef.current) return;
      const el = tabsContainerRef.current;
      setShowBurger(el.scrollWidth > el.clientWidth);
    };
    const timeout = setTimeout(checkOverflow, 100);
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (tabsContainerRef.current) resizeObserver.observe(tabsContainerRef.current);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    if (!pokemonId) return;
    fetchAll(pokemonId);
  }, [pokemonId, language]);

  const fetchAll = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const [pokemonRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ]);
      const pokemon = await pokemonRes.json();
      const species = await speciesRes.json();

      const [evoRes, encRes] = await Promise.all([
        fetch(species.evolution_chain.url),
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`),
      ]);
      const evoData = await evoRes.json();
      const encounters = await encRes.json();

      let evolvesFromName = null;
      if (species.evolves_from_species?.url) {
        const evoFromRes = await fetch(species.evolves_from_species.url);
        const evoFromData = await evoFromRes.json();
        const langKey = normLang(language);
        evolvesFromName =
          evoFromData.names.find(n => n.language.name === langKey)?.name ||
          evoFromData.names.find(n => n.language.name === 'en')?.name ||
          species.evolves_from_species.name;
      }

      const abilityDetails = await Promise.all(
        pokemon.abilities.map(async (a) => {
          const res = await fetch(a.ability.url);
          const d = await res.json();
          const langKey = normLang(language);
          const entry = d.flavor_text_entries.find(e => e.language.name === langKey)
            || d.flavor_text_entries.find(e => e.language.name === 'fr')
            || d.flavor_text_entries.find(e => e.language.name === 'en');
          const nameEntry = d.names.find(n => n.language.name === langKey)
            || d.names.find(n => n.language.name === 'fr')
            || d.names.find(n => n.language.name === 'en');
          return {
            ...a,
            displayName: nameEntry?.name || a.ability.name,
            description: entry?.flavor_text?.replace(/\f/g, ' ') || '',
          };
        })
      );

      const evoNodeIds = extractChainIds(evoData.chain);
      const evoNamesMap = {};
      await Promise.all(
        evoNodeIds.map(async (evoId) => {
          try {
            const [specRes, sprRes] = await Promise.all([
              fetch(`https://pokeapi.co/api/v2/pokemon-species/${evoId}`),
              fetch(`https://pokeapi.co/api/v2/pokemon/${evoId}`),
            ]);
            const specData = await specRes.json();
            const sprData = await sprRes.json();
            const langKey = normLang(language);
            const nameEntry =
              specData.names.find(n => n.language.name === langKey) ||
              specData.names.find(n => n.language.name === 'en');
            evoNamesMap[evoId] = {
              name: nameEntry?.name || specData.name,
              sprite: sprData.sprites.front_default,
            };
          } catch {
            evoNamesMap[evoId] = { name: String(evoId), sprite: null };
          }
        })
      );

      setData({ pokemon, species, evoData, encounters, abilityDetails, evolvesFromName, evoNamesMap });

      const langKey = normLang(language);
      const games = [...new Set(
        species.flavor_text_entries
          .filter(e => e.language.name === langKey)
          .map(e => e.version.name)
      )];
      setFlavorGame(games[0] || null);

    } catch (e) {
      setError(t('fp.error', language));
    } finally {
      setLoading(false);
    }
  };


  if (!pokemonId) return null;
  if (loading) return (
    <div className="fp-overlay">
      <div className="fp-modal fp-loading">
        <div className="fp-spinner" />
        <p>{t('fp.loading', language)}</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="fp-overlay">
      <div className="fp-modal"><p>{error}</p></div>
    </div>
  );

  const { pokemon, species, evoData, encounters, abilityDetails, evolvesFromName, evoNamesMap } = data;
  const lang = normLang(language);
  const displayName = species.names.find(n => n.language.name === lang)?.name || pokemon.name;
  const genus = species.genera.find(g => g.language.name === lang)?.genus || '';
  const primaryType = pokemon.types[0]?.type.name;
  const mainColor = getTypeColor(primaryType);
  const totalStats = pokemon.stats.reduce((s, st) => s + st.base_stat, 0);

  const sprites = [];
  const sp = pokemon.sprites;
  if (sp.front_default) sprites.push({ label: t('fp.sprite.normal', language), url: sp.front_default });
  if (sp.back_default) sprites.push({ label: t('fp.sprite.back', language), url: sp.back_default });
  if (sp.front_shiny) sprites.push({ label: t('fp.sprite.shiny', language), url: sp.front_shiny });
  if (sp.back_shiny) sprites.push({ label: t('fp.sprite.shinyBack', language), url: sp.back_shiny });
  if (sp.front_female) sprites.push({ label: t('fp.sprite.female', language), url: sp.front_female });
  if (sp.back_female) sprites.push({ label: t('fp.sprite.femaleBack', language), url: sp.back_female });
  if (sp.front_shiny_female) sprites.push({ label: t('fp.sprite.shinyFemale', language), url: sp.front_shiny_female });
  if (sp.other?.['official-artwork']?.front_default)
    sprites.push({ label: t('fp.sprite.officialArtwork', language), url: sp.other['official-artwork'].front_default, big: true });
  if (sp.other?.['official-artwork']?.front_shiny)
    sprites.push({ label: t('fp.sprite.officialArtworkShiny', language), url: sp.other['official-artwork'].front_shiny, big: true });
  if (sp.other?.home?.front_default)
    sprites.push({ label: t('fp.sprite.home', language), url: sp.other.home.front_default });
  if (sp.other?.home?.front_shiny)
    sprites.push({ label: t('fp.sprite.homeShiny', language), url: sp.other.home.front_shiny });
  if (sp.other?.showdown?.front_default)
    sprites.push({ label: t('fp.sprite.showdown', language), url: sp.other.showdown.front_default });
  if (sp.other?.showdown?.front_shiny)
    sprites.push({ label: t('fp.sprite.showdownShiny', language), url: sp.other.showdown.front_shiny });
  if (sp.other?.dream_world?.front_default)
    sprites.push({ label: t('fp.sprite.dreamWorld', language), url: sp.other.dream_world.front_default, svg: true });

  const genderRate = species.gender_rate;
  const genderText =
    genderRate === -1 ? t('fp.gender.neutral', language) :
    genderRate === 0  ? t('fp.gender.maleOnly', language) :
    genderRate === 8  ? t('fp.gender.femaleOnly', language) :
    t('fp.gender.ratio', language, {
      male: ((8 - genderRate) / 8 * 100).toFixed(1),
      female: (genderRate / 8 * 100).toFixed(1),
    });

  const eggGroups = species.egg_groups.map(eg => eg.name).join(', ');

  const moveMethods = [...new Set(pokemon.moves.flatMap(m => m.version_group_details.map(vg => vg.move_learn_method.name)))].sort();
  const movesByMethod = {};
  moveMethods.forEach(method => {
    movesByMethod[method] = pokemon.moves
      .filter(m => m.version_group_details.some(vg => vg.move_learn_method.name === method))
      .map(m => ({
        name: m.move.name,
        level: m.version_group_details.find(vg => vg.move_learn_method.name === method)?.level_learned_at || 0,
      }))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  });

  const flavorGames = [...new Set(species.flavor_text_entries.map(e => e.version.name))];
  const currentFlavors = species.flavor_text_entries
    .filter(e => e.version.name === flavorGame && e.language.name === lang);
  const flavorText = currentFlavors[0]?.flavor_text?.replace(/\f/g, ' ') || t('fp.flavor.noDesc', language);

  const evoNodes = flattenChain(evoData.chain);
  const pokedexNumbers = species.pokedex_numbers;

  const encountersByLocation = encounters.reduce((acc, enc) => {
    const loc = enc.location_area.name.replace(/-/g, ' ');
    if (!acc[loc]) acc[loc] = [];
    enc.version_details.forEach(vd => { acc[loc].push(vd.version.name); });
    return acc;
  }, {});

  const palPark = species.pal_park_encounters || [];
  const allNames = species.names;
  const varieties = species.varieties || [];
  const pastTypes = pokemon.past_types || [];

  return (
    <div className="fp-overlay" onClick={onClose}>
      <div className="fp-modal" onClick={e => e.stopPropagation()}>
        <button className="fp-close" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div className="fp-header" style={{ background: `linear-gradient(135deg, ${mainColor}cc, ${mainColor}44)` }}>
          <div className="fp-header-left">
            <p className="fp-number">N° {String(pokemon.id).padStart(4, '0')}</p>
            <h1 className="fp-name">{displayName}</h1>
            <p className="fp-genus">{genus}</p>
            <div className="fp-types">
              {pokemon.types.map(typ => (
                <Badge
                  key={typ.slot}
                  label={getTypeDisplayName(typ.type.name, language)}
                  color={getTypeColor(typ.type.name)}
                />
              ))}
            </div>
            <div className="fp-flags">
              {species.is_legendary && <Badge label={t('fp.badge.legendary', language)} color="#DAA520" />}
              {species.is_mythical && <Badge label={t('fp.badge.mythical', language)} color="#9b59b6" />}
              {species.is_baby && <Badge label={t('fp.badge.baby', language)} color="#e91e8c" />}
            </div>
          </div>
          <div className="fp-header-right">
            {sp.other?.['official-artwork']?.front_default
              ? <img className="fp-artwork" src={sp.other['official-artwork'].front_default} alt={displayName} />
              : <img className="fp-artwork" src={sp.front_default} alt={displayName} />}
          </div>
        </div>

        {/* QUICK INFO */}
        <div className="fp-quickinfo">
          <div className="fp-qi-item"><span>{t('fp.qi.height', language)}</span><strong>{(pokemon.height / 10).toFixed(1)} m</strong></div>
          <div className="fp-qi-item"><span>{t('fp.qi.weight', language)}</span><strong>{(pokemon.weight / 10).toFixed(1)} kg</strong></div>
          <div className="fp-qi-item"><span>{t('fp.qi.baseExp', language)}</span><strong>{pokemon.base_experience ?? '—'}</strong></div>
          <div className="fp-qi-item"><span>{t('fp.qi.captureRate', language)}</span><strong>{species.capture_rate}</strong></div>
          <div className="fp-qi-item"><span>{t('fp.qi.baseHappiness', language)}</span><strong>{species.base_happiness ?? '—'}</strong></div>
          <div className="fp-qi-item">
            <span>{t('fp.qi.growthRate', language)}</span>
            <strong>{species.growth_rate?.name ? t(`fp.qi.growthVal.${species.growth_rate.name}`, language) : '—'}</strong>
          </div>
          <div className="fp-qi-item">
            <span>{t('fp.qi.hatchSteps', language)}</span>
            <strong>
              {species.hatch_counter
                ? t('fp.qi.hatchStepsValue', language, { steps: (species.hatch_counter + 1) * 255 })
                : '—'}
            </strong>
          </div>
          <div className="fp-qi-item"><span>{t('fp.qi.gender', language)}</span><strong>{genderText}</strong></div>
          <div className="fp-qi-item">
            <span>{t('fp.qi.color', language)}</span>
            <strong>{species.color?.name ? t(`fp.qi.colorVal.${species.color.name}`, language) : '—'}</strong>
          </div>

          <div className="fp-qi-item">
            <span>{t('fp.qi.shape', language)}</span>
            <strong>{species.shape?.name ? t(`fp.qi.shapeVal.${species.shape.name}`, language) : '—'}</strong>
          </div>

          <div className="fp-qi-item">
            <span>{t('fp.qi.habitat', language)}</span>
            <strong>{species.habitat?.name ? t(`fp.qi.habitatVal.${species.habitat.name}`, language) : '—'}</strong>
          </div>
          <div className="fp-qi-item">
            <span>{t('fp.qi.generation', language)}</span>
            <strong>{species.generation?.name?.replace('generation-', '').toUpperCase() || '—'}</strong>
          </div>
          {species.evolves_from_species && (() => {
            const evoFromId = parseInt(
              species.evolves_from_species.url.split('/').filter(Boolean).pop()
            );
            const evoFrom = allPokemons.find(p => p.id === evoFromId);
          
            return (
              <div className="fp-qi-item">
                <span>{t('fp.qi.evolvesFrom', language)}</span>
                <strong>{evolvesFromName || species.evolves_from_species.name}</strong>
              </div>
            );
          })()}
          {species.has_gender_differences && (
            <div className="fp-qi-item"><span>{t('fp.qi.genderDiff', language)}</span><strong>{t('fp.qi.yes', language)}</strong></div>
          )}
          {species.forms_switchable && (
            <div className="fp-qi-item"><span>{t('fp.qi.switchableForms', language)}</span><strong>{t('fp.qi.yes', language)}</strong></div>
          )}
        </div>

        {/* TABS */}
        <div className="fp-tabs-wrapper">
          {showBurger && (
            <button className={`fp-burger-btn ${burgerOpen ? 'active' : ''}`} onClick={() => setBurgerOpen(!burgerOpen)}>
              <span></span><span></span><span></span>
            </button>
          )}
          <div className="fp-tabs fp-tabs-container" ref={tabsContainerRef}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`fp-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.key); setBurgerOpen(false); }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {showBurger && (
            <div className={`fp-tabs-dropdown ${burgerOpen ? 'active' : ''}`}>
              <ul>
                {TABS.map(tab => (
                  <li key={tab.key}>
                    <button
                      className={activeTab === tab.key ? 'active' : ''}
                      onClick={() => { setActiveTab(tab.key); setBurgerOpen(false); }}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="fp-tab-content">

          {/* TAB : STATS */}
          {activeTab === 'stats' && (
            <>
              <Section title={t('fp.section.baseStats', language)}>
                {pokemon.stats.map(s => (
                  <StatBar
                    key={s.stat.name}
                    name={s.stat.name}
                    base_stat={s.base_stat}
                    effort={s.effort}
                    label={t(`fp.stat.${s.stat.name}`, language)}
                  />
                ))}
                <div className="fp-stat-row fp-stat-total">
                  <span className="fp-stat-label">{t('fp.stat.total', language)}</span>
                  <span className="fp-stat-val">{totalStats}</span>
                  <div className="fp-stat-bar-bg">
                    <div className="fp-stat-bar-fill" style={{ width: `${Math.min((totalStats / 720) * 100, 100)}%`, background: mainColor }} />
                  </div>
                  <span className="fp-stat-effort" />
                </div>
              </Section>

              <Section title={t('fp.section.abilities', language)}>
                <div className="fp-ability-list">
                  {abilityDetails.map((a, i) => (
                    <div key={i} className={`fp-ability-card ${a.is_hidden ? 'hidden' : ''}`}>
                      <div className="fp-ability-header">
                        <strong>{a.displayName}</strong>
                        {a.is_hidden && <Badge label={t('fp.badge.hiddenAbility', language)} color="#607d8b" />}
                      </div>
                      <p className="fp-ability-desc">{a.description || '—'}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={t('fp.section.breeding', language)}>
                <div className="fp-info-grid">
                  <div className="fp-info-item"><span>{t('fp.breeding.eggGroups', language)}</span><strong>{eggGroups}</strong></div>
                  <div className="fp-info-item"><span>{t('fp.qi.gender', language)}</span><strong>{genderText}</strong></div>
                  <div className="fp-info-item">
                    <span>{t('fp.breeding.hatchCounter', language)}</span>
                    <strong>
                      {species.hatch_counter ?? '—'} {t('fp.breeding.cycles', language)} ({(species.hatch_counter + 1) * 255} {t('fp.breeding.steps', language)})
                    </strong>
                  </div>
                </div>
              </Section>

              {pastTypes.length > 0 && (
                <Section title={t('fp.section.pastTypes', language)}>
                  {pastTypes.map((pt, i) => (
                    <div key={i}>
                      <p className="fp-small-label">{t('fp.pastTypes.before', language, { gen: pt.generation.name })}</p>
                      <div className="fp-types">
                        {pt.types.map(typ => <Badge key={typ.slot} label={typ.type.name} color={getTypeColor(typ.type.name)} />)}
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              <Section title={t('fp.section.pokedexNumbers', language)}>
                <div className="fp-info-grid">
                  {pokedexNumbers.map((pn, i) => (
                    <div key={i} className="fp-info-item">
                      <span>{pn.pokedex.name.replace(/-/g, ' ')}</span>
                      <strong>#{pn.entry_number}</strong>
                    </div>
                  ))}
                </div>
              </Section>

              {varieties.length > 1 && (
                <Section title={t('fp.section.varieties', language)}>
                  <div className="fp-types">
                    {varieties.map((v, i) => (
                      <Badge
                        key={i}
                        label={v.pokemon.name + (v.is_default ? ` ${t('fp.badge.default', language)}` : '')}
                        color="#444"
                      />
                    ))}
                  </div>
                </Section>
              )}

              {palPark.length > 0 && (
                <Section title={t('fp.section.palPark', language)}>
                  <div className="fp-info-grid">
                    {palPark.map((pp, i) => (
                      <div key={i} className="fp-info-item">
                        <span>{pp.area.name}</span>
                        <strong>{t('fp.palPark.scoreRate', language, { score: pp.base_score, rate: pp.rate })}</strong>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section title={t('fp.section.gameIndices', language)}>
                <div className="fp-info-grid">
                  {pokemon.game_indices.map((gi, i) => (
                    <div key={i} className="fp-info-item">
                      <span>{gi.version.name}</span>
                      <strong>#{gi.game_index}</strong>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* TAB : CAPACITÉS */}
          {activeTab === 'capacités' && (
            <Section title={t('fp.section.movesTitle', language, { count: pokemon.moves.length })}>
              <div className="fp-method-tabs">
                {moveMethods.map(m => (
                  <button
                    key={m}
                    className={`fp-method-tab ${moveFilter === m ? 'active' : ''}`}
                    onClick={() => setMoveFilter(m)}
                  >{m.replace(/-/g, ' ')}</button>
                ))}
              </div>
              <div className="fp-moves-table">
                <div className="fp-moves-header">
                  {moveFilter === 'level-up' && <span>{t('fp.moves.level', language)}</span>}
                  <span>{t('fp.moves.move', language)}</span>
                </div>
                {movesByMethod[moveFilter]?.map((mv, i) => (
                  <div key={i} className="fp-move-row">
                    {moveFilter === 'level-up' && <span className="fp-move-level">{mv.level || '—'}</span>}
                    <span className="fp-move-name">{mv.name.replace(/-/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* TAB : SPRITES */}
          {activeTab === 'sprites' && (
            <Section title={t('fp.section.sprites', language)}>
              <div className="fp-sprites-grid">
                {sprites.map((s, i) => (
                  <div key={i} className={`fp-sprite-card ${s.big ? 'big' : ''}`}>
                    <img src={s.url} alt={s.label} className={s.svg ? 'fp-sprite-svg' : ''} />
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* TAB : ÉVOLUTION */}
          {activeTab === 'évolution' && (
            <Section title={t('fp.section.evoChain', language)}>
              <div className="fp-evo-chain">
                {evoNodes.map((node, i) => {
                  const id = parseInt(node.species.url.split('/').filter(Boolean).pop());
                  const evoInfo = evoNamesMap?.[id];
                  const name = evoInfo?.name || node.species.name;
                  const sprite = evoInfo?.sprite || null;
                  const evoCond = formatEvolutionDetails(node.details, language);
                  const isCurrent = id === pokemon.id; // ← Pokémon actuellement affiché
                  return (
                    <div key={i} className="fp-evo-node" style={{ marginLeft: `${node.depth * 10}px`, marginTop: '20px' }}>
                      {evoCond && <div className="fp-evo-arrow">↓ {evoCond}</div>}
                      <div
                        className={`fp-evo-pokemon ${!isCurrent ? 'fp-evo-clickable' : ''}`}
                        onClick={() => !isCurrent && onEvoClick?.(id)} // ← ajout
                      >
                        {sprite && <img src={sprite} alt={name} />}
                        <span>{name}</span>
                        <span className="fp-evo-id">#{String(id).padStart(4, '0')}</span>
                        {node.isBaby && <Badge label={t('fp.badge.babyEvo', language)} color="#e91e8c" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* TAB : POKÉDEX */}
          {activeTab === 'pokédex' && (
            <>
              <Section title={t('fp.section.pokedexDesc', language)}>
                <div className="fp-flavor-games">
                  {flavorGames.map(g => (
                    <button
                      key={g}
                      className={`fp-method-tab ${flavorGame === g ? 'active' : ''}`}
                      onClick={() => setFlavorGame(g)}
                    >{g.replace(/-/g, ' ')}</button>
                  ))}
                </div>
                <blockquote className="fp-flavor-text">{flavorText}</blockquote>
              </Section>

              <Section title={t('fp.section.cries', language)}>
                <div className="fp-cries">
                  {pokemon.cries?.latest && (
                    <div className="fp-cry">
                      <span>{t('fp.cries.latest', language)}</span>
                      <audio controls src={pokemon.cries.latest} />
                    </div>
                  )}
                  {pokemon.cries?.legacy && (
                    <div className="fp-cry">
                      <span>{t('fp.cries.legacy', language)}</span>
                      <audio controls src={pokemon.cries.legacy} />
                    </div>
                  )}
                </div>
              </Section>
            </>
          )}

          {/* TAB : RENCONTRES */}
          {activeTab === 'rencontres' && (
            <Section title={t('fp.section.encountersTitle', language, { count: Object.keys(encountersByLocation).length })}>
              {Object.keys(encountersByLocation).length === 0
                ? <p className="fp-empty">{t('fp.encounters.notWild', language)}</p>
                : (
                  <div className="fp-encounters">
                    {Object.entries(encountersByLocation).map(([loc, versions]) => (
                      <div key={loc} className="fp-encounter-row">
                        <span className="fp-enc-location">{loc}</span>
                        <div className="fp-enc-versions">
                          {[...new Set(versions)].map(v => <Badge key={v} label={v} color="#2196f3" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </Section>
          )}

          {/* TAB : LANGUES */}
          {activeTab === 'langues' && (
            <Section title={t('fp.section.languagesTitle', language, { count: allNames.length })}>
              <div className="fp-info-grid">
                {allNames.map((n, i) => (
                  <div key={i} className="fp-info-item">
                    <span>{n.language.name}</span>
                    <strong>{n.name}</strong>
                  </div>
                ))}
              </div>
            </Section>
          )}

        </div>
      </div>
    </div>
  );
}
