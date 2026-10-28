import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alerta, AlertaInput, Zona } from '../types';
import { alertasService, zonasService } from '../services/api';
import { AlertaCard } from '../components/alertas/AlertaCard';
import { AlertaFormModal } from '../components/alertas/AlertaFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Plus, RefreshCw, CheckCircle2, Bell, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const AlertasPage: React.FC = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtros
  const [selectedEstado, setSelectedEstado] = useState<string>('todas');
  const [selectedNivel, setSelectedNivel] = useState<string>('todas');
  const [selectedZona, setSelectedZona] = useState<string>('todas');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [zonasData, alertasData] = await Promise.all([
        zonasService.getZonas(),
        alertasService.getAlertas(),
      ]);
      setZonas(zonasData);
      setAlertas(alertasData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar alertas');
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

  const handleCreateAlerta = async (data: AlertaInput) => {
    try {
      setActionLoading(true);
      const created = await alertasService.createAlerta(data);
      const zonaObj = zonas.find((z) => z.id === created.zona);
      const newAlerta = {
        ...created,
        alerta_zona: zonaObj ? zonaObj.nombre_de_zona : `Zona #${created.zona}`,
      };
      setAlertas((prev) => [newAlerta, ...prev]);
      triggerSuccess('Alerta ambiental emitida con éxito.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al emitir alerta');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveAlerta = async (id: number) => {
    try {
      setActionLoading(true);
      const resolved = await alertasService.resolveAlerta(id);
      setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, estado: resolved.estado } : a)));
      triggerSuccess('Alerta marcada como resuelta.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al resolver alerta');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtrado
  const filteredAlertas = useMemo(() => {
    return alertas.filter((a) => {
      const matchesEstado = selectedEstado === 'todas' || a.estado === selectedEstado;
      const matchesNivel = selectedNivel === 'todas' || a.nivel === selectedNivel;
      const matchesZona = selectedZona === 'todas' || a.zona === Number(selectedZona);
      return matchesEstado && matchesNivel && matchesZona;
    });
  }, [alertas, selectedEstado, selectedNivel, selectedZona]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: alertas.length,
      activas: alertas.filter((a) => a.estado === 'activa').length,
      criticas: alertas.filter((a) => a.nivel === 'alto' && a.estado === 'activa').length,
      resueltas: alertas.filter((a) => a.estado === 'resuelta').length,
    };
  }, [alertas]);

  return (
    <div>
      {/* Encabezado */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Sistema de Alertas Comunitarias</h1>
          <p className="page-subtitle">
            Monitoreo preventivo y respuesta rápida ante anomalías climáticas y contingencias ambientales.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchData}
            className="btn btn-outline"
            disabled={loading || actionLoading}
            title="Recargar alertas"
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            disabled={actionLoading || zonas.length === 0}
            title={zonas.length === 0 ? 'Debes registrar al menos una zona primero' : 'Emitir alerta'}
          >
            <Plus size={18} />
            <span>Emitir Alerta</span>
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
            <Bell size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Alertas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.activas}</div>
            <div className="stat-label">Alertas Activas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.criticas}</div>
            <div className="stat-label">Activas de Nivel Alto</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.resueltas}</div>
            <div className="stat-label">Atendidas / Resueltas</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
          <Filter size={18} />
          <span>Filtros de visualización:</span>
        </div>

        <div className="filters-group">
          <select
            className="select-filter"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
          >
            <option value="todas">Todos los estados</option>
            <option value="activa">Solo Activas</option>
            <option value="resuelta">Solo Resueltas</option>
          </select>

          <select
            className="select-filter"
            value={selectedNivel}
            onChange={(e) => setSelectedNivel(e.target.value)}
          >
            <option value="todas">Todos los niveles</option>
            <option value="alto">Alto (Crítico)</option>
            <option value="medio">Medio (Precaución)</option>
            <option value="bajo">Bajo (Informativo)</option>
          </select>

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
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <LoadingSpinner message="Consultando alertas del sistema..." />
      ) : filteredAlertas.length === 0 ? (
        <div className="state-container">
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '50%', color: '#047857' }}>
            <ShieldCheck size={40} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)' }}>
            Sin alertas activas para el filtro actual
          </h4>
          <p style={{ color: 'var(--gray-500)', maxWidth: '420px', fontSize: '0.9rem' }}>
            {selectedEstado !== 'todas' || selectedNivel !== 'todas' || selectedZona !== 'todas'
              ? 'No hay registros que coincidan con los criterios seleccionados.'
              : 'El sistema no registra alertas vigentes en este momento. Todos los territorios están en condiciones admisibles.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            disabled={zonas.length === 0}
          >
            <Plus size={16} />
            <span>Emitir Alerta Preventiva</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredAlertas.map((a) => {
            const zonaObj = zonas.find((z) => z.id === a.zona);
            return (
              <AlertaCard
                key={a.id}
                alerta={a}
                zonaNombre={zonaObj?.nombre_de_zona}
                onResolve={handleResolveAlerta}
                isActionLoading={actionLoading}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AlertaFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAlerta}
          zonas={zonas}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
