import React, { useState } from 'react';
import { MedicionInput, Zona, TipoMedicion } from '../../types';
import { Modal } from '../common/Modal';

interface MedicionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicionInput) => Promise<void>;
  zonas: Zona[];
  isLoading?: boolean;
}

const TIPO_UNIDADES: Record<TipoMedicion, string> = {
  temperatura: '°C',
  calidad_del_aire: 'AQI (PM2.5)',
  lluvia: 'mm',
  ruido: 'dB',
};

export const MedicionFormModal: React.FC<MedicionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  zonas,
  isLoading = false,
}) => {
  const [tipo, setTipo] = useState<TipoMedicion>('temperatura');
  const [valor, setValor] = useState<string>('');
  const [unidad, setUnidad] = useState<string>('°C');
  const [zonaId, setZonaId] = useState<number>(zonas[0]?.id || 1);
  const [error, setError] = useState<string | null>(null);

  const handleTipoChange = (newTipo: TipoMedicion) => {
    setTipo(newTipo);
    setUnidad(TIPO_UNIDADES[newTipo]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numValor = parseFloat(valor);
    if (isNaN(numValor)) {
      setError('Por favor ingresa un valor numérico válido.');
      return;
    }

    if (!zonaId) {
      setError('Debes seleccionar una zona válida.');
      return;
    }

    try {
      await onSubmit({
        tipo,
        valor: numValor,
        unidad: unidad.trim(),
        fecha_y_hora: new Date().toISOString(),
        zona: zonaId,
      });
      // Limpiar formulario al terminar
      setValor('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar medición');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nueva Medición Ambiental"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert-box alert-box-danger" style={{ marginBottom: '1rem' }}>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Zona Ambiental <span className="required">*</span>
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

        <div className="form-group">
          <label className="form-label">
            Tipo de Variable <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => handleTipoChange(e.target.value as TipoMedicion)}
            disabled={isLoading}
          >
            <option value="temperatura">Temperatura (°C)</option>
            <option value="calidad_del_aire">Calidad del Aire (AQI)</option>
            <option value="lluvia">Precipitación / Lluvia (mm)</option>
            <option value="ruido">Nivel Sonoro / Ruido (dB)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Valor Registrado <span className="required">*</span>
            </label>
            <input
              type="number"
              step="any"
              className="form-input"
              placeholder="Ej: 24.5"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Unidad de Medida <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
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
            {isLoading ? 'Registrando...' : 'Guardar Medición'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
