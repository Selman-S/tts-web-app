import React, { createContext, useContext, useState, useEffect } from 'react';

// Language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('tts-language');
    if (savedLanguage && ['tr', 'en'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when changed
  useEffect(() => {
    localStorage.setItem('tts-language', currentLanguage);
  }, [currentLanguage]);

  // Change language function
  const changeLanguage = (language) => {
    if (['tr', 'en'].includes(language)) {
      setCurrentLanguage(language);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === 'en',
    isTurkish: currentLanguage === 'tr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 