import { useState, useEffect, useTransition } from 'react';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComponentDoc from './components/ComponentDoc';
import GetStarted from './components/GetStarted';
import Library from './components/Library';

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const onMouseOver = (e) => {
      if (e.target.closest('a, button, .doc-inner-tab, .ds-sidebar-category-title, .header-tab, .ds-sidebar-item, .ds-header-logo, .doc-code-link')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{ left: position.x, top: position.y }}
    />
  );
}

// URL 해시(#<tab>/<id>) → 현재 탭·선택 항목 복원(새로고침/딥링크 유지)
function readRoute() {
  const h = (window.location.hash || '').replace(/^#/, '');
  if (!h) return null;
  const i = h.indexOf('/');
  return i === -1 ? { tab: h, id: null } : { tab: h.slice(0, i), id: h.slice(i + 1) || null };
}

function App() {
  const initialRoute = readRoute();
  const [activeTab, setActiveTab] = useState(initialRoute?.tab || 'get-started');
  const [selectedComponentId, setSelectedComponentId] = useState(initialRoute?.id || null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  // 무거운 화면 마운트를 비긴급 transition으로 처리 → 클릭이 즉시 반응(메인 스레드 블로킹 완화)
  const [, startTransition] = useTransition();
  const selectComponent = (id) => startTransition(() => setSelectedComponentId(id));

  useEffect(() => {
    const handleScroll = (e) => {
      const container = e.target;
      if (container.classList.contains('ds-main')) {
        setShowBackToTop(container.scrollTop > 300);
      }
    };

    // Capture phase for events on elements with overflow-y: auto
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // 현재 위치를 URL 해시에 기록 → 새로고침해도 같은 페이지 유지
  useEffect(() => {
    const route = `#${activeTab}${selectedComponentId ? '/' + selectedComponentId : ''}`;
    if (window.location.hash !== route) window.history.replaceState(null, '', route);
  }, [activeTab, selectedComponentId]);

  // 뒤로/앞으로·해시 직접 변경 시 상태 동기화
  useEffect(() => {
    const onHash = () => {
      const r = readRoute();
      if (r) { setActiveTab(r.tab); setSelectedComponentId(r.id); }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector('.ds-main');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tabId) => {
    startTransition(() => {
      setActiveTab(tabId);
      if (tabId === 'foundation') {
        setSelectedComponentId('foundation-overview-default');
      } else if (tabId === 'service-domain') {
        setSelectedComponentId('intersection-overview-default');
      } else if (tabId === 'library') {
        setSelectedComponentId('library-login');
      } else if (tabId === 'ai-agent') {
        setSelectedComponentId('library-ux-agent');
      } else {
        setSelectedComponentId(null);
      }
    });
  };

  const isGetStarted = activeTab === 'get-started';

  return (
    <div className="app-layout">
      <CustomCursor />
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="app-body">
        {!isGetStarted && (
          <Sidebar
            activeTier={activeTab}
            selectedId={selectedComponentId}
            onSelect={selectComponent}
          />
        )}
        {isGetStarted ? (
          <GetStarted />
        ) : activeTab === 'library' || activeTab === 'ai-agent' ? (
          <Library componentId={selectedComponentId} />
        ) : (
          <ComponentDoc componentId={selectedComponentId} activeTier={activeTab} onNavigate={selectComponent} />
        )}
      </div>

      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
  );
}

export default App;
