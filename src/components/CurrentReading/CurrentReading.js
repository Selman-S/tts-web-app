import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaBookOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CurrentReading.css';

/**
 * Displays current sentence with word highlight and navigation controls
 */
const CurrentReading = ({
  currentSentence,
  currentWord,
  wordStart,
  wordEnd,
  currentSentenceIndex,
  totalSentences,
  onPreviousSentence,
  onNextSentence
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  if (!currentSentence) return null;

  return (
    <div className="current-reading">
      <div className="reading-header">
        <span className="reading-label">
          <FaBookOpen className="reading-icon" />
          {t('currentReading.reading')}:
        </span>
        <span className="sentence-progress">
          {currentSentenceIndex + 1} {t('progressBar.of')} {totalSentences}
        </span>
      </div>
      <div className="sentence-container">
        {currentSentence.substring(0, wordStart)}
        {currentWord && <span className="highlighted-word">{currentWord}</span>}
        {currentSentence.substring(wordEnd)}
      </div>
      <div className="sentence-navigation">
        <button
          className={`nav-btn prev-btn ${currentSentenceIndex === 0 ? 'disabled' : ''}`}
          onClick={onPreviousSentence}
          disabled={currentSentenceIndex === 0}
          title={t('currentReading.previousSentence')}
          aria-label={t('currentReading.previousSentence')}
        >
          <FaChevronLeft />
        </button>
        <span className="nav-info">{t('currentReading.sentenceNavigation')}</span>
        <button
          className={`nav-btn next-btn ${currentSentenceIndex >= totalSentences - 1 ? 'disabled' : ''}`}
          onClick={onNextSentence}
          disabled={currentSentenceIndex >= totalSentences - 1}
          title={t('currentReading.nextSentence')}
          aria-label={t('currentReading.nextSentence')}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CurrentReading;
