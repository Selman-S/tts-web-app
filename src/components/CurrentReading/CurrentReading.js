import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import './CurrentReading.css';

/**
 * Current Reading component displays the currently being read sentence
 * with word highlighting and progress information
 */
const CurrentReading = ({
  currentSentence,
  currentWord,
  wordStart,
  wordEnd,
  currentSentenceIndex,
  totalSentences
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  if (!currentSentence) return null;

  return (
    <div className="current-reading">
      <div className="reading-header">
        <span className="reading-label">{t('currentReading.reading')}:</span>
        <span className="sentence-progress">
          {currentSentenceIndex + 1} {t('progressBar.of')} {totalSentences}
        </span>
      </div>
      <div className="sentence-container">
        {currentSentence.substring(0, wordStart)}
        {currentWord && (
          <span className="highlighted-word">
            {currentWord}
          </span>
        )}
        {currentSentence.substring(wordEnd)}
      </div>
    </div>
  );
};

export default CurrentReading; 