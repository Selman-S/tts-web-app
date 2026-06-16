import React from 'react';
import './Header.css';

/**
 * Simplified Header component with just the title
 * Removed global speech controls for simplified mobile experience
 */
const Header = () => {
  return (
    <header className="tts-header" role="banner">
      <h1 className="tts-title">🗣️ TTS Web App</h1>
    </header>
  );
};

export default Header; 