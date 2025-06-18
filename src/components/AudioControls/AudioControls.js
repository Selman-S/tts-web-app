import React from 'react';
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
  return (
    <section className="audio-controls" aria-label="Ses Kontrolleri">
      <div className="primary-controls">
        {!isSpeaking ? (
          <button 
            className="control-btn primary" 
            onClick={onSpeak}
            aria-label="Metni seslendir"
            type="button"
          >
            <span className="btn-icon" aria-hidden="true">▶️</span> 
            <span className="btn-text">Seslendir</span>
          </button>
        ) : (
          <div className="control-group" role="group" aria-label="Oynatma kontrolleri">
            {isPaused ? (
              <button 
                className="control-btn success" 
                onClick={onResume}
                aria-label="Seslendirmeye devam et"
                type="button"
              >
                <span className="btn-icon" aria-hidden="true">▶️</span> 
                <span className="btn-text">Devam Et</span>
              </button>
            ) : (
              <button 
                className="control-btn warning" 
                onClick={onPause}
                aria-label="Seslendirmeyi duraklat"
                type="button"
              >
                <span className="btn-icon" aria-hidden="true">⏸️</span> 
                <span className="btn-text">Duraklat</span>
              </button>
            )}
            <button 
              className="control-btn danger" 
              onClick={onStop}
              aria-label="Seslendirmeyi durdur"
              type="button"
            >
              <span className="btn-icon" aria-hidden="true">⏹️</span> 
              <span className="btn-text">Durdur</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AudioControls; 