import React from 'react';
import { Medicion } from '../../types';
import { Thermometer, Wind, CloudRain, Volume2, Trash2, Calendar, MapPin, Sparkles, RefreshCw } from 'lucide-react';

interface MedicionCardProps {
  medicion: Medicion;
  zonaNombre?: string;
  onDelete: (id: number) => void;
  onGenerarIA: (id: number) => void;
  isActionLoading?: boolean;
  isGeneratingIA?: boolean;
}

export const MedicionCard: React.FC<MedicionCardProps> = ({
  medicion,
  zonaNombre,
  onDelete,
  onGenerarIA,
  isActionLoading = false,
  isGeneratingIA = false,
}) => {
  const getIconAndColor = (tipo: Medicion['tipo']) => {
    switch (tipo) {
      case 'temperatura':
        return {
          icon: <Thermometer size={22} />,
          color: '#ef4444',
          bg: '#fee2e2',
          label: 'Temperatura',
        };
      case 'calidad_del_aire':
        return {
          icon: <Wind size={22} />,
          color: '#8b5cf6',
          bg: '#ede9fe',
          label: 'Calidad del Aire',
        };
      case 'lluvia':
        return {
          icon: <CloudRain size={22} />,
          color: '#3b82f6',
          bg: '#dbeafe',
          label: 'Precipitación',
        };
      case 'ruido':
        return {
          icon: <Volume2 size={22} />,
          color: '#f59e0b',
          bg: '#fef3c7',
          label: 'Nivel Sonoro',
        };
      default:
        return {
          icon: <Thermometer size={22} />,
          color: 'var(--primary-600)',
          bg: 'var(--primary-50)',
          label: tipo,
        };
    }
  };

  const meta = getIconAndColor(medicion.tipo);
  const formattedDate = new Date(medicion.fecha_y_hora).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="zona-card" aria-label={`Medición ${medicion.tipo}`}>
      <div className="zona-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: meta.bg,
              color: meta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <h4 className="zona-title">{meta.label}</h4>
            <div className="zona-location">
              <MapPin size={13} />
              <span>{medicion.medicion_zona || zonaNombre || `Zona #${medicion.zona}`}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: '1rem 0' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--gray-900)' }}>
          {medicion.valor}{' '}
          <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--gray-500)' }}>
            {medicion.unidad}
          </span>
        </div>
      </div>

      <div className="zona-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-500)', fontSize: '0.8rem' }}>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => onGenerarIA(medicion.id)}
            className="btn btn-sm btn-outline"
            style={{ borderColor: '#8b5cf6', color: '#7c3aed', backgroundColor: '#f5f3ff' }}
            disabled={isActionLoading || isGeneratingIA}
            title="Generar recomendación asistida por IA para esta medición"
            aria-label="Generar con IA"
          >
            {isGeneratingIA ? (
              <RefreshCw size={14} className="spinner" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{isGeneratingIA ? 'IA...' : 'Generar IA'}</span>
          </button>

          <button
            onClick={() => onDelete(medicion.id)}
            className="btn btn-sm btn-danger-outline"
            disabled={isActionLoading || isGeneratingIA}
            title="Eliminar medición"
            aria-label="Eliminar medición"
          >
            <Trash2 size={14} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </article>
  );
};
