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
        Text to Speech
      </h1>
    </header>
  );
};

export default Header; 