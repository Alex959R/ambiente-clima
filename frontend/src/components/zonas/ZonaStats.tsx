import React from 'react';
import { Zona } from '../../types';
import { MapPin, Building2, Trees, CheckCircle2 } from 'lucide-react';

interface ZonaStatsProps {
  zonas: Zona[];
}

export const ZonaStats: React.FC<ZonaStatsProps> = ({ zonas }) => {
  const total = zonas.length;
  const urbanas = zonas.filter((z) => z.tipo === 'urbana').length;
  const rurales = zonas.filter((z) => z.tipo === 'rural').length;
  const activas = zonas.filter((z) => z.activa).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
          <MapPin size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Zonas Registradas</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
          <Building2 size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{urbanas}</div>
          <div className="stat-label">Zonas Urbanas</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
          <Trees size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{rurales}</div>
          <div className="stat-label">Zonas Rurales</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--info-50)', color: 'var(--info-500)' }}>
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{activas}</div>
          <div className="stat-label">Zonas en Monitoreo Activo</div>
        </div>
      </div>
    </div>
  );
};
