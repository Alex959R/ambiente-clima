import React, { useState } from 'react';
import { Navbar, NavTab } from './components/common/Navbar';
import { ZonasPage } from './pages/ZonasPage';
import { MedicionesPage } from './pages/MedicionesPage';
import { AlertasPage } from './pages/AlertasPage';
import { RecomendacionesPage } from './pages/RecomendacionesPage';
import { Sparkles, ArrowLeft, Bot, ShieldCheck, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('zonas');

  return (
    <div className="app-layout">
      {/* Barra de Navegación Principal */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido Principal */}
      <main className="main-content">
        {activeTab === 'zonas' && <ZonasPage />}

        {activeTab === 'mediciones' && <MedicionesPage />}

        {activeTab === 'alertas' && <AlertasPage />}

        {activeTab === 'recomendaciones' && <RecomendacionesPage />}

        {activeTab === 'ia-proxy' && (
          <div className="state-container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '1.25rem', borderRadius: '50%' }}>
              <Sparkles size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>
              Proxy de IA (Backend Django)
            </h2>
            <p style={{ color: 'var(--gray-600)', maxWidth: '620px', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Todos los módulos CRUD (<strong>Zonas</strong>, <strong>Mediciones</strong>, <strong>Alertas</strong> y <strong>Recomendaciones</strong>)
              ya están completamente integrados y operativos con la base de datos de Django REST Framework.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              width: '100%',
              margin: '1rem 0',
              textAlign: 'left'
            }}>
              <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <ShieldCheck size={18} />
                  <span>Seguridad de API Keys</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  Las claves de proveedores de IA residen exclusivamente en las variables de entorno de Django.
                </p>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <Cpu size={18} />
                  <span>Endpoint Pendiente</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  Pendiente crear la vista en Django para <code>POST /api/ia/interpretar-medicion/</code>.
                </p>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <Bot size={18} />
                  <span>Servicio Frontend</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  La función <code>iaProxyService.interpretarMedicion()</code> ya está declarada y lista para conectarse.
                </p>
              </div>
            </div>

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
