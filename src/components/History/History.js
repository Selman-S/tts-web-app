import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
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
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
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
    const category = CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES.find(cat => cat.id === 'other');
    return {
      ...category,
      name: t(`categories.${category.id}`)
    };
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>{t('history.title')}</h3>
        {!showBulkActions ? (
          <button onClick={onClearHistory} className="clear-btn">
            {t('history.clear')}
          </button>
        ) : (
          <div className="bulk-actions">
            <button onClick={onBulkDelete} className="bulk-btn danger">
              {t('history.delete')} ({selectedItems.size})
            </button>
            <button onClick={onBulkToggleFavorite} className="bulk-btn">
              ⭐
            </button>
            <button onClick={onDeselectAllItems} className="bulk-btn secondary">
              {t('history.cancel')}
            </button>
          </div>
        )}
      </div>

      <div className="history-controls">
        <div className="search-container">
          <label htmlFor="history-search" className="sr-only">{t('history.search')}</label>
          <input
            id="history-search"
            name="history-search"
            type="text"
            placeholder={t('history.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label={t('history.search')}
          />
          <span className="search-icon">🔍</span>
        </div>

        <label htmlFor="category-filter" className="sr-only">{t('history.categories')}</label>
        <select
          id="category-filter"
          name="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
          aria-label={t('history.categories')}
        >
          <option value="all">{t('history.all')}</option>
          <option value="favorites">⭐ {t('history.favorites')}</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {t(`categories.${cat.id}`)}
            </option>
          ))}
        </select>

        {filteredHistory.length > 0 && (
          <button onClick={onSelectAllItems} className="select-all-btn">
            {t('history.selectAll')}
          </button>
        )}
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <p className="no-history">
            {searchQuery || selectedCategory !== 'all' 
              ? t('history.noResults')
              : t('history.noHistory')
            }
          </p>
        ) : (
          filteredHistory.map(item => {
            const categoryInfo = getCategoryInfo(item.category);
            return (
              <div key={item.id} className={`history-item ${selectedItems.has(item.id) ? 'selected' : ''}`}>
                <div className="history-item-header">
                  <input
                    id={`checkbox-${item.id}`}
                    name={`checkbox-${item.id}`}
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => onToggleItemSelection(item.id)}
                    className="item-checkbox"
                    aria-label={`${t('history.selectItem')} ${item.preview.substring(0, 30)}...`}
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
                    <span className="word-count">{item.wordCount} {t('history.words')}</span>
                  </div>
                  <div className="item-actions">
                    <select
                      id={`category-${item.id}`}
                      name={`category-${item.id}`}
                      value={item.category}
                      onChange={(e) => onUpdateItemCategory(item.id, e.target.value)}
                      className="category-select-mini"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${t('history.changeCategory')} ${item.preview.substring(0, 30)}...`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {t(`categories.${cat.id}`)}
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => onLoadFromHistory(item)}
                      className="load-btn"
                    >
                      {t('history.load')}
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