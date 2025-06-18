import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
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
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <section className="text-input-section" aria-label="Metin Girişi">
      {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}
      
      <div className="input-container">
        <label htmlFor="text-input" className="sr-only">
          {t('textInput.placeholder')}
        </label>
        <textarea
          id="text-input"
          className="text-textarea"
          rows="6"
          placeholder={t('textInput.placeholder')}
          value={text}
          onChange={onChange}
          maxLength={MAX_CHARS}
          aria-describedby="char-counter settings-info"
          aria-label={t('textInput.placeholder')}
        />
        <div className="char-counter-container">
          <div id="char-counter" className="char-counter">
            {text.length} / {MAX_CHARS} {t('textInput.characterCount')}
          </div>
        </div>
      </div>
      
      <div id="settings-info" className="current-settings">
        <div className="setting-item">
          <span className="setting-label">{t('textInput.voice')}:</span>
          <span className="setting-value">{getVoiceDisplayName(selectedVoice, t)}</span>
        </div>
        <div className="setting-item">
          <span className="setting-label">{t('textInput.speed')}:</span>
          <span className="setting-value">{speechRate}x</span>
        </div>
      </div>
    </section>
  );
};

export default TextInput; 