import React from 'react';
import { Zona } from '../../types';
import { MapPin, Edit3, Trash2, Building2, Trees, Check, X } from 'lucide-react';

interface ZonaCardProps {
  zona: Zona;
  onEdit: (zona: Zona) => void;
  onDelete: (id: number) => void;
  onToggleActive: (zona: Zona) => void;
  isActionLoading?: boolean;
}

export const ZonaCard: React.FC<ZonaCardProps> = ({
  zona,
  onEdit,
  onDelete,
  onToggleActive,
  isActionLoading = false,
}) => {
  return (
    <article className="zona-card" aria-label={`Zona ${zona.nombre_de_zona}`}>
      <div className="zona-card-header">
        <div>
          <h4 className="zona-title">{zona.nombre_de_zona}</h4>
          <div className="zona-location">
            <MapPin size={14} />
            <span>{zona.municipio}</span>
          </div>
        </div>
      </div>

      <div className="zona-badges">
        <span className={`badge ${zona.tipo === 'urbana' ? 'badge-urbana' : 'badge-rural'}`}>
          {zona.tipo === 'urbana' ? <Building2 size={12} /> : <Trees size={12} />}
          {zona.tipo}
        </span>
        <span className={`badge ${zona.activa ? 'badge-activa' : 'badge-inactiva'}`}>
          {zona.activa ? <Check size={12} /> : <X size={12} />}
          {zona.activa ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <p className="zona-description" title={zona.descripcion}>
        {zona.descripcion || 'Sin descripción detallada registrada.'}
      </p>

      <div className="zona-card-footer">
        <label className="toggle-switch-label" title="Cambiar estado activo">
          <input
            type="checkbox"
            checked={zona.activa}
            onChange={() => onToggleActive(zona)}
            disabled={isActionLoading}
          />
          <span>{zona.activa ? 'Monitoreando' : 'Pausada'}</span>
        </label>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => onEdit(zona)}
            className="btn btn-sm btn-outline"
            disabled={isActionLoading}
            title="Editar información de la zona"
            aria-label="Editar zona"
          >
            <Edit3 size={14} />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDelete(zona.id)}
            className="btn btn-sm btn-danger-outline"
            disabled={isActionLoading}
            title="Eliminar zona"
            aria-label="Eliminar zona"
          >
            <Trash2 size={14} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </article>
  );
};
