import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
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
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  return (
    <header className="tts-header" role="banner">
      <h1 className="tts-title">
        {t('appTitle')}
      </h1>
    </header>
  );
};

export default Header; 