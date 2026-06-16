import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import { STORAGE_KEYS } from '../constants';
import { FaArrowLeft, FaSun, FaMoon, FaTrash, FaChevronRight } from 'react-icons/fa';
import './SettingsPage.css';

/**
 * Simplified Settings Page component for app configuration
 * Works directly with localStorage for simplified speech settings
 */
const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Local settings state
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);

  // Load voices and settings on mount
  useEffect(() => {
    const loadVoicesAndSettings = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Load speech rate
      const savedRate = localStorage.getItem(STORAGE_KEYS.SPEECH_RATE);
      if (savedRate) setSpeechRate(parseFloat(savedRate));

      const savedVoice = localStorage.getItem(STORAGE_KEYS.SELECTED_VOICE);
      if (savedVoice && availableVoices.length > 0) {
        try {
          const voiceData = JSON.parse(savedVoice);
          const voice = availableVoices.find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        } catch (e) {
          console.error('Error loading voice:', e);
        }
      }
    };

    loadVoicesAndSettings();
    window.speechSynthesis.onvoiceschanged = loadVoicesAndSettings;
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowVoiceDropdown(false);
        setShowSpeedDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Event handlers
  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    if (voice) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VOICE, JSON.stringify({ name: voice.name, lang: voice.lang }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_VOICE);
    }
    setShowVoiceDropdown(false);
    window.dispatchEvent(new Event('tts-settings-changed'));
  };

  const handleSpeedChange = (newRate) => {
    setSpeechRate(newRate);
    localStorage.setItem(STORAGE_KEYS.SPEECH_RATE, newRate.toString());
    setShowSpeedDropdown(false);
    window.dispatchEvent(new Event('tts-settings-changed'));
  };

  const getVoiceDisplayName = (voice) => {
    if (!voice) return t('voiceSelector.defaultVoice');
    return `${voice.name} (${voice.lang})`;
  };

  const getSpeedLabel = (rate) => t(`home.speedOptions.${rate}`) || `${rate}x`;

  const clearAllData = () => {
    if (window.confirm(t('settings.confirmClearData'))) {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem('tts-language');
      setSpeechRate(1.0);
      setSelectedVoice(null);
      window.dispatchEvent(new Event('tts-settings-changed'));
      window.dispatchEvent(new Event('tts-history-changed'));
      alert(t('settings.dataCleared'));
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="settings-page">
        <div className="page-header">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
            aria-label={t('nav.home')}
          >
            <FaArrowLeft />
          </button>
          <h1 className="page-title">⚙️ {t('settings.title')}</h1>
        </div>

        <div className="settings-content">
          
          {/* Theme Settings */}
          <div className="setting-section">
            <h3 className="section-title">🎨 {t('settings.themeSelection')}</h3>
            <div className="theme-buttons">
              <button onClick={toggleTheme} className={`theme-button ${isDarkMode ? 'active' : ''}`}>
                <FaMoon className="theme-icon" />
                <span>{t('settings.dark')}</span>
                {isDarkMode && <span className="active-indicator">✓</span>}
              </button>
              <button
                onClick={toggleTheme}
                className={`theme-button ${!isDarkMode ? 'active' : ''}`}
              >
                <FaSun className="theme-icon" />
                <span>{t('settings.light')}</span>
                {!isDarkMode && <span className="active-indicator">✓</span>}
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="setting-section">
            <h3 className="section-title">🌐 {t('settings.languageSelection')}</h3>
            <div className="language-buttons">
              <button
                onClick={() => changeLanguage('tr')}
                className={`language-button ${currentLanguage === 'tr' ? 'active' : ''}`}
              >
                🇹🇷 {t('settings.turkish')}
                {currentLanguage === 'tr' && <span className="active-indicator">✓</span>}
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`language-button ${currentLanguage === 'en' ? 'active' : ''}`}
              >
                🇺🇸 {t('settings.english')}
                {currentLanguage === 'en' && <span className="active-indicator">✓</span>}
              </button>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="setting-section">
            <h3 className="section-title">🎤 {t('settings.voiceSettings')}</h3>
            <div className="dropdown-container">
              <div 
                onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                className="dropdown-trigger"
              >
                <div className="dropdown-content">
                  <div className="dropdown-label">{t('settings.selectedVoice')}</div>
                  <div className="dropdown-value">{getVoiceDisplayName(selectedVoice)}</div>
                </div>
                <FaChevronRight className={`dropdown-arrow ${showVoiceDropdown ? 'open' : ''}`} />
              </div>
              
              {showVoiceDropdown && (
                <div className="dropdown-menu">
                  <div
                    onClick={() => handleVoiceSelect(null)}
                    className={`dropdown-item ${!selectedVoice ? 'active' : ''}`}
                  >
                    {t('voiceSelector.defaultVoice')}
                  </div>
                  {voices.map((voice, index) => (
                    <div
                      key={index}
                      onClick={() => handleVoiceSelect(voice)}
                      className={`dropdown-item ${selectedVoice?.name === voice.name ? 'active' : ''}`}
                    >
                      {voice.name} ({voice.lang})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Speed Settings */}
          <div className="setting-section">
            <h3 className="section-title">⚡ {t('settings.readingSpeed')}</h3>
            <div className="dropdown-container">
              <div 
                onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                className="dropdown-trigger"
              >
                <div className="dropdown-content">
                  <div className="dropdown-label">{t('settings.readingSpeed')}</div>
                  <div className="dropdown-value">{getSpeedLabel(speechRate)}</div>
                </div>
                <FaChevronRight className={`dropdown-arrow ${showSpeedDropdown ? 'open' : ''}`} />
              </div>
              
              {showSpeedDropdown && (
                <div className="dropdown-menu">
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((rate) => (
                    <div
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`dropdown-item ${speechRate === rate ? 'active' : ''}`}
                    >
                      {getSpeedLabel(rate)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Data Management */}
          <div className="setting-section">
            <h3 className="section-title">🗂️ {t('settings.dataManagement')}</h3>
            <button onClick={clearAllData} className="danger-button">
              <FaTrash className="button-icon" />
              <span>{t('settings.clearAllData')}</span>
            </button>
            <p className="danger-description">{t('settings.clearDataWarning')}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 