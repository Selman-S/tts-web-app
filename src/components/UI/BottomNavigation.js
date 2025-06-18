import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

/**
 * Bottom Navigation component with routing
 * Similar to mobile app design
 */
const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navigation" role="navigation" aria-label="Ana navigasyon">
      <button 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
        title="Ana Sayfa"
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button 
        className={`nav-item ${isActive('/history') ? 'active' : ''}`}
        onClick={() => navigate('/history')}
        title="Geçmiş"
      >
        <span className="nav-icon">📚</span>
        <span className="nav-label">History</span>
      </button>

      <button 
        className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
        onClick={() => navigate('/settings')}
        title="Ayarlar"
      >
        <span className="nav-icon">⚙️</span>
        <span className="nav-label">Settings</span>
      </button>
    </nav>
  );
};

export default BottomNavigation; 