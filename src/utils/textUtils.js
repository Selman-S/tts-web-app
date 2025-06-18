// Text processing utilities

/**
 * Split text into sentences for better speech synthesis
 * @param {string} text - The input text to split
 * @returns {string[]} Array of sentences
 */
export const splitIntoSentences = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Clean and normalize text
  const cleanText = text.trim();
  if (!cleanText) return [];
  
  // Split by sentence endings, keeping the punctuation
  const sentencePattern = /[.!?]+\s*/g;
  let sentences = cleanText.split(sentencePattern).filter(s => s.trim());
  
  // If no sentence endings found, split by paragraphs or use entire text
  if (sentences.length <= 1) {
    sentences = cleanText.split(/\n+/).filter(s => s.trim());
  }
  
  // If still only one sentence, use the entire text
  if (sentences.length === 0) {
    sentences = [cleanText];
  }
  
  return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

/**
 * Get word count from text
 * @param {string} text - The input text
 * @returns {number} Number of words
 */
export const getWordCount = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Create preview text with ellipsis
 * @param {string} text - The input text
 * @param {number} maxLength - Maximum length for preview
 * @returns {string} Preview text
 */
export const createPreview = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Get display name for voice
 * @param {SpeechSynthesisVoice|null} voice - The voice object
 * @param {function} t - Translation function (optional)
 * @returns {string} Display name
 */
export const getVoiceDisplayName = (voice, t = null) => {
  if (!voice) {
    return t ? t('voiceSelector.defaultVoice') : 'Default Voice';
  }
  return voice.name.split(' ')[0] || voice.name;
};

/**
 * Get speed label based on rate
 * @param {number} rate - Speech rate
 * @param {function} t - Translation function (optional)
 * @returns {string} Speed label
 */
export const getSpeedLabel = (rate, t = null) => {
  if (!t) {
    // Fallback to English
    if (rate <= 0.75) return 'Slow';
    if (rate <= 1.0) return 'Normal';
    if (rate <= 1.25) return 'Fast';
    return 'Very Fast';
  }
  
  if (rate <= 0.75) return t('speedControl.slow');
  if (rate <= 1.0) return t('speedControl.normal');
  if (rate <= 1.25) return t('speedControl.fast');
  return t('speedControl.veryFast');
}; 