import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { SPEED_PRESETS, SPEECH_RATE_MIN, SPEECH_RATE_MAX, SPEECH_RATE_STEP } from '../../constants';
import { getSpeedLabel } from '../../utils/textUtils';
import './SpeedControl.css';

/**
 * Speed Control component for adjusting speech rate
 * Includes slider and preset buttons
 */
const SpeedControl = ({ 
  show, 
  speechRate, 
  onSpeedChange, 
  onPresetSelect, 
  onClose 
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  if (!show) return null;

  return (
    <div className="speed-control-panel">
      <div className="speed-control-header">
        <h3>{t('speedControl.title')}</h3>
        <button 
          onClick={onClose}
          className="close-btn"
        >
          ✕
        </button>
      </div>
      
      <div className="speed-slider-container">
        <div className="speed-value">
          <span className="speed-number">{speechRate}x</span>
          <span className="speed-label">{getSpeedLabel(speechRate, t)}</span>
        </div>
        <input
          type="range"
          min={SPEECH_RATE_MIN}
          max={SPEECH_RATE_MAX}
          step={SPEECH_RATE_STEP}
          value={speechRate}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="speed-slider"
        />
        <div className="speed-range-labels">
          <span>{SPEECH_RATE_MIN}x</span>
          <span>1.0x</span>
          <span>{SPEECH_RATE_MAX}x</span>
        </div>
      </div>

      <div className="speed-presets">
        {SPEED_PRESETS.map(preset => (
          <button 
            key={preset.rate}
            className={`preset-btn ${speechRate === preset.rate ? 'active' : ''}`}
            onClick={() => onPresetSelect(preset.rate)}
          >
            {preset.rate}x<br/><small>{t(`speedControl.${preset.labelKey}`)}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpeedControl; 