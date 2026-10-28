import React, { useState, useMemo } from 'react';
import { Zona } from '../../types';
import { ZonaCard } from './ZonaCard';
import { Search, Filter, MapPinOff, Plus } from 'lucide-react';

interface ZonaListProps {
  zonas: Zona[];
  onEdit: (zona: Zona) => void;
  onDelete: (id: number) => void;
  onToggleActive: (zona: Zona) => void;
  onOpenCreateModal: () => void;
  isActionLoading?: boolean;
}

export const ZonaList: React.FC<ZonaListProps> = ({
  zonas,
  onEdit,
  onDelete,
  onToggleActive,
  onOpenCreateModal,
  isActionLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'todas' | 'urbana' | 'rural'>('todas');
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'activas' | 'inactivas'>('todas');

  const filteredZonas = useMemo(() => {
    return zonas.filter((zona) => {
      const matchesSearch =
        zona.nombre_de_zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zona.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zona.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = tipoFilter === 'todas' || zona.tipo === tipoFilter;

      const matchesEstado =
        estadoFilter === 'todas' ||
        (estadoFilter === 'activas' && zona.activa) ||
        (estadoFilter === 'inactivas' && !zona.activa);

      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [zonas, searchTerm, tipoFilter, estadoFilter]);

  return (
    <div>
      {/* Barra de Búsqueda y Filtros */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, municipio o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            <Filter size={16} />
            <span>Filtros:</span>
          </div>

          <select
            className="select-filter"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as 'todas' | 'urbana' | 'rural')}
            aria-label="Filtrar por tipo de zona"
          >
            <option value="todas">Todos los tipos</option>
            <option value="urbana">Solo Urbanas</option>
            <option value="rural">Solo Rurales</option>
          </select>

          <select
            className="select-filter"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as 'todas' | 'activas' | 'inactivas')}
            aria-label="Filtrar por estado de monitoreo"
          >
            <option value="todas">Todos los estados</option>
            <option value="activas">Solo Activas</option>
            <option value="inactivas">Solo Inactivas</option>
          </select>
        </div>
      </div>

      {/* Resultados o Estado Vacío */}
      {filteredZonas.length === 0 ? (
        <div className="state-container">
          <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '50%', color: 'var(--gray-400)' }}>
            <MapPinOff size={42} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            No se encontraron zonas
          </h4>
          <p style={{ color: 'var(--gray-500)', maxWidth: '420px', fontSize: '0.9rem' }}>
            {searchTerm || tipoFilter !== 'todas' || estadoFilter !== 'todas'
              ? 'No hay zonas que coincidan con los criterios de búsqueda o filtros aplicados.'
              : 'Aún no hay zonas registradas en el sistema ambiental. ¡Crea la primera para iniciar el monitoreo!'}
          </p>
          <button className="btn btn-primary" onClick={onOpenCreateModal} style={{ marginTop: '0.5rem' }}>
            <Plus size={16} />
            <span>Registrar Nueva Zona</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredZonas.map((zona) => (
            <ZonaCard
              key={zona.id}
              zona={zona}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              isActionLoading={isActionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};
