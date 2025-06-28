import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaPlay, FaPause, FaStop, FaSpinner } from 'react-icons/fa';
import './AudioControls.css';

/**
 * Enhanced Audio Controls component 🎮
 * Features: Loading states, visual feedback, better accessibility
 */
const AudioControls = ({
  isSpeaking,
  isPaused,
  onSpeak,
  onPause,
  onResume,
  onStop,
  disabled = false,
  isLoading = false,
  textLength = 0
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Determine button states
  const speakDisabled = disabled || isLoading || textLength === 0;
  const controlsDisabled = disabled || isLoading;

  // Get speak button content based on state
  const getSpeakButtonContent = () => {
    if (isLoading) {
      return {
        icon: <FaSpinner className="btn-icon spinning" aria-hidden="true" />,
        text: 'Hazırlanıyor...',
        className: 'control-btn primary loading'
      };
    }
    
    if (speakDisabled) {
      return {
        icon: <FaPlay className="btn-icon" aria-hidden="true" />,
        text: textLength === 0 ? 'Metin girin' : 'Seslendir',
        className: 'control-btn primary disabled'
      };
    }

    return {
      icon: <FaPlay className="btn-icon" aria-hidden="true" />,
      text: 'Seslendir',
      className: 'control-btn primary'
    };
  };

  const speakButton = getSpeakButtonContent();

  return (
    <section className="audio-controls enhanced" aria-label="Ses Kontrolleri">
      <div className="primary-controls">
        {!isSpeaking ? (
          <button 
            className={speakButton.className}
            onClick={onSpeak}
            disabled={speakDisabled}
            aria-label={isLoading ? 'Hazırlanıyor' : 'Metni seslendir'}
            type="button"
            title={textLength === 0 ? 'Önce bir metin yazın' : 'Metni sesli okumaya başla'}
          >
            {speakButton.icon}
            <span className="btn-text">{speakButton.text}</span>
            {textLength > 0 && !isLoading && (
              <span className="btn-hint">({Math.round(textLength / 200)} dk)</span>
            )}
          </button>
        ) : (
          <div className="control-group enhanced" role="group" aria-label="Oynatma kontrolleri">
            {isPaused ? (
              <button 
                className="control-btn success" 
                onClick={onResume}
                disabled={controlsDisabled}
                aria-label="Okumaya devam et"
                type="button"
                title="Kaldığınız yerden devam edin"
              >
                <FaPlay className="btn-icon" aria-hidden="true" />
                <span className="btn-text">Devam Et</span>
              </button>
            ) : (
              <button 
                className="control-btn warning" 
                onClick={onPause}
                disabled={controlsDisabled}
                aria-label="Okumayı duraklat"
                type="button"
                title="Okumayı geçici olarak duraklat"
              >
                <FaPause className="btn-icon" aria-hidden="true" />
                <span className="btn-text">Duraklat</span>
              </button>
            )}
            <button 
              className="control-btn danger" 
              onClick={onStop}
              disabled={controlsDisabled}
              aria-label="Okumayı durdur"
              type="button"
              title="Okumayı tamamen durdur"
            >
              <FaStop className="btn-icon" aria-hidden="true" />
              <span className="btn-text">Durdur</span>
            </button>
          </div>
        )}
      </div>

      {/* Status indicator */}
      {(isSpeaking || isPaused || isLoading) && (
        <div className="status-indicator">
          <div className={`status-dot ${isLoading ? 'loading' : isPaused ? 'paused' : 'speaking'}`}></div>
          <span className="status-text">
            {isLoading ? 'Hazırlanıyor...' : isPaused ? 'Duraklatıldı' : 'Okunuyor...'}
          </span>
        </div>
      )}

      {/* Quick tips */}
      {!isSpeaking && !isLoading && textLength > 0 && (
        <div className="quick-tips">
          <span className="tip-icon">💡</span>
          <span className="tip-text">
            İpucu: Metin okurken diğer sekmelere geçebilirsiniz
          </span>
        </div>
      )}
    </section>
  );
};

export default AudioControls; 