import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const [wordEnd, setWordEnd] = useState(0);
  const maxChars = 50000;

  // Seslendirme seçeneklerini yükleme
  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr'))); // Sadece Türkçe sesler
    };

    loadVoices();
    // Chrome için gerekli olan voice changed event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Metni cümlelere bölme fonksiyonu
  const splitIntoSentences = (text) => {
    if (!text || typeof text !== 'string') return [];
    
    // Önce noktalama işaretlerine göre böl
    let sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    // Eğer noktalama işareti yoksa veya kalan metin varsa
    if (sentences.length === 0 || text.replace(/[.!?]/g, '').trim() !== '') {
      // Kalan metni satırlara böl veya tek parça olarak al
      const remainingText = text.split('\n').filter(line => line.trim());
      
      // Eğer satır yoksa ve metin varsa, tüm metni tek cümle olarak al
      if (remainingText.length === 0 && text.trim()) {
        sentences = [text.trim()];
      } else {
        // Var olan cümlelere satırları ekle
        sentences = [...sentences, ...remainingText];
      }
    }
    
    // Boş cümleleri filtrele ve trimle
    return sentences.filter(sentence => sentence.trim()).map(sentence => sentence.trim());
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Tarayıcınız bu özelliği desteklemiyor.');
      return;
    }
    if (!text || text.trim() === '') {
      setError('Lütfen bir metin girin.');
      return;
    }
    setError('');

    // Metni cümlelere böl
    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) {
      setError('Lütfen geçerli bir metin girin.');
      return;
    }

    let currentIndex = 0;

    const speakSentence = (sentence) => {
      if (!sentence || typeof sentence !== 'string') {
        handleStop();
        return;
      }

      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) {
        // Boş cümleyi atla ve bir sonrakine geç
        if (currentIndex < sentences.length - 1) {
          currentIndex++;
          speakSentence(sentences[currentIndex]);
        } else {
          handleStop();
        }
        return;
      }

      setCurrentSentence(trimmedSentence);
      setCurrentWord('');
      setWordStart(0);
      setWordEnd(0);

      const utterance = new window.SpeechSynthesisUtterance(trimmedSentence);
      utterance.lang = 'tr-TR';
      utterance.rate = 1;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Kelime sınırlarını takip et
      utterance.onboundary = (event) => {
        if (event.name === 'word' && event.charIndex !== undefined && event.charLength !== undefined) {
          const word = trimmedSentence.substring(event.charIndex, event.charIndex + event.charLength);
          if (word && word.trim()) {
            setCurrentWord(word);
            setWordStart(event.charIndex);
            setWordEnd(event.charIndex + event.charLength);
          }
        }
      };

      utterance.onend = () => {
        if (currentIndex < sentences.length - 1) {
          currentIndex++;
          speakSentence(sentences[currentIndex]);
        } else {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentSentence('');
          setCurrentWord('');
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    speakSentence(sentences[0]);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentWord('');
  };

  const handleChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
      setError('');
    }
  };

  return (
    <div className="App">
      <div className="tts-card">
        <div className="tts-title">
          <span role="img" aria-label="speaker">🗣️</span>
          Yazıyı Sese Çevir
        </div>
        {error && <div className="tts-error">{error}</div>}
        <textarea
          className="tts-textarea"
          rows="5"
          placeholder="Metni buraya girin..."
          value={text}
          onChange={handleChange}
          maxLength={maxChars}
        />
        <div className="tts-counter">
          {text.length} / {maxChars}
        </div>
        {currentSentence && (
          <div className="tts-current-sentence">
            <div className="sentence-container">
              {currentSentence.substring(0, wordStart)}
              {currentWord && (
                <span className="highlighted-word">
                  {currentWord}
                </span>
              )}
              {currentSentence.substring(wordEnd)}
            </div>
          </div>
        )}
        <select
          className="tts-select"
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={(e) => {
            const voice = voices.find(v => v.name === e.target.value);
            setSelectedVoice(voice);
          }}
        >
          <option value="">Varsayılan ses</option>
          {voices.map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
        <div className="tts-controls">
          {!isSpeaking ? (
            <button className="tts-btn" onClick={handleSpeak}>
              <span role="img" aria-label="play">▶️</span> Seslendir
            </button>
          ) : (
            <>
              {isPaused ? (
                <button className="tts-btn" onClick={handleResume}>
                  <span role="img" aria-label="resume">▶️</span> Devam Et
                </button>
              ) : (
                <button className="tts-btn pause" onClick={handlePause}>
                  <span role="img" aria-label="pause">⏸️</span> Duraklat
                </button>
              )}
              <button className="tts-btn stop" onClick={handleStop}>
                <span role="img" aria-label="stop">⏹️</span> Durdur
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
