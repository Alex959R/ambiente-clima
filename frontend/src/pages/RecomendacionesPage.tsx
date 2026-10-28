import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Recomendacion, RecomendacionInput, Medicion } from '../types';
import { recomendacionesService, medicionesService } from '../services/api';
import { RecomendacionCard } from '../components/recomendaciones/RecomendacionCard';
import { RecomendacionFormModal } from '../components/recomendaciones/RecomendacionFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Plus, RefreshCw, CheckCircle2, FileText, Sparkles, UserCheck, Filter } from 'lucide-react';

export const RecomendacionesPage: React.FC = () => {
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtros
  const [selectedOrigen, setSelectedOrigen] = useState<string>('todas');
  const [selectedMedicion, setSelectedMedicion] = useState<string>('todas');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [recData, medData] = await Promise.all([
        recomendacionesService.getRecomendaciones(),
        medicionesService.getMediciones(),
      ]);
      setRecomendaciones(recData);
      setMediciones(medData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar recomendaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCreateRecomendacion = async (data: RecomendacionInput) => {
    try {
      setActionLoading(true);
      const created = await recomendacionesService.createRecomendacion(data);
      setRecomendaciones((prev) => [created, ...prev]);
      triggerSuccess('Recomendación ambiental registrada con éxito en el backend.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar recomendación');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Filtrado
  const filteredRecs = useMemo(() => {
    return recomendaciones.filter((r) => {
      const matchesOrigen = selectedOrigen === 'todas' || r.origen === selectedOrigen;
      const matchesMedicion = selectedMedicion === 'todas' || r.medicion === Number(selectedMedicion);
      return matchesOrigen && matchesMedicion;
    });
  }, [recomendaciones, selectedOrigen, selectedMedicion]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: recomendaciones.length,
      ia: recomendaciones.filter((r) => r.origen === 'ia').length,
      manual: recomendaciones.filter((r) => r.origen === 'manual').length,
    };
  }, [recomendaciones]);

  return (
    <div>
      {/* Encabezado */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Directrices y Recomendaciones Ambientales</h1>
          <p className="page-subtitle">
            Pautas de prevención ciudadana emitidas por operadores técnicos y modelos predictivos de IA.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchData}
            className="btn btn-outline"
            disabled={loading || actionLoading}
            title="Recargar recomendaciones"
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            disabled={actionLoading || mediciones.length === 0}
            title={mediciones.length === 0 ? 'Debes registrar al menos una medición primero' : 'Nueva recomendación'}
          >
            <Plus size={18} />
            <span>Nueva Recomendación</span>
          </button>
        </div>
      </header>

      {/* Alertas */}
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} onRetry={fetchData} />}
      {successMessage && (
        <div className="alert-box alert-box-success" role="status">
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <div className="alert-content">{successMessage}</div>
          <button onClick={() => setSuccessMessage(null)} className="alert-close">×</button>
        </div>
      )}

      {/* Métricas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Recomendaciones</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <Sparkles size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.ia}</div>
            <div className="stat-label">Generadas por IA</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.manual}</div>
            <div className="stat-label">Registradas por Operadores</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
          <Filter size={18} />
          <span>Filtrar directrices:</span>
        </div>

        <div className="filters-group">
          <select
            className="select-filter"
            value={selectedOrigen}
            onChange={(e) => setSelectedOrigen(e.target.value)}
          >
            <option value="todas">Todos los orígenes</option>
            <option value="ia">Solo IA</option>
            <option value="manual">Solo Manuales</option>
          </select>

          <select
            className="select-filter"
            value={selectedMedicion}
            onChange={(e) => setSelectedMedicion(e.target.value)}
          >
            <option value="todas">Todas las mediciones vinculadas</option>
            {mediciones.map((m) => (
              <option key={m.id} value={m.id}>
                Medición #{m.id} ({m.tipo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <LoadingSpinner message="Consultando recomendaciones..." />
      ) : filteredRecs.length === 0 ? (
        <div className="state-container">
          <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '50%', color: '#7c3aed' }}>
            <FileText size={40} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            No hay recomendaciones registradas
          </h4>
          <p style={{ color: 'var(--gray-500)', maxWidth: '420px', fontSize: '0.9rem' }}>
            {selectedOrigen !== 'todas' || selectedMedicion !== 'todas'
              ? 'No hay registros que coincidan con los filtros seleccionados.'
              : 'Aún no se han emitido recomendaciones comunitarias para las mediciones registradas.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={mediciones.length === 0}
          >
            <Plus size={16} />
            <span>Emitir Recomendación</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredRecs.map((r) => {
            const medObj = mediciones.find((m) => m.id === r.medicion);
            const medLabel = medObj
              ? `Medición #${medObj.id}: ${medObj.tipo} (${medObj.valor} ${medObj.unidad})`
              : `Medición #${r.medicion}`;
            return (
              <RecomendacionCard
                key={r.id}
                recomendacion={r}
                medicionLabel={medLabel}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <RecomendacionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateRecomendacion}
          mediciones={mediciones}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
