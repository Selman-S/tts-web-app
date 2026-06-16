import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaPlay, FaPause, FaStop, FaSpinner } from 'react-icons/fa';
import './AudioControls.css';

/**
 * Audio playback controls with loading and accessibility states
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
  textLength = 0,
  estimatedMinutes = 0
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const speakDisabled = disabled || isLoading || textLength === 0;
  const controlsDisabled = disabled || isLoading;

  const getSpeakButtonContent = () => {
    if (isLoading) {
      return {
        icon: <FaSpinner className="btn-icon spinning" aria-hidden="true" />,
        text: t('common.preparing'),
        className: 'control-btn primary loading'
      };
    }
    if (speakDisabled) {
      return {
        icon: <FaPlay className="btn-icon" aria-hidden="true" />,
        text: textLength === 0 ? t('common.enterTextFirst') : t('audioControls.speak'),
        className: 'control-btn primary disabled'
      };
    }
    return {
      icon: <FaPlay className="btn-icon" aria-hidden="true" />,
      text: t('audioControls.speak'),
      className: 'control-btn primary'
    };
  };

  const speakButton = getSpeakButtonContent();

  return (
    <section className="audio-controls enhanced" aria-label={t('audioControls.speak')}>
      <div className="primary-controls">
        {!isSpeaking ? (
          <button
            className={speakButton.className}
            onClick={onSpeak}
            disabled={speakDisabled}
            aria-label={isLoading ? t('common.preparing') : t('audioControls.speakAriaLabel')}
            type="button"
            title={textLength === 0 ? t('home.writeFirst') : t('home.speakTitle')}
          >
            {speakButton.icon}
            <span className="btn-text">{speakButton.text}</span>
            {textLength > 0 && !isLoading && estimatedMinutes > 0 && (
              <span className="btn-hint">({estimatedMinutes} {t('common.minutes')})</span>
            )}
          </button>
        ) : (
          <div className="control-group enhanced" role="group" aria-label={t('audioControls.speak')}>
            {isPaused ? (
              <button
                className="control-btn success"
                onClick={onResume}
                disabled={controlsDisabled}
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
                disabled={controlsDisabled}
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
              disabled={controlsDisabled}
              aria-label={t('audioControls.stopAriaLabel')}
              type="button"
            >
              <FaStop className="btn-icon" aria-hidden="true" />
              <span className="btn-text">{t('audioControls.stop')}</span>
            </button>
          </div>
        )}
      </div>

      {(isSpeaking || isPaused || isLoading) && (
        <div className="status-indicator">
          <div className={`status-dot ${isLoading ? 'loading' : isPaused ? 'paused' : 'speaking'}`} />
          <span className="status-text">
            {isLoading ? t('common.preparing') : isPaused ? t('home.statusPaused') : t('home.statusSpeaking')}
          </span>
        </div>
      )}

      {!isSpeaking && !isLoading && textLength > 0 && (
        <div className="quick-tips">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{t('home.tip')}</span>
        </div>
      )}
    </section>
  );
};

export default AudioControls;
