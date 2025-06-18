import React from 'react';
import { MAX_CHARS } from '../../constants';
import { getVoiceDisplayName } from '../../utils/textUtils';
import './TextInput.css';

/**
 * Text Input component with character counter and settings display
 */
const TextInput = ({
  text,
  onChange,
  error,
  selectedVoice,
  speechRate
}) => {
  return (
    <section className="text-input-section" aria-label="Metin Girişi">
      {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}
      
      <div className="input-container">
        <label htmlFor="text-input" className="sr-only">
          Seslendirilecek metni girin
        </label>
        <textarea
          id="text-input"
          className="text-textarea"
          rows="4"
          placeholder="Enter text here..."
          value={text}
          onChange={onChange}
          maxLength={MAX_CHARS}
          aria-describedby="char-counter settings-info"
          aria-label="Seslendirilecek metin"
        />
        <div className="input-footer">
          <div id="char-counter" className="char-counter">
            {text.length} / {MAX_CHARS}
          </div>
          <div id="settings-info" className="current-settings">
            <div className="setting-item">
              <span className="setting-label">Ses:</span>
              <span className="setting-value">{getVoiceDisplayName(selectedVoice)}</span>
            </div>
            <div className="setting-item">
              <span className="setting-label">Hız:</span>
              <span className="setting-value">{speechRate}x</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextInput; 