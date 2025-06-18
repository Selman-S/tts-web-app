import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';
import './AudioControls.css';

/**
 * Audio Controls component for play, pause, resume, stop functionality
 */
const AudioControls = ({
  isSpeaking,
  isPaused,
  onSpeak,
  onPause,
  onResume,
  onStop
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <section className="audio-controls" aria-label="Ses Kontrolleri">
      <div className="primary-controls">
        {!isSpeaking ? (
          <button 
            className="control-btn primary" 
            onClick={onSpeak}
            aria-label={t('audioControls.speakAriaLabel')}
            type="button"
          >
            <FaPlay className="btn-icon" aria-hidden="true" />
            <span className="btn-text">{t('audioControls.speak')}</span>
          </button>
        ) : (
          <div className="control-group" role="group" aria-label="Oynatma kontrolleri">
            {isPaused ? (
              <button 
                className="control-btn success" 
                onClick={onResume}
                aria-label={t('audioControls.resumeAriaLabel')}
                type="button"
              >
                <FaPlay className="btn-icon" aria-hidden="true" />
                <span className="btn-text">{t('audioControls.resume')}</span>
              </button>
            ) : (
              <button 
                className="control-btn warning" 
                onClick={onPause}
                aria-label={t('audioControls.pauseAriaLabel')}
                type="button"
              >
                <FaPause className="btn-icon" aria-hidden="true" />
                <span className="btn-text">{t('audioControls.pause')}</span>
              </button>
            )}
            <button 
              className="control-btn danger" 
              onClick={onStop}
              aria-label={t('audioControls.stopAriaLabel')}
              type="button"
            >
              <FaStop className="btn-icon" aria-hidden="true" />
              <span className="btn-text">{t('audioControls.stop')}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AudioControls; 