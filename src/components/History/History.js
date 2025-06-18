import React from 'react';
import { CATEGORIES } from '../../constants';
import './History.css';

/**
 * History component for managing reading history
 */
const History = ({
  show,
  history,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedItems,
  showBulkActions,
  onToggleItemSelection,
  onSelectAllItems,
  onDeselectAllItems,
  onBulkDelete,
  onBulkToggleFavorite,
  onToggleFavorite,
  onUpdateItemCategory,
  onLoadFromHistory,
  onClearHistory
}) => {
  if (!show) return null;

  // Filter history based on search and category
  const getFilteredHistory = () => {
    let filtered = history;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
    }

    return filtered;
  };

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES.find(cat => cat.id === 'other');
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Geçmiş</h3>
        {!showBulkActions ? (
          <button onClick={onClearHistory} className="clear-btn">
            Temizle
          </button>
        ) : (
          <div className="bulk-actions">
            <button onClick={onBulkDelete} className="bulk-btn danger">
              Sil ({selectedItems.size})
            </button>
            <button onClick={onBulkToggleFavorite} className="bulk-btn">
              ⭐
            </button>
            <button onClick={onDeselectAllItems} className="bulk-btn secondary">
              İptal
            </button>
          </div>
        )}
      </div>

      <div className="history-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">Tümü</option>
          <option value="favorites">⭐ Favoriler</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        {filteredHistory.length > 0 && (
          <button onClick={onSelectAllItems} className="select-all-btn">
            Tümünü Seç
          </button>
        )}
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <p className="no-history">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Sonuç bulunamadı' 
              : 'Henüz geçmiş yok'
            }
          </p>
        ) : (
          filteredHistory.map(item => {
            const categoryInfo = getCategoryInfo(item.category);
            return (
              <div key={item.id} className={`history-item ${selectedItems.has(item.id) ? 'selected' : ''}`}>
                <div className="history-item-header">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => onToggleItemSelection(item.id)}
                    className="item-checkbox"
                  />
                  <div className="category-badge" style={{ backgroundColor: categoryInfo.color }}>
                    {categoryInfo.icon}
                  </div>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`favorite-btn ${item.isFavorite ? 'active' : ''}`}
                  >
                    {item.isFavorite ? '⭐' : '☆'}
                  </button>
                </div>
                
                <div className="history-preview">{item.preview}</div>
                
                <div className="history-meta">
                  <div className="meta-info">
                    <span className="history-date">{item.timestamp}</span>
                    <span className="word-count">{item.wordCount} kelime</span>
                  </div>
                  <div className="item-actions">
                    <select
                      value={item.category}
                      onChange={(e) => onUpdateItemCategory(item.id, e.target.value)}
                      className="category-select-mini"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => onLoadFromHistory(item)}
                      className="load-btn"
                    >
                      Yükle
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default History; 