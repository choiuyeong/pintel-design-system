import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { TIERS } from '../data/components';
import SidebarGem3D from './SidebarGem3D';

export default function Sidebar({ activeTier, selectedId, onSelect }) {
  const tier = TIERS[activeTier];

  // 모든 하위 카테고리 추출 (초기 열림 상태를 위해)
  const allCategories = tier ? (tier.groups ? tier.groups.flatMap(g => g.categories) : (tier.categories || [])) : [];

  const [expandedCategories, setExpandedCategories] = useState({});

  // 활성 항목으로 세로 슬라이드하는 포커스 마커(브랜드 다각형 gem)
  const asideRef = useRef(null);
  const itemRefs = useRef({});
  const GEM = 22; // 마커 크기(px)
  const [gem, setGem] = useState({ center: 0, left: 10, ready: false });

  useLayoutEffect(() => {
    const aside = asideRef.current;
    if (!aside) return undefined;
    const measure = () => {
      const el = itemRefs.current[String(selectedId)];
      // 항목이 없거나, 접힌 카테고리(자식 컨테이너 높이 0)로 가려진 경우 마커 숨김
      // ※ 접혀도 항목 자체 offsetHeight는 유지되므로, 부모 .ds-sidebar-children의 높이로 판정
      const wrap = el && el.closest('.ds-sidebar-children');
      if (!el || el.offsetHeight === 0 || (wrap && wrap.offsetHeight === 0)) { setGem((g) => ({ ...g, ready: false })); return; }
      const a = aside.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      // 항목 텍스트 들여쓰기 바로 왼쪽 여백에 정렬(들여쓰기 단계가 달라도 일관)
      // GAP = 텍스트와 마커 사이 거리(원래값 8px), 최소 좌측 여백 8px 확보
      const GAP = 8;
      const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const left = Math.max(8, padLeft - GEM - GAP);
      setGem({ center: r.top - a.top + aside.scrollTop + r.height / 2, left, ready: true });
    };
    // 드롭다운(max-height 0.25s) 동안 항목들이 움직이므로, 애니메이션 창(≈400ms) 동안
    // 매 프레임 재측정해 마커가 정확히 따라가게 함(transitionend 1회 측정의 어긋남 방지)
    let rafId;
    const start = performance.now();
    const track = (now) => {
      measure();
      if (now - start < 420) rafId = requestAnimationFrame(track);
    };
    rafId = requestAnimationFrame(track);
    measure();
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
    };
  }, [selectedId, expandedCategories, activeTier]);

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
          ref={(el) => { itemRefs.current[String(child.id)] = el; }}
          className={`ds-sidebar-item ${selectedId === child.id ? 'active' : ''}`}
          style={{ paddingLeft: '52px', marginRight: '12px', borderRadius: '0 20px 20px 0', display: 'flex', alignItems: 'center' }}
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
            maxHeight: expandedCategories[category.id] ? `${category.children.length * 38}px` : '0px',
            transition: 'max-height 0.25s ease-in-out',
          }}
        >
          {category.children.map((child) => (
            <div
              key={child.id}
              ref={(el) => { itemRefs.current[String(child.id)] = el; }}
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
    <aside className="ds-sidebar" ref={asideRef}>
      <span
        className="ds-sidebar-gem"
        style={{ top: `${gem.center}px`, left: `${gem.left}px`, opacity: gem.ready ? 1 : 0 }}
        aria-hidden="true"
      >
        <SidebarGem3D size={GEM} />
      </span>
      {tier && (
        <div className="ds-sidebar-tier-label">{tier.description}</div>
      )}

      {activeTier === 'component' && (
        <div style={{ marginBottom: '16px' }}>
          <div
            ref={(el) => { itemRefs.current['null'] = el; }}
            className={`ds-sidebar-item ${selectedId === null ? 'active' : ''}`}
            style={{ paddingLeft: '52px', marginRight: '12px', borderRadius: '0 20px 20px 0', display: 'flex', alignItems: 'center' }}
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
