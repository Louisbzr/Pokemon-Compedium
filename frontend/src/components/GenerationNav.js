import './GenerationNav.css';
import { t } from '../i18n/translations';

function GenerationNav({ selectedGen, onSelectGeneration, language }) {
  return (
    <div className="generation-nav">
      <h2>{t('selectGeneration', language)}</h2>
      <div className="generation-buttons">
        <button
          className={selectedGen === 'all' ? 'active' : ''}
          onClick={() => onSelectGeneration('all')}
        >
          {t('allGenerations', language)}
        </button>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
          <button
            key={gen}
            className={selectedGen === gen ? 'active' : ''}
            onClick={() => onSelectGeneration(gen)}
          >
            Gen {gen}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenerationNav;
