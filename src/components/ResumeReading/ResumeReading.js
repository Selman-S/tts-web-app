import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaTimes, FaPlay, FaBookOpen } from 'react-icons/fa';
import './ResumeReading.css';

/**
 * Resume Reading component - shows when user has a paused reading session
 * Allows user to continue from where they left off
 */
const ResumeReading = ({
  show,
  currentText,
  currentSentenceIndex,
  totalSentences,
  currentSentence,
  onResume,
  onDismiss
}) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  if (!show || !currentText) return null;

  // Get text preview (first 100 characters)
  const textPreview = currentText.length > 100 
    ? currentText.substring(0, 100) + '...' 
    : currentText;

  // Format sentence info text with placeholders
  const sentenceInfoText = t('resumeReading.sentenceInfo')
    .replace('{current}', currentSentenceIndex + 1)
    .replace('{total}', totalSentences);

  return (
    <div className="resume-reading-card">
      <div className="resume-header">
        <div className="resume-info">
          <h3 className="resume-title">
            {t('resumeReading.title')}
          </h3>
          <p className="resume-description">
            {t('resumeReading.description')}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="dismiss-btn"
          title={t('resumeReading.dismissButton')}
          aria-label={t('resumeReading.dismissButton')}
        >
          <FaTimes />
        </button>
      </div>

      <div className="resume-content">
        <div className="text-preview">
          <div className="preview-label">
            {t('resumeReading.textPreview')}
          </div>
          <div className="preview-text">
            {textPreview}
          </div>
        </div>
        
        <div className="sentence-info">
          <FaBookOpen className="sentence-icon" />
          <span>{sentenceInfoText}</span>
        </div>
      </div>

      <div className="resume-actions">
        <button
          onClick={onResume}
          className="resume-btn"
          aria-label={t('resumeReading.resumeButton')}
        >
          <FaPlay className="btn-icon" />
          {t('resumeReading.resumeButton')}
        </button>
        <button
          onClick={onDismiss}
          className="dismiss-text-btn"
        >
          {t('resumeReading.dismissButton')}
        </button>
      </div>
    </div>
  );
};

export default ResumeReading; 