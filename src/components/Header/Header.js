import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import './Header.css';

/**
 * Simplified Header component with just the title
 * Removed global speech controls for simplified mobile experience
 */
const Header = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  return (
    <header className="tts-header" role="banner">
      <h1 className="tts-title">
        🗣️ TTS Web App
      </h1>
    </header>
  );
};

export default Header; 