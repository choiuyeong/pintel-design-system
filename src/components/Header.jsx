import { useLayoutEffect, useRef, useState } from 'react';
import { TIERS } from '../data/components';
import TabBar3D from './TabBar3D';

const BAR_H = 18; // 3D 바 캔버스 높이(px)

export default function Header({ activeTab, onTabChange }) {
  const tabs = Object.values(TIERS).map((tier) => ({
    id: tier.id,
    label: tier.label,
  }));

  const navRef = useRef(null);
  const tabRefs = useRef({});
  // 공유 인디케이터(3D 바)의 위치/너비 — 활성 탭 기준으로 슬라이드
  const [bar, setBar] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];
      if (!el) return;
      // 텍스트 폭에 맞춰 좌우 패딩(20px)만큼 안쪽으로
      const PAD = 20;
      setBar({ left: el.offsetLeft + PAD, width: Math.max(0, el.offsetWidth - PAD * 2), ready: true });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab, tabs.length]);

  return (
    <header className="ds-header">
      <div className="ds-header-logo" onClick={() => onTabChange('get-started')}>
        PINTEL DESIGN SYSTEM
      </div>
      <nav className="ds-header-nav" ref={navRef}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            className={`ds-header-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
        <span
          className="ds-header-tab-indicator"
          style={{ left: `${bar.left}px`, width: `${bar.width}px`, opacity: bar.ready ? 1 : 0 }}
          aria-hidden="true"
        >
          <TabBar3D width={bar.width} height={BAR_H} spinKey={activeTab} />
        </span>
      </nav>
    </header>
  );
}
