import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Medicion, MedicionInput, Zona } from '../types';
import { medicionesService, zonasService, iaProxyService } from '../services/api';
import { MedicionCard } from '../components/mediciones/MedicionCard';
import { MedicionFormModal } from '../components/mediciones/MedicionFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Plus, RefreshCw, CheckCircle2, Activity, Filter, Thermometer, Wind, CloudRain } from 'lucide-react';

export const MedicionesPage: React.FC = () => {
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [generatingIAId, setGeneratingIAId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [selectedZona, setSelectedZona] = useState<string>('todas');
  const [selectedTipo, setSelectedTipo] = useState<string>('todas');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [zonasData, medicionesData] = await Promise.all([
        zonasService.getZonas(),
        medicionesService.getMediciones(),
      ]);
      setZonas(zonasData);
      setMediciones(medicionesData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar mediciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleCreateMedicion = async (data: MedicionInput) => {
    try {
      setActionLoading(true);
      const created = await medicionesService.createMedicion(data);
      const zonaObj = zonas.find((z) => z.id === created.zona);
      const newMedicion = {
        ...created,
        medicion_zona: zonaObj ? zonaObj.nombre_de_zona : `Zona #${created.zona}`,
      };
      setMediciones((prev) => [newMedicion, ...prev]);
      triggerSuccess('Medición ambiental registrada con éxito en el backend.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar medición');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMedicion = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta medición?')) return;
    try {
      setActionLoading(true);
      await medicionesService.deleteMedicion(id);
      setMediciones((prev) => prev.filter((m) => m.id !== id));
      triggerSuccess('Medición eliminada correctamente.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar medición');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerarIA = async (id: number) => {
    try {
      setGeneratingIAId(id);
      setError(null);
      const recomendacion = await iaProxyService.generarRecomendacionIA(id);
      triggerSuccess(
        `✨ Recomendación de IA generada: "${recomendacion.texto.substring(0, 80)}..." (Revisa la pestaña Recomendaciones)`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al generar la recomendación con IA');
    } finally {
      setGeneratingIAId(null);
    }
  };

  // Filtrado
  const filteredMediciones = useMemo(() => {
    return mediciones.filter((m) => {
      const matchesZona = selectedZona === 'todas' || m.zona === Number(selectedZona);
      const matchesTipo = selectedTipo === 'todas' || m.tipo === selectedTipo;
      return matchesZona && matchesTipo;
    });
  }, [mediciones, selectedZona, selectedTipo]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: mediciones.length,
      temperatura: mediciones.filter((m) => m.tipo === 'temperatura').length,
      aire: mediciones.filter((m) => m.tipo === 'calidad_del_aire').length,
      lluvia: mediciones.filter((m) => m.tipo === 'lluvia').length,
      ruido: mediciones.filter((m) => m.tipo === 'ruido').length,
    };
  }, [mediciones]);

  return (
    <div>
      {/* Encabezado */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Monitoreo de Mediciones Ambientales</h1>
          <p className="page-subtitle">
            Registro de variables climáticas con asistencia de IA para generación de directrices inmediatas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchData}
            className="btn btn-outline"
            disabled={loading || actionLoading || generatingIAId !== null}
            title="Recargar mediciones"
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            disabled={actionLoading || generatingIAId !== null || zonas.length === 0}
            title={zonas.length === 0 ? 'Debes registrar al menos una zona primero' : 'Nueva medición'}
          >
            <Plus size={18} />
            <span>Nueva Medición</span>
          </button>
        </div>
      </header>

      {/* Alertas */}
      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} onRetry={fetchData} />
      )}
      {successMessage && (
        <div className="alert-box alert-box-success" role="status">
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <div className="alert-content">{successMessage}</div>
          <button onClick={() => setSuccessMessage(null)} className="alert-close">×</button>
        </div>
      )}

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Mediciones</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            <Thermometer size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.temperatura}</div>
            <div className="stat-label">Registros Temperatura</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>
            <Wind size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.aire}</div>
            <div className="stat-label">Calidad del Aire</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <CloudRain size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.lluvia}</div>
            <div className="stat-label">Lluvia / Precipitación</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
          <Filter size={18} />
          <span>Filtrar mediciones:</span>
        </div>

        <div className="filters-group">
          <select
            className="select-filter"
            value={selectedZona}
            onChange={(e) => setSelectedZona(e.target.value)}
          >
            <option value="todas">Todas las zonas</option>
            {zonas.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre_de_zona}
              </option>
            ))}
          </select>

          <select
            className="select-filter"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="todas">Todos los tipos de variable</option>
            <option value="temperatura">Temperatura</option>
            <option value="calidad_del_aire">Calidad del Aire</option>
            <option value="lluvia">Lluvia</option>
            <option value="ruido">Ruido</option>
          </select>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <LoadingSpinner message="Cargando mediciones ambientales..." />
      ) : filteredMediciones.length === 0 ? (
        <div className="state-container">
          <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: '#0284c7' }}>
            <Activity size={40} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            No hay mediciones registradas
          </h4>
          <p style={{ color: 'var(--gray-500)', maxWidth: '420px', fontSize: '0.9rem' }}>
            {selectedZona !== 'todas' || selectedTipo !== 'todas'
              ? 'No hay registros que coincidan con los filtros seleccionados.'
              : 'Aún no se han enviado lecturas de sensores para las zonas registradas.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={zonas.length === 0}
          >
            <Plus size={16} />
            <span>Registrar Primera Medición</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredMediciones.map((m) => {
            const zonaObj = zonas.find((z) => z.id === m.zona);
            return (
              <MedicionCard
                key={m.id}
                medicion={m}
                zonaNombre={zonaObj?.nombre_de_zona}
                onDelete={handleDeleteMedicion}
                onGenerarIA={handleGenerarIA}
                isActionLoading={actionLoading}
                isGeneratingIA={generatingIAId === m.id}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MedicionFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateMedicion}
          zonas={zonas}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
