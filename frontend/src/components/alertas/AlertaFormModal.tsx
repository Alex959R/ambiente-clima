import React, { useState } from 'react';
import { AlertaInput, Zona, NivelAlerta, EstadoAlerta } from '../../types';
import { Modal } from '../common/Modal';

interface AlertaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlertaInput) => Promise<void>;
  zonas: Zona[];
  isLoading?: boolean;
}

export const AlertaFormModal: React.FC<AlertaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  zonas,
  isLoading = false,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState<NivelAlerta>('medio');
  const [estado, setEstado] = useState<EstadoAlerta>('activa');
  const [zonaId, setZonaId] = useState<number>(zonas[0]?.id || 1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError('El título de la alerta es obligatorio.');
      return;
    }

    if (!descripcion.trim()) {
      setError('La descripción detallada es obligatoria.');
      return;
    }

    if (!zonaId) {
      setError('Debes asociar una zona territorial a la alerta.');
      return;
    }

    try {
      await onSubmit({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        nivel,
        estado,
        zona: zonaId,
      });
      setTitulo('');
      setDescripcion('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar la alerta');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emitir Nueva Alerta Ambiental"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert-box alert-box-danger" style={{ marginBottom: '1rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Título de la Alerta <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Alerta por altas concentraciones de material particulado"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Zona Afectada <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={zonaId}
            onChange={(e) => setZonaId(Number(e.target.value))}
            required
            disabled={isLoading}
          >
            {zonas.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre_de_zona} ({z.municipio})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Nivel de Severidad <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={nivel}
              onChange={(e) => setNivel(e.target.value as NivelAlerta)}
              disabled={isLoading}
            >
              <option value="bajo">Bajo (Informativo)</option>
              <option value="medio">Medio (Precaución)</option>
              <option value="alto">Alto (Crítico)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Estado Inicial <span className="required">*</span>
            </label>
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoAlerta)}
              disabled={isLoading}
            >
              <option value="activa">Activa</option>
              <option value="resuelta">Resuelta</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Descripción y Protocolo de Contingencia <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Describe las causas de la alerta, valores excedidos y acciones inmediatas sugeridas..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem -1.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Emitiendo...' : 'Publicar Alerta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
