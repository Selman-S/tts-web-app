import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import BottomNavigation from './components/UI/BottomNavigation';
import './App.css';

/**
 * Main TTS Application Component with Routing
 * Simplified structure with hook-based speech management
 */
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
}

/**
 * App wrapper with providers and Router
 * Removed SpeechProvider for simplified hook-based approach
 */
function AppWithProviders() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default AppWithProviders;
