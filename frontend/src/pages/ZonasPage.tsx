import React, { useState, useEffect, useCallback } from 'react';
import { Zona, ZonaInput } from '../types';
import { zonasService } from '../services/api';
import { ZonaStats } from '../components/zonas/ZonaStats';
import { ZonaList } from '../components/zonas/ZonaList';
import { ZonaFormModal } from '../components/zonas/ZonaFormModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ZonasPage: React.FC = () => {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zonaToEdit, setZonaToEdit] = useState<Zona | null>(null);

  // Cargar lista de zonas desde el servicio (Mock o Backend)
  const fetchZonas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await zonasService.getZonas();
      setZonas(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor de zonas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZonas();
  }, [fetchZonas]);

  // Mostrar mensaje de éxito temporal
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Abrir modal en modo creación
  const handleOpenCreate = () => {
    setZonaToEdit(null);
    setIsModalOpen(true);
  };

  // Abrir modal en modo edición
  const handleOpenEdit = (zona: Zona) => {
    setZonaToEdit(zona);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmitForm = async (data: ZonaInput, id?: number) => {
    try {
      setActionLoading(true);
      setError(null);

      if (id) {
        // Actualizar
        const updated = await zonasService.updateZona(id, data);
        setZonas((prev) => prev.map((z) => (z.id === id ? updated : z)));
        triggerSuccess(`Zona "${updated.nombre_de_zona}" actualizada exitosamente.`);
      } else {
        // Crear
        const created = await zonasService.createZona(data);
        setZonas((prev) => [created, ...prev]);
        triggerSuccess(`Zona "${created.nombre_de_zona}" creada exitosamente.`);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No fue posible guardar la zona.';
      setError(msg);
      throw err; // Para que el modal mantenga los datos si falló
    } finally {
      setActionLoading(false);
    }
  };

  // Alternar estado activo/inactivo directamente
  const handleToggleActive = async (zona: Zona) => {
    try {
      setActionLoading(true);
      setError(null);
      const updated = await zonasService.updateZona(zona.id, { activa: !zona.activa });
      setZonas((prev) => prev.map((z) => (z.id === zona.id ? updated : z)));
      triggerSuccess(
        `La zona "${zona.nombre_de_zona}" fue marcada como ${updated.activa ? 'Activa' : 'Inactiva'}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado de la zona.';
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar zona con confirmación
  const handleDelete = async (id: number) => {
    const zonaToDelete = zonas.find((z) => z.id === id);
    const confirmMessage = `¿Estás seguro de que deseas eliminar la zona "${zonaToDelete?.nombre_de_zona || id}"?\nEsta acción no se puede deshacer.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      setError(null);
      await zonasService.deleteZona(id);
      setZonas((prev) => prev.filter((z) => z.id !== id));
      triggerSuccess(`Zona eliminada correctamente.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar la zona.';
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Encabezado del Módulo */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Zonas Ambientales</h1>
          <p className="page-subtitle">
            Administra los territorios urbanos y rurales monitoreados para clima, calidad del aire y sensores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchZonas}
            className="btn btn-outline"
            disabled={loading || actionLoading}
            title="Recargar datos desde el backend"
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="btn btn-primary"
            disabled={actionLoading}
          >
            <Plus size={18} />
            <span>Nueva Zona</span>
          </button>
        </div>
      </header>

      {/* Notificaciones y Alertas Globales */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
          onRetry={fetchZonas}
        />
      )}

      {successMessage && (
        <div className="alert-box alert-box-success" role="status">
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <div className="alert-content">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="alert-close"
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      )}

      {/* Métricas y Estadísticas */}
      <ZonaStats zonas={zonas} />

      {/* Lista de Zonas o Indicador de Carga */}
      {loading ? (
        <LoadingSpinner message="Obteniendo zonas ambientales..." />
      ) : (
        <ZonaList
          zonas={zonas}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onOpenCreateModal={handleOpenCreate}
          isActionLoading={actionLoading}
        />
      )}

      {/* Modal para Crear y Editar Zonas */}
      <ZonaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        zonaToEdit={zonaToEdit}
        isLoading={actionLoading}
      />
    </div>
  );
};
