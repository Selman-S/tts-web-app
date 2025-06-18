import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { getVoiceDisplayName } from '../../utils/textUtils';
import { FaTimes, FaCheck } from 'react-icons/fa';
import './VoiceSelector.css';

/**
 * Voice Selector component for choosing speech synthesis voice
 */
const VoiceSelector = ({ 
  show, 
  voices, 
  selectedVoice, 
  onVoiceSelect, 
  onClose 
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  if (!show) return null;

  return (
    <div className="voice-selector-panel">
      <div className="voice-selector-header">
        <h3>{t('voiceSelector.title')}</h3>
        <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button>
      </div>
      <div className="voice-options">
        <div 
          className={`voice-option ${!selectedVoice ? 'selected' : ''}`}
          onClick={() => onVoiceSelect(null)}
        >
          <div className="voice-info">
            <span className="voice-name">{t('voiceSelector.defaultVoice')}</span>
            <span className="voice-desc">{t('voiceSelector.systemDefault')}</span>
          </div>
          {!selectedVoice && <FaCheck className="check-mark" />}
        </div>
        {voices.map(voice => (
          <div 
            key={voice.name}
            className={`voice-option ${selectedVoice?.name === voice.name ? 'selected' : ''}`}
            onClick={() => onVoiceSelect(voice)}
          >
            <div className="voice-info">
              <span className="voice-name">{getVoiceDisplayName(voice, t)}</span>
              <span className="voice-desc">{voice.name}</span>
            </div>
            {selectedVoice?.name === voice.name && <FaCheck className="check-mark" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector; 