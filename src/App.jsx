import { useState, useEffect } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('get-started');
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  const scrollToTop = () => {
    const container = document.querySelector('.ds-main');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'foundation') {
      setSelectedComponentId('foundation-overview-default');
    } else if (tabId === 'service-domain') {
      setSelectedComponentId('intersection-overview-default');
    } else if (tabId === 'library') {
      setSelectedComponentId('library-login');
    } else {
      setSelectedComponentId(null);
    }
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
            onSelect={setSelectedComponentId}
          />
        )}
        {isGetStarted ? (
          <GetStarted />
        ) : activeTab === 'library' ? (
          <Library componentId={selectedComponentId} />
        ) : (
          <ComponentDoc componentId={selectedComponentId} activeTier={activeTab} onNavigate={setSelectedComponentId} />
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
