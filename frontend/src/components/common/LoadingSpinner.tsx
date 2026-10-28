import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Cargando información ambiental...' }) => {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p style={{ color: 'var(--gray-600)', fontWeight: 500 }}>{message}</p>
    </div>
  );
};
