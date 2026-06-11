import { useState, useEffect } from 'react';
import { TIERS } from '../data/components';

export default function Sidebar({ activeTier, selectedId, onSelect }) {
  const tier = TIERS[activeTier];
  
  // 모든 하위 카테고리 추출 (초기 열림 상태를 위해)
  const allCategories = tier ? (tier.groups ? tier.groups.flatMap(g => g.categories) : (tier.categories || [])) : [];

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (allCategories.length > 0) {
      setExpandedCategories(
        allCategories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
      );
    }
  }, [activeTier]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderCategory = (category) => {
    const hasSingleChild = category.children && category.children.length === 1;

    if (hasSingleChild) {
      const child = category.children[0];
      return (
        <div
          key={child.id}
          className={`ds-sidebar-item ${selectedId === child.id ? 'active' : ''}`}
          style={{ paddingLeft: '32px', marginRight: '12px', borderRadius: '0 20px 20px 0', display: 'flex', alignItems: 'center' }}
          onClick={() => onSelect(child.id)}
        >
          {category.name}
        </div>
      );
    }

    return (
      <div key={category.id} className="ds-sidebar-category">
        <div
          className="ds-sidebar-category-title"
          style={{ 
            color: expandedCategories[category.id] ? '#ffffff' : '#aaaaaa',
            opacity: expandedCategories[category.id] ? 1 : 0.8,
            fontWeight: expandedCategories[category.id] ? 500 : 400
          }}
          onClick={() => toggleCategory(category.id)}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px',
            transition: 'transform 0.2s',
            transform: expandedCategories[category.id] ? 'rotate(90deg)' : 'rotate(0deg)',
            opacity: 0.3
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {category.name}
        </div>
        <div
          className="ds-sidebar-children"
          style={{
            maxHeight: expandedCategories[category.id] ? `${category.children.length * 36}px` : '0px',
            transition: 'max-height 0.25s ease-in-out',
          }}
        >
          {category.children.map((child) => (
            <div
              key={child.id}
              className={`ds-sidebar-item ${selectedId === child.id ? 'active' : ''}`}
              onClick={() => onSelect(child.id)}
            >
              {child.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="ds-sidebar">
      {tier && (
        <div className="ds-sidebar-tier-label">{tier.description}</div>
      )}
      
      {activeTier === 'component' && (
        <div style={{ marginBottom: '16px' }}>
          <div
            className={`ds-sidebar-item ${selectedId === null ? 'active' : ''}`}
            style={{ paddingLeft: '32px', marginRight: '12px', borderRadius: '0 20px 20px 0', display: 'flex', alignItems: 'center' }}
            onClick={() => onSelect(null)}
          >
            Overview
          </div>
        </div>
      )}
      
      {tier && tier.groups ? (
        tier.groups.map(group => (
          <div key={group.id} className="ds-sidebar-group" style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 400, color: '#888',
              padding: '0 24px 8px', letterSpacing: '0.5px',
              opacity: 0.8
            }}>
              {group.label}
            </div>
            {group.categories.map(renderCategory)}
          </div>
        ))
      ) : (
        allCategories.map(renderCategory)
      )}
    </aside>
  );
}
