import React from 'react';
import { Recomendacion } from '../../types';
import { Sparkles, UserCheck, Calendar, Activity } from 'lucide-react';

interface RecomendacionCardProps {
  recomendacion: Recomendacion;
  medicionLabel?: string;
}

export const RecomendacionCard: React.FC<RecomendacionCardProps> = ({
  recomendacion,
  medicionLabel,
}) => {
  const isIA = recomendacion.origen === 'ia';

  const formattedDate = new Date(recomendacion.fecha_y_hora).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      className="zona-card"
      style={{
        borderLeft: isIA ? '4px solid #8b5cf6' : '4px solid #0284c7',
      }}
      aria-label={`Recomendación ${recomendacion.origen}`}
    >
      <div className="zona-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isIA ? '#f5f3ff' : '#e0f2fe',
              color: isIA ? '#7c3aed' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isIA ? <Sparkles size={18} /> : <UserCheck size={18} />}
          </div>
          <div>
            <h4 className="zona-title" style={{ fontSize: '1rem' }}>
              {isIA ? 'Sugerencia Automatizada (IA)' : 'Directriz Comunitaria Manual'}
            </h4>
            <div className="zona-location">
              <Activity size={13} />
              <span>{medicionLabel || `Medición #${recomendacion.medicion}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="zona-badges">
        <span
          className="badge"
          style={{
            backgroundColor: isIA ? '#f5f3ff' : '#f0f9ff',
            color: isIA ? '#6d28d9' : '#0369a1',
            border: isIA ? '1px solid #ddd6fe' : '1px solid #bae6fd',
          }}
        >
          {isIA ? 'Origen: Inteligencia Artificial' : 'Origen: Operador Humano'}
        </span>
      </div>

      <p className="zona-description" style={{ fontStyle: isIA ? 'italic' : 'normal', WebkitLineClamp: 4 }}>
        "{recomendacion.texto}"
      </p>

      <div className="zona-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </article>
  );
};
