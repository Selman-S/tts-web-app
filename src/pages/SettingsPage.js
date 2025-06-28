import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
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
      const savedRate = localStorage.getItem('tts-speech-rate');
      if (savedRate) {
        setSpeechRate(parseFloat(savedRate));
      }

      // Load selected voice
      const savedVoice = localStorage.getItem('tts-selected-voice');
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
      localStorage.setItem('tts-selected-voice', JSON.stringify({
        name: voice.name,
        lang: voice.lang
      }));
    } else {
      localStorage.removeItem('tts-selected-voice');
    }
    setShowVoiceDropdown(false);
  };

  const handleSpeedChange = (newRate) => {
    setSpeechRate(newRate);
    localStorage.setItem('tts-speech-rate', newRate.toString());
    setShowSpeedDropdown(false);
  };

  const getVoiceDisplayName = (voice) => {
    if (!voice) return 'Varsayılan Ses';
    return `${voice.name} (${voice.lang})`;
  };

  const getSpeedLabel = (rate) => {
    const speedLabels = {
      0.5: '0.5x - Çok Yavaş',
      0.75: '0.75x - Yavaş',
      1.0: '1.0x - Normal',
      1.25: '1.25x - Hızlı',
      1.5: '1.5x - Çok Hızlı',
      1.75: '1.75x - Ultra Hızlı',
      2.0: '2.0x - Maksimum'
    };
    return speedLabels[rate] || `${rate}x`;
  };

  const clearAllData = () => {
    if (window.confirm('Tüm veriler silinecek. Emin misiniz?')) {
      localStorage.removeItem('tts-history');
      localStorage.removeItem('tts-speech-rate');
      localStorage.removeItem('tts-selected-voice');
      localStorage.removeItem('tts-current-text');
      localStorage.removeItem('tts-paused-time');
      localStorage.removeItem('tts-language');
      setSpeechRate(1.0);
      setSelectedVoice(null);
      alert('Tüm veriler temizlendi.');
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
            aria-label="Ana sayfaya dön"
          >
            <FaArrowLeft />
          </button>
          <h1 className="page-title">⚙️ Ayarlar</h1>
        </div>

        <div className="settings-content">
          
          {/* Theme Settings */}
          <div className="setting-section">
            <h3 className="section-title">🎨 Tema Ayarları</h3>
            <div className="theme-buttons">
              <button
                onClick={toggleTheme}
                className={`theme-button ${isDarkMode ? 'active' : ''}`}
              >
                <FaMoon className="theme-icon" />
                <span>Koyu Tema</span>
                {isDarkMode && <span className="active-indicator">✓</span>}
              </button>
              <button
                onClick={toggleTheme}
                className={`theme-button ${!isDarkMode ? 'active' : ''}`}
              >
                <FaSun className="theme-icon" />
                <span>Açık Tema</span>
                {!isDarkMode && <span className="active-indicator">✓</span>}
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="setting-section">
            <h3 className="section-title">🌐 Dil Ayarları</h3>
            <div className="language-buttons">
              <button
                onClick={() => changeLanguage('tr')}
                className={`language-button ${currentLanguage === 'tr' ? 'active' : ''}`}
              >
                🇹🇷 Türkçe
                {currentLanguage === 'tr' && <span className="active-indicator">✓</span>}
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`language-button ${currentLanguage === 'en' ? 'active' : ''}`}
              >
                🇺🇸 English
                {currentLanguage === 'en' && <span className="active-indicator">✓</span>}
              </button>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="setting-section">
            <h3 className="section-title">🎤 Ses Ayarları</h3>
            <div className="dropdown-container">
              <div 
                onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                className="dropdown-trigger"
              >
                <div className="dropdown-content">
                  <div className="dropdown-label">Seçili Ses</div>
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
                    Varsayılan Ses
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
            <h3 className="section-title">⚡ Hız Ayarları</h3>
            <div className="dropdown-container">
              <div 
                onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                className="dropdown-trigger"
              >
                <div className="dropdown-content">
                  <div className="dropdown-label">Okuma Hızı</div>
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
            <h3 className="section-title">🗂️ Veri Yönetimi</h3>
            <button
              onClick={clearAllData}
              className="danger-button"
            >
              <FaTrash className="button-icon" />
              <span>Tüm Verileri Temizle</span>
            </button>
            <p className="danger-description">
              Bu işlem tüm geçmiş kayıtlarınızı, ayarlarınızı ve duraklatılmış okuma oturumunuzu kalıcı olarak siler.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 