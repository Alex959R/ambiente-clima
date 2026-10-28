import React from 'react';
import { Leaf, MapPin, Activity, Bell, FileText, Sparkles } from 'lucide-react';

export type NavTab = 'zonas' | 'mediciones' | 'alertas' | 'recomendaciones' | 'ia-proxy';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Leaf size={22} />
          </div>
          <div>
            <span>Ambiente y Clima</span>
            <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--primary-700)', fontWeight: 500 }}>
              Panel de Gestión Ambiental
            </span>
          </div>
        </div>

        <ul className="navbar-nav">
          <li>
            <button
              className={`nav-link ${activeTab === 'zonas' ? 'active' : ''}`}
              onClick={() => onTabChange('zonas')}
            >
              <MapPin size={17} />
              <span>Zonas</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'mediciones' ? 'active' : ''}`}
              onClick={() => onTabChange('mediciones')}
            >
              <Activity size={17} />
              <span>Mediciones</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'alertas' ? 'active' : ''}`}
              onClick={() => onTabChange('alertas')}
            >
              <Bell size={17} />
              <span>Alertas</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'recomendaciones' ? 'active' : ''}`}
              onClick={() => onTabChange('recomendaciones')}
            >
              <FileText size={17} />
              <span>Recomendaciones</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeTab === 'ia-proxy' ? 'active' : ''}`}
              onClick={() => onTabChange('ia-proxy')}
            >
              <Sparkles size={17} color="#6366f1" />
              <span>Proxy IA</span>
              <span className="nav-badge-ia">Backend</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
