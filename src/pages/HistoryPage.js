import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../components/History/History';

/**
 * History Page component for managing reading history
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  
  // History state
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load history on mount
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = localStorage.getItem('tts-history');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Error loading history:', e);
        }
      }
    };

    loadHistory();
  }, []);

  // Save history when changed
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('tts-history', JSON.stringify(history));
    }
  }, [history]);

  // History event handlers
  const toggleFavorite = (itemId) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const updateItemCategory = (itemId, newCategory) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, category: newCategory } : item
    ));
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllItems = () => {
    const allIds = new Set(history.map(item => item.id));
    setSelectedItems(allIds);
    setShowBulkActions(allIds.size > 0);
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const bulkDelete = () => {
    setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const bulkToggleFavorite = () => {
    setHistory(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const loadFromHistory = (historyItem) => {
    // Navigate to home page with text data
    navigate('/', { state: { text: historyItem.text } });
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedItems(new Set());
    setShowBulkActions(false);
    localStorage.removeItem('tts-history');
  };

  return (
    <div className="container">
      <div className="tts-card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '16px',
              color: 'var(--text-secondary)'
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Reading History
          </h1>
        </div>

        <History
          show={true}
          history={history}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedItems={selectedItems}
          showBulkActions={showBulkActions}
          onToggleItemSelection={toggleItemSelection}
          onSelectAllItems={selectAllItems}
          onDeselectAllItems={deselectAllItems}
          onBulkDelete={bulkDelete}
          onBulkToggleFavorite={bulkToggleFavorite}
          onToggleFavorite={toggleFavorite}
          onUpdateItemCategory={updateItemCategory}
          onLoadFromHistory={loadFromHistory}
          onClearHistory={clearHistory}
        />
      </div>
    </div>
  );
};

export default HistoryPage; 