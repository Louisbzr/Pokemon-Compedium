import '../../styles/games/GameHeader.css';
import { t } from '../../i18n/translations';

function GameHeader({ score, errorsLeft, onBack, language }) {
  return (
    <div className="game-header">
      <button className="back-button" onClick={onBack}>
        {t('quitButton', language)}
      </button>
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">{t('scoreLabel', language)}</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('attemptsLabel', language)}</span>
          <span className="stat-value">{errorsLeft}</span>
        </div>
      </div>
    </div>
  );
}

export default GameHeader;
