import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../context/SpeechContext';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import VoiceSelector from '../components/VoiceSelector/VoiceSelector';
import SpeedControl from '../components/SpeedControl/SpeedControl';
import { getVoiceDisplayName, getSpeedLabel } from '../utils/textUtils';
import { FaArrowLeft, FaSun, FaMoon, FaTrash, FaChevronRight } from 'react-icons/fa';

/**
 * Settings Page component for app configuration
 */
const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Global speech context
  const {
    speechRate,
    selectedVoice,
    handleVoiceSelect,
    handleSpeedChange
  } = useSpeech();
  
  // Local settings state
  const [voices, setVoices] = useState([]);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr')));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
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
  const handleVoiceSelectLocal = (voice) => {
    handleVoiceSelect(voice);
    setShowVoiceDropdown(false);
  };

  const handleSpeedChangeLocal = (newRate) => {
    handleSpeedChange(newRate);
    setShowSpeedDropdown(false);
  };

  const clearAllData = () => {
    if (window.confirm(t('settings.confirmClearData'))) {
      localStorage.removeItem('tts-history');
      localStorage.removeItem('tts-speech-rate');
      localStorage.removeItem('tts-selected-voice');
      localStorage.removeItem('tts-current-progress');
      localStorage.removeItem('tts-active-speech');
      localStorage.removeItem('tts-language');
      handleSpeedChange(1.0);
      handleVoiceSelect(null);
      alert(t('settings.dataCleared'));
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="tts-card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '16px',
              color: 'var(--text-secondary)'
            }}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {t('settings.title')}
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('settings.languageSelection')}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => changeLanguage('tr')}
                style={{
                  flex: 1,
                  background: currentLanguage === 'tr' ? 'var(--primary)' : 'var(--bg-light)',
                  color: currentLanguage === 'tr' ? 'white' : 'var(--text-primary)',
                  border: `1px solid ${currentLanguage === 'tr' ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🇹🇷 {t('settings.turkish')}
              </button>
              <button
                onClick={() => changeLanguage('en')}
                style={{
                  flex: 1,
                  background: currentLanguage === 'en' ? 'var(--primary)' : 'var(--bg-light)',
                  color: currentLanguage === 'en' ? 'white' : 'var(--text-primary)',
                  border: `1px solid ${currentLanguage === 'en' ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🇺🇸 {t('settings.english')}
              </button>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('settings.voiceSettings')}
            </h3>
            <div className="dropdown-container" style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                style={{
                  background: 'var(--bg-light)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {t('settings.selectedVoice')}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {getVoiceDisplayName(selectedVoice, t)}
                  </div>
                </div>
                <FaChevronRight 
                  style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '16px',
                    transform: showVoiceDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </div>
              
              {showVoiceDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px var(--shadow-light)',
                  zIndex: 1000,
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <div 
                    onClick={() => handleVoiceSelectLocal(null)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: !selectedVoice ? 'var(--bg-light)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = !selectedVoice ? 'var(--bg-light)' : 'transparent'}
                  >
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                      {t('voiceSelector.defaultVoice')}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {t('voiceSelector.systemDefault')}
                    </div>
                  </div>
                  {voices.map((voice, index) => (
                    <div 
                      key={voice.name}
                      onClick={() => handleVoiceSelectLocal(voice)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < voices.length - 1 ? '1px solid var(--border-light)' : 'none',
                        backgroundColor: selectedVoice?.name === voice.name ? 'var(--bg-light)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = selectedVoice?.name === voice.name ? 'var(--bg-light)' : 'transparent'}
                    >
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {getVoiceDisplayName(voice, t)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {voice.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Speed Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('speedControl.title')}
            </h3>
            <div className="dropdown-container" style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                style={{
                  background: 'var(--bg-light)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {t('settings.readingSpeed')}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {speechRate}x - {getSpeedLabel(speechRate, t)}
                  </div>
                </div>
                <FaChevronRight 
                  style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '16px',
                    transform: showSpeedDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </div>
              
              {showSpeedDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px var(--shadow-light)',
                  zIndex: 1000,
                  marginTop: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((rate, index) => (
                    <div 
                      key={rate}
                      onClick={() => handleSpeedChangeLocal(rate)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < 6 ? '1px solid var(--border-light)' : 'none',
                        backgroundColor: speechRate === rate ? 'var(--bg-light)' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = speechRate === rate ? 'var(--bg-light)' : 'transparent'}
                    >
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {rate}x
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {getSpeedLabel(rate, t)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Theme Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('settings.themeSelection')}
            </h3>
            <div 
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-light)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {t('settings.theme')}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {isDarkMode ? t('settings.dark') : t('settings.light')}
                </div>
              </div>
              <span style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                {isDarkMode ? <FaMoon /> : <FaSun />}
              </span>
            </div>
          </div>

          {/* Data Management */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('settings.dataManagement')}
            </h3>
            <div 
              onClick={clearAllData}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', color: 'var(--danger)', marginBottom: '4px' }}>
                  {t('settings.clearAllData')}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {t('settings.confirmClearData')}
                </div>
              </div>
              <FaTrash style={{ color: 'var(--danger)', fontSize: '18px' }} />
            </div>
          </div>

          {/* App Info */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('settings.about')}
            </h3>
            <div style={{
              background: 'var(--bg-light)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{t('settings.version')}:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>1.0.0</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Features:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>TTS, History, Progress</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{t('settings.language')}:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>Türkçe / English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 