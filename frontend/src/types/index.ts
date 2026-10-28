/**
 * Interfaces y Tipos del Sistema de Monitoreo "Ambiente y Clima"
 * Modelos sincronizados con los serializers y modelos de Django backend.
 */

// ==========================================
// 1. Zona
// ==========================================
export type TipoZona = 'urbana' | 'rural';

export interface Zona {
  id: number;
  nombre_de_zona: string;
  municipio: string;
  descripcion: string;
  tipo: TipoZona;
  activa: boolean;
}

export type ZonaInput = Omit<Zona, 'id'>;

// ==========================================
// 2. Medición
// ==========================================
export type TipoMedicion = 'temperatura' | 'calidad_del_aire' | 'lluvia' | 'ruido';

export interface Medicion {
  id: number;
  tipo: TipoMedicion;
  valor: number;
  unidad: string;
  fecha_y_hora: string; // ISO 8601 string
  zona: number; // ID de la Zona relacionada
  medicion_zona?: string; // Nombre de la zona retornado por el serializer
}

export type MedicionInput = Omit<Medicion, 'id' | 'medicion_zona'>;

// ==========================================
// 3. Alerta
// ==========================================
export type NivelAlerta = 'bajo' | 'medio' | 'alto';
export type EstadoAlerta = 'activa' | 'resuelta';

export interface Alerta {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: NivelAlerta;
  estado: EstadoAlerta;
  fecha_y_hora: string; // ISO 8601 string
  zona: number; // ID de la Zona
  medicion?: number | null; // ID de la Medición (opcional)
  alerta_zona?: string; // Nombre de la zona retornado por el serializer
}

export type AlertaInput = Omit<Alerta, 'id' | 'fecha_y_hora' | 'alerta_zona'>;

// ==========================================
// 4. Recomendación
// ==========================================
export type OrigenRecomendacion = 'manual' | 'ia';

export interface Recomendacion {
  id: number;
  texto: string;
  origen: OrigenRecomendacion;
  fecha_y_hora: string; // ISO 8601 string
  medicion: number; // ID de la Medición
}

export type RecomendacionInput = Omit<Recomendacion, 'id' | 'fecha_y_hora'>;

// ==========================================
// 5. Proxy de IA (Backend Django Proxy)
// ==========================================
export interface SolicitudInterpretacionIA {
  medicion_id: number;
  contexto_adicional?: string;
}

export interface RespuestaInterpretacionIA {
  medicion_id: number;
  resumen_interpretacion: string;
  nivel_impacto: 'optimo' | 'moderado' | 'critico';
  recomendacion_sugerida: string;
  requiere_alerta: boolean;
  alerta_sugerida?: {
    titulo: string;
    descripcion: string;
    nivel: NivelAlerta;
  };
  fecha_generacion: string;
}

// ==========================================
// Estado de UI común
// ==========================================
export interface UIState {
  loading: boolean;
  error: string | null;
  successMessage?: string | null;
}
