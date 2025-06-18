import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { MAX_CHARS } from '../../constants';
import { getVoiceDisplayName } from '../../utils/textUtils';
import { FaTimes } from 'react-icons/fa';
import './TextInput.css';

/**
 * Text Input component with character counter and settings display
 */
const TextInput = ({
  text,
  onChange,
  error,
  selectedVoice,
  speechRate,
  voices,
  onVoiceSelect,
  onSpeedChange
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <section className="text-input-section" aria-label="Metin Girişi">
      {error && <div className="error-message" role="alert" aria-live="polite">{error}</div>}
      
      <div className="input-container">
        <div className="textarea-wrapper">
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
          {text.length > 0 && (
            <button
              type="button"
              className="clear-text-btn"
              onClick={() => onChange({ target: { value: '' } })}
              aria-label={t('textInput.clearText')}
              title={t('textInput.clearText')}
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="char-counter-container">
          <div id="char-counter" className="char-counter">
            {text.length} / {MAX_CHARS} {t('textInput.characterCount')}
          </div>
        </div>
      </div>
      
      <div id="settings-info" className="current-settings">
        <div className="setting-item dropdown-item">
          <label htmlFor="voice-select" className="setting-label">{t('textInput.voice')}:</label>
          <select 
            id="voice-select"
            name="voice-select"
            className="setting-dropdown"
            value={selectedVoice?.name || 'default'}
            onChange={(e) => {
              const voiceName = e.target.value;
              if (voiceName === 'default') {
                onVoiceSelect(null);
              } else {
                const voice = voices.find(v => v.name === voiceName);
                onVoiceSelect(voice);
              }
            }}
            aria-label={t('textInput.voice')}
          >
            <option value="default">{t('voiceSelector.defaultVoice')}</option>
            {voices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {getVoiceDisplayName(voice, t)}
              </option>
            ))}
          </select>
        </div>
        <div className="setting-item dropdown-item">
          <label htmlFor="speed-select" className="setting-label">{t('textInput.speed')}:</label>
          <select 
            id="speed-select"
            name="speed-select"
            className="setting-dropdown"
            value={speechRate.toFixed(2)}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            aria-label={t('textInput.speed')}
          >
            <option value="0.50">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.00">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.50">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2.00">2.0x</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default TextInput; 