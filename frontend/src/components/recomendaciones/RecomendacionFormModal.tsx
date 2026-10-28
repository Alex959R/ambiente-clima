import React, { useState } from 'react';
import { RecomendacionInput, Medicion, OrigenRecomendacion } from '../../types';
import { Modal } from '../common/Modal';

interface RecomendacionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecomendacionInput) => Promise<void>;
  mediciones: Medicion[];
  isLoading?: boolean;
}

export const RecomendacionFormModal: React.FC<RecomendacionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mediciones,
  isLoading = false,
}) => {
  const [texto, setTexto] = useState('');
  const [origen, setOrigen] = useState<OrigenRecomendacion>('manual');
  const [medicionId, setMedicionId] = useState<number>(mediciones[0]?.id || 1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!texto.trim()) {
      setError('El texto de la recomendación no puede estar vacío.');
      return;
    }

    if (!medicionId) {
      setError('Debes asociar una medición válida.');
      return;
    }

    try {
      await onSubmit({
        texto: texto.trim(),
        origen,
        medicion: medicionId,
      });
      setTexto('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar la recomendación');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Recomendación Ambiental"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert-box alert-box-danger" style={{ marginBottom: '1rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Medición de Referencia <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={medicionId}
            onChange={(e) => setMedicionId(Number(e.target.value))}
            required
            disabled={isLoading}
          >
            {mediciones.map((m) => (
              <option key={m.id} value={m.id}>
                #{m.id} - {m.tipo} ({m.valor} {m.unidad}) - {m.medicion_zona || `Zona ${m.zona}`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Origen de la Recomendación <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={origen}
            onChange={(e) => setOrigen(e.target.value as OrigenRecomendacion)}
            disabled={isLoading}
          >
            <option value="manual">Manual (Operador Comunitario / Autoridad)</option>
            <option value="ia">IA (Modelo Predictivo / Recomendador)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Texto de la Recomendación o Acción Sugerida <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Ej: Restringir actividades al aire libre durante las horas pico de radiación..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
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
            {isLoading ? 'Registrando...' : 'Guardar Recomendación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
