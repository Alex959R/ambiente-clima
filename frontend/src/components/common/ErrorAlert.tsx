import React from 'react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, onRetry }) => {
  return (
    <div className="alert-box alert-box-danger" role="alert">
      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div className="alert-content">
        <strong>Error en la operación: </strong>
        <span>{message}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderColor: 'var(--danger-500)', color: 'var(--danger-700)' }}
            title="Reintentar operación"
          >
            <RotateCcw size={12} />
            Reintentar
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="alert-close"
            aria-label="Cerrar mensaje de error"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
