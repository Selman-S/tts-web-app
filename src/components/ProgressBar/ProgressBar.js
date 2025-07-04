import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaBookOpen, FaClock, FaChartBar, FaBullseye } from 'react-icons/fa';
import './ProgressBar.css';

/**
 * Progress Bar component shows reading progress and statistics
 */
const ProgressBar = ({
  currentSentenceIndex,
  totalSentences,
  isSpeaking,
  isPaused,
  speechRate,
  totalWords,
  startTime,
  show = true
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);

  // Calculate progress percentage
  const progressPercentage = totalSentences > 0 
    ? Math.round((currentSentenceIndex / totalSentences) * 100) 
    : 0;

  // Calculate estimated reading time (average 200 WPM, adjusted by speech rate)
  const estimatedMinutes = totalWords > 0 
    ? Math.ceil(totalWords / (200 * speechRate))
    : 0;

  // Update elapsed time
  useEffect(() => {
    let interval = null;
    
    if (isSpeaking && !isPaused && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (!isSpeaking) {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking, isPaused, startTime]);

  // Calculate words per minute
  useEffect(() => {
    if (elapsedTime > 0 && currentSentenceIndex > 0) {
      const wordsRead = Math.round((currentSentenceIndex / totalSentences) * totalWords);
      const minutes = elapsedTime / 60;
      const wpm = Math.round(wordsRead / minutes);
      setWordsPerMinute(wpm || 0);
    } else {
      setWordsPerMinute(0);
    }
  }, [elapsedTime, currentSentenceIndex, totalSentences, totalWords]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!show || totalSentences === 0) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-header">
        <div className="progress-stats">
          <span className="stat-item">
            <FaBookOpen className="stat-icon" />
            <span className="stat-text">{currentSentenceIndex} {t('progressBar.of')} {totalSentences}</span>
          </span>
          <span className="stat-item">
            <FaClock className="stat-icon" />
            <span className="stat-text">{formatTime(elapsedTime)}</span>
          </span>
          <span className="stat-item">
            <FaChartBar className="stat-icon" />
            <span className="stat-text">{wordsPerMinute} {t('progressBar.wordsPerMinute')}</span>
          </span>
          <span className="stat-item">
            <FaBullseye className="stat-icon" />
            <span className="stat-text">~{estimatedMinutes}{t('progressBar.estimatedTime')}</span>
          </span>
        </div>
        <div className="progress-percentage">
          {progressPercentage}%
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        >
          <div className="progress-shine"></div>
        </div>
        <div className="progress-markers">
          {Array.from({ length: 4 }, (_, i) => (
            <div 
              key={i}
              className={`progress-marker ${progressPercentage >= (i + 1) * 25 ? 'active' : ''}`}
              style={{ left: `${(i + 1) * 25}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="progress-labels">
        <span className="progress-label start">{t('progressBar.elapsedTime')}</span>
        <span className="progress-label end">{formatTime(elapsedTime)} {t('progressBar.of')} {estimatedMinutes}:00</span>
      </div>
    </div>
  );
};

export default ProgressBar; 