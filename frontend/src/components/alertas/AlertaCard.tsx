import React from 'react';
import { Alerta } from '../../types';
import { AlertTriangle, CheckCircle2, Calendar, MapPin, Check } from 'lucide-react';

interface AlertaCardProps {
  alerta: Alerta;
  zonaNombre?: string;
  onResolve: (id: number) => void;
  isActionLoading?: boolean;
}

export const AlertaCard: React.FC<AlertaCardProps> = ({
  alerta,
  zonaNombre,
  onResolve,
  isActionLoading = false,
}) => {
  const getNivelBadge = (nivel: Alerta['nivel']) => {
    switch (nivel) {
      case 'alto':
        return {
          bg: '#fee2e2',
          color: '#991b1b',
          border: '#fca5a5',
          label: 'Nivel Alto',
        };
      case 'medio':
        return {
          bg: '#fef3c7',
          color: '#92400e',
          border: '#fcd34d',
          label: 'Nivel Medio',
        };
      case 'bajo':
        return {
          bg: '#e0e7ff',
          color: '#3730a3',
          border: '#c7d2fe',
          label: 'Nivel Bajo',
        };
    }
  };

  const nivelMeta = getNivelBadge(alerta.nivel);
  const isResuelta = alerta.estado === 'resuelta';

  const formattedDate = new Date(alerta.fecha_y_hora).toLocaleString('es-CO', {
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
        borderLeft: `4px solid ${isResuelta ? '#10b981' : alerta.nivel === 'alto' ? '#ef4444' : alerta.nivel === 'medio' ? '#f59e0b' : '#3b82f6'}`,
      }}
      aria-label={`Alerta ${alerta.titulo}`}
    >
      <div className="zona-card-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isResuelta ? 'var(--primary-50)' : nivelMeta.bg,
              color: isResuelta ? 'var(--primary-700)' : nivelMeta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.15rem',
            }}
          >
            {isResuelta ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <h4 className="zona-title">{alerta.titulo}</h4>
            <div className="zona-location">
              <MapPin size={13} />
              <span>{alerta.alerta_zona || zonaNombre || `Zona #${alerta.zona}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="zona-badges">
        <span
          className="badge"
          style={{
            backgroundColor: nivelMeta.bg,
            color: nivelMeta.color,
            border: `1px solid ${nivelMeta.border}`,
          }}
        >
          {nivelMeta.label}
        </span>
        <span
          className="badge"
          style={{
            backgroundColor: isResuelta ? 'var(--primary-100)' : 'var(--warning-50)',
            color: isResuelta ? 'var(--primary-800)' : 'var(--warning-700)',
          }}
        >
          {isResuelta ? 'Resuelta' : 'Activa'}
        </span>
      </div>

      <p className="zona-description" style={{ WebkitLineClamp: 4 }}>
        {alerta.descripcion}
      </p>

      <div className="zona-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        {!isResuelta ? (
          <button
            onClick={() => onResolve(alerta.id)}
            className="btn btn-sm btn-primary"
            disabled={isActionLoading}
            title="Marcar alerta como resuelta"
          >
            <Check size={14} />
            <span>Resolver</span>
          </button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            ✓ Atendida
          </span>
        )}
      </div>
    </article>
  );
};
