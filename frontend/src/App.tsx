import React, { useState } from 'react';
import { Navbar, NavTab } from './components/common/Navbar';
import { ZonasPage } from './pages/ZonasPage';
import { Activity, Bell, FileText, Sparkles, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('zonas');

  return (
    <div className="app-layout">
      {/* Barra de Navegación Principal */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido Principal */}
      <main className="main-content">
        {activeTab === 'zonas' && <ZonasPage />}

        {activeTab === 'mediciones' && (
          <div className="state-container">
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '1.25rem', borderRadius: '50%' }}>
              <Activity size={48} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Módulo de Mediciones Ambientales
            </h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '520px', fontSize: '0.95rem' }}>
              Este módulo formará parte de la <strong>Fase 2</strong>. Aquí se visualizarán y registrarán los datos de
              temperatura, calidad del aire, lluvia y ruido asociados a cada zona.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('zonas')}>
              <ArrowLeft size={16} />
              <span>Volver a Gestión de Zonas</span>
            </button>
          </div>
        )}

        {activeTab === 'alertas' && (
          <div className="state-container">
            <div style={{ background: 'var(--warning-50)', color: 'var(--warning-700)', padding: '1.25rem', borderRadius: '50%' }}>
              <Bell size={48} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Módulo de Alertas Críticas
            </h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '520px', fontSize: '0.95rem' }}>
              Programado para la <strong>Fase 3</strong>. Permitirá activar alertas en niveles bajo, medio y alto
              cuando las mediciones excedan los límites ambientales admisibles.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('zonas')}>
              <ArrowLeft size={16} />
              <span>Volver a Gestión de Zonas</span>
            </button>
          </div>
        )}

        {activeTab === 'recomendaciones' && (
          <div className="state-container">
            <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '1.25rem', borderRadius: '50%' }}>
              <FileText size={48} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Módulo de Recomendaciones
            </h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '520px', fontSize: '0.95rem' }}>
              Programado para la <strong>Fase 4</strong>. Muestra recomendaciones comunitarias de origen manual o
              sugeridas automáticamente por el proxy de IA.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('zonas')}>
              <ArrowLeft size={16} />
              <span>Volver a Gestión de Zonas</span>
            </button>
          </div>
        )}

        {activeTab === 'ia-proxy' && (
          <div className="state-container">
            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '1.25rem', borderRadius: '50%' }}>
              <Sparkles size={48} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Proxy de IA (Backend Django)
            </h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '540px', fontSize: '0.95rem' }}>
              Programado para la <strong>Fase 5</strong>. El cliente enviará solicitudes al endpoint seguro de Django
              (ej: <code>/api/ia/interpretar-medicion/</code>), garantizando <strong>cero exposición de API keys</strong> en
              el frontend. Las funciones del servicio mock ya están listas en <code>api.ts</code>.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('zonas')}>
              <ArrowLeft size={16} />
              <span>Volver a Gestión de Zonas</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
