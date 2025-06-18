import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import VoiceSelector from '../components/VoiceSelector/VoiceSelector';
import SpeedControl from '../components/SpeedControl/SpeedControl';
import { getVoiceDisplayName, getSpeedLabel } from '../utils/textUtils';

/**
 * Settings Page component for app configuration
 */
const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Settings state
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);

  // Load voices and settings on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr')));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load saved settings
    const savedRate = localStorage.getItem('tts-speech-rate');
    if (savedRate) {
      try {
        const rate = parseFloat(savedRate);
        if (rate >= 0.5 && rate <= 2.0) {
          setSpeechRate(rate);
        }
      } catch (e) {
        console.error('Error loading speech rate:', e);
      }
    }

    const savedVoice = localStorage.getItem('tts-selected-voice');
    if (savedVoice) {
      try {
        const voiceData = JSON.parse(savedVoice);
        setTimeout(() => {
          const voice = window.speechSynthesis.getVoices().find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        }, 100);
      } catch (e) {
        console.error('Error loading voice:', e);
      }
    }
  }, []);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('tts-speech-rate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('tts-selected-voice', JSON.stringify({
        name: selectedVoice.name,
        lang: selectedVoice.lang
      }));
    }
  }, [selectedVoice]);

  // Event handlers
  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setShowVoiceSelector(false);
  };

  const handleSpeedChange = (newRate) => {
    if (newRate >= 0.5 && newRate <= 2.0) {
      setSpeechRate(newRate);
    }
  };

  const handleSpeedPreset = (rate) => {
    setSpeechRate(rate);
    setShowSpeedControl(false);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('tts-history');
      localStorage.removeItem('tts-speech-rate');
      localStorage.removeItem('tts-selected-voice');
      localStorage.removeItem('tts-current-progress');
      localStorage.removeItem('gesture-hint-shown');
      setSpeechRate(1.0);
      setSelectedVoice(null);
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="container">
      <VoiceSelector
        show={showVoiceSelector}
        voices={voices}
        selectedVoice={selectedVoice}
        onVoiceSelect={handleVoiceSelect}
        onClose={() => setShowVoiceSelector(false)}
      />

      <SpeedControl
        show={showSpeedControl}
        speechRate={speechRate}
        onSpeedChange={handleSpeedChange}
        onPresetSelect={handleSpeedPreset}
        onClose={() => setShowSpeedControl(false)}
      />

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
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Settings
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Voice Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Voice Settings
            </h3>
            <div 
              onClick={() => setShowVoiceSelector(true)}
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
                  Selected Voice
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {getVoiceDisplayName(selectedVoice)}
                </div>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>›</span>
            </div>
          </div>

          {/* Speed Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Speed Settings
            </h3>
            <div 
              onClick={() => setShowSpeedControl(true)}
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
                  Reading Speed
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {speechRate}x - {getSpeedLabel(speechRate)}
                </div>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>›</span>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Theme Settings
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
                  App Theme
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
              <span style={{ fontSize: '20px' }}>
                {isDarkMode ? '🌙' : '☀️'}
              </span>
            </div>
          </div>

          {/* Data Management */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Data Management
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
                  Clear All Data
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Delete history, settings, and progress
                </div>
              </div>
              <span style={{ color: 'var(--danger)', fontSize: '18px' }}>🗑️</span>
            </div>
          </div>

          {/* App Info */}
          <div className="setting-section">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
              App Information
            </h3>
            <div style={{
              background: 'var(--bg-light)',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Version:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>1.0.0</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Features:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>TTS, History, Touch Gestures</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Languages:</span>
                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>Turkish</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 