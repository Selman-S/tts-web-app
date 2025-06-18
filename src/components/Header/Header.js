import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeech } from '../../context/SpeechContext';
import { useTranslation } from '../../translations';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import './Header.css';

/**
 * Header component with title and global speech controls
 */
const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  const {
    isSpeaking,
    isPaused,
    currentText,
    handlePause,
    handleResume,
    handleStop
  } = useSpeech();

  const showGlobalControls = isSpeaking || isPaused;

  return (
    <header className="tts-header" role="banner">
      {showGlobalControls && (
        <div className="header-controls">
          {isPaused ? (
            <button 
              onClick={handleResume}
              className="resume-btn"
              title={t('audioControls.resume')}
            >
              <FaPlay />
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="resume-btn"
              title={t('audioControls.pause')}
            >
              <FaPause />
            </button>
          )}
          <button 
            onClick={handleStop}
            className="resume-btn"
            title={t('audioControls.stop')}
          >
            <FaStop />
          </button>
        </div>
      )}
      
      <h1 className="tts-title">
        {t('appTitle')}
      </h1>
    </header>
  );
};

export default Header; 