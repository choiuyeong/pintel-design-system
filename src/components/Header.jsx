import { TIERS } from '../data/components';

export default function Header({ activeTab, onTabChange }) {
  const tabs = Object.values(TIERS).map((tier) => ({
    id: tier.id,
    label: tier.label,
  }));

  return (
    <header className="ds-header">
      <div className="ds-header-logo" onClick={() => onTabChange('get-started')}>
        PINTEL DESIGN SYSTEM
      </div>
      <nav className="ds-header-nav">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`ds-header-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </nav>
    </header>
  );
}
