import '../../styles/games/HistoryBar.css';
import { t } from '../../i18n/translations';

function HistoryBar({ history, language }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-bar">
      <h3>{t('historyTitle', language)}</h3>
      
      <div className="history-list">
        {history.map((item, index) => {
          const spriteUrl = item.pokemon ? item.pokemon.sprite : item.sprite;
          const isWon = item.won;

          return (
            <div 
              key={index} 
              className={`history-item ${isWon ? 'won' : 'lost'}`}
              title={isWon ? t('historyWin', language) : t('historyLose', language)}
            >
              {spriteUrl ? (
                <img src={spriteUrl} alt="pokemon" />
              ) : (
                <div className="no-sprite">?</div>
              )}

              <div className="history-status" aria-label={isWon ? t('historyWin', language) : t('historyLose', language)}>
                {isWon ? '✓' : '✕'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryBar;
