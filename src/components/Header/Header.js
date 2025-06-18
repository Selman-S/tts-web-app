import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getVoiceDisplayName, getSpeedLabel } from '../../utils/textUtils';
import './Header.css';

/**
 * Header component with title and control buttons
 * Includes theme toggle, speed control, voice selector, history, and resume buttons
 */
const Header = ({
  showSpeedControl,
  setShowSpeedControl,
  showVoiceSelector,
  setShowVoiceSelector,
  showHistory,
  setShowHistory,
  selectedVoice,
  speechRate,
  hasProgress,
  onResume
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="tts-header" role="banner">
      <h1 className="tts-title">
        <span role="img" aria-label="speaker">🗣️</span>
        Yazıyı Sese Çevir
      </h1>
      <div className="header-controls">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`${isDarkMode ? 'Açık' : 'Koyu'} moda geç`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button 
          className="speed-control-btn"
          onClick={() => setShowSpeedControl(!showSpeedControl)}
          title={`Hız: ${speechRate}x (${getSpeedLabel(speechRate)})`}
        >
          ⚡
        </button>
        <button 
          className="voice-selector-btn"
          onClick={() => setShowVoiceSelector(!showVoiceSelector)}
          title={`Ses: ${getVoiceDisplayName(selectedVoice)}`}
        >
          🎤
        </button>
        <button 
          className="history-btn"
          onClick={() => setShowHistory(!showHistory)}
          title="Geçmiş"
        >
          📝
        </button>
        {hasProgress && (
          <button 
            className="resume-btn"
            onClick={onResume}
            title="Kaldığınız yerden devam edin"
          >
            🔄
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 