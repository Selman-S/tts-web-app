import React from 'react';
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
  if (!currentSentence) return null;

  return (
    <div className="current-reading">
      <div className="reading-header">
        <span className="reading-label">Okunan:</span>
        <span className="sentence-progress">
          {currentSentenceIndex + 1} / {totalSentences}
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