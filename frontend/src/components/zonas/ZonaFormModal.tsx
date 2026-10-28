import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Zona, ZonaInput } from '../../types';
import { Save, AlertTriangle } from 'lucide-react';

interface ZonaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ZonaInput, id?: number) => Promise<void>;
  zonaToEdit?: Zona | null;
  isLoading: boolean;
}

export const ZonaFormModal: React.FC<ZonaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  zonaToEdit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ZonaInput>({
    nombre_de_zona: '',
    municipio: '',
    descripcion: '',
    tipo: 'urbana',
    activa: true,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (zonaToEdit) {
      setFormData({
        nombre_de_zona: zonaToEdit.nombre_de_zona,
        municipio: zonaToEdit.municipio,
        descripcion: zonaToEdit.descripcion,
        tipo: zonaToEdit.tipo,
        activa: zonaToEdit.activa,
      });
    } else {
      setFormData({
        nombre_de_zona: '',
        municipio: '',
        descripcion: '',
        tipo: 'urbana',
        activa: true,
      });
    }
    setFormErrors({});
  }, [zonaToEdit, isOpen]);

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.nombre_de_zona.trim()) {
      errors.nombre_de_zona = 'El nombre de la zona es obligatorio.';
    } else if (formData.nombre_de_zona.length > 100) {
      errors.nombre_de_zona = 'Máximo 100 caracteres permitidos.';
    }

    if (!formData.municipio.trim()) {
      errors.municipio = 'El municipio es obligatorio.';
    } else if (formData.municipio.length > 100) {
      errors.municipio = 'Máximo 100 caracteres permitidos.';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es obligatoria.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData, zonaToEdit ? zonaToEdit.id : undefined);
      onClose();
    } catch {
      // Error is handled in the parent component
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={zonaToEdit ? `Editar Zona: ${zonaToEdit.nombre_de_zona}` : 'Registrar Nueva Zona'}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="nombre_de_zona">
            Nombre de la Zona <span className="required">*</span>
          </label>
          <input
            id="nombre_de_zona"
            type="text"
            className="form-input"
            placeholder="Ej. Parque Central, Cuenca Río Aburrá"
            value={formData.nombre_de_zona}
            onChange={(e) => setFormData({ ...formData, nombre_de_zona: e.target.value })}
            disabled={isLoading}
            maxLength={100}
            required
          />
          {formErrors.nombre_de_zona && (
            <p className="form-error">
              <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {formErrors.nombre_de_zona}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="municipio">
            Municipio / Ciudad <span className="required">*</span>
          </label>
          <input
            id="municipio"
            type="text"
            className="form-input"
            placeholder="Ej. Medellín, Envigado, Bello"
            value={formData.municipio}
            onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
            disabled={isLoading}
            maxLength={100}
            required
          />
          {formErrors.municipio && (
            <p className="form-error">
              <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {formErrors.municipio}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tipo">
            Tipo de Territorio <span className="required">*</span>
          </label>
          <select
            id="tipo"
            className="form-select"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'urbana' | 'rural' })}
            disabled={isLoading}
          >
            <option value="urbana">Urbana</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="descripcion">
            Descripción y Contexto Ambiental <span className="required">*</span>
          </label>
          <textarea
            id="descripcion"
            className="form-textarea"
            rows={3}
            placeholder="Detalles sobre vegetación, fuentes de contaminación o características geográficas..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            disabled={isLoading}
            required
          />
          {formErrors.descripcion && (
            <p className="form-error">
              <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {formErrors.descripcion}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              disabled={isLoading}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Zona habilitada para recepción de mediciones (Activa)
            </span>
          </label>
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
            <Save size={16} />
            <span>{isLoading ? 'Guardando...' : zonaToEdit ? 'Actualizar Zona' : 'Crear Zona'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
