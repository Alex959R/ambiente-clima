/**
 * SERVICIOS DE API - AMBIENTE Y CLIMA
 * 
 * NOTA DE ARQUITECTURA:
 * - El frontend consume exclusivamente la API REST de Django.
 * - Toda interacción de IA se realiza como proxy a través de los endpoints de Django.
 *   (Está PROHIBIDO llamar a proveedores de IA externos directamente desde el cliente).
 * - Las llamadas a Zonas, Mediciones, Alertas y Recomendaciones están conectadas
 *   directamente al backend Django REST Framework.
 * - El servicio de IA proxy se mantiene con simulación controlada hasta que el endpoint
 *   correspondiente sea expuesto en el backend.
 */

import {
  Zona,
  ZonaInput,
  Medicion,
  MedicionInput,
  Alerta,
  AlertaInput,
  Recomendacion,
  RecomendacionInput,
  SolicitudInterpretacionIA,
  RespuestaInterpretacionIA,
} from '../types';

import {
  INITIAL_MEDICIONES,
} from './mockData';

// Configuración base de la API Django
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Utilidad para extraer listas considerando paginación DRF (results) o arrays planos
function extractResults<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

// Utilidad para simular latencia de red en servicios que aún no tienen endpoint en back (IA)
const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// 1. SERVICIOS PARA CRUD DE ZONAS (Conectado a Django REST Framework)
// ============================================================================
export const zonasService = {
  /**
   * Obtiene la lista completa de zonas
   */
  async getZonas(): Promise<Zona[]> {
    const response = await fetch(`${API_BASE_URL}/zonas/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: Error al obtener las zonas`);
    const data = await response.json();
    return extractResults<Zona>(data);
  },

  /**
   * Obtiene el detalle de una zona por ID
   */
  async getZonaById(id: number): Promise<Zona> {
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se encontró la zona`);
    return await response.json();
  },

  /**
   * Crea una nueva zona
   */
  async createZona(data: ZonaInput): Promise<Zona> {
    const response = await fetch(`${API_BASE_URL}/zonas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData.nombre_de_zona?.[0] ||
        errorData.detail ||
        `Error ${response.status}: No se pudo crear la zona`;
      throw new Error(errorMsg);
    }
    return await response.json();
  },

  /**
   * Actualiza una zona existente
   */
  async updateZona(id: number, data: Partial<ZonaInput>): Promise<Zona> {
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg =
        errorData.nombre_de_zona?.[0] ||
        errorData.detail ||
        `Error ${response.status}: No se pudo actualizar la zona`;
      throw new Error(errorMsg);
    }
    return await response.json();
  },

  /**
   * Elimina una zona
   */
  async deleteZona(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se pudo eliminar la zona`);
  },
};

// ============================================================================
// 2. SERVICIOS PARA CRUD DE MEDICIONES (Conectado a Django REST Framework)
// ============================================================================
export const medicionesService = {
  async getMediciones(zonaId?: number): Promise<Medicion[]> {
    const query = zonaId ? `?zona=${zonaId}` : '';
    const response = await fetch(`${API_BASE_URL}/mediciones/${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error al cargar mediciones');
    const data = await response.json();
    return extractResults<Medicion>(data);
  },

  async createMedicion(data: MedicionInput): Promise<Medicion> {
    const response = await fetch(`${API_BASE_URL}/mediciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al registrar medición');
    }
    return await response.json();
  },

  async deleteMedicion(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mediciones/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar medición');
  },
};

// ============================================================================
// 3. SERVICIOS PARA CRUD DE ALERTAS (Conectado a Django REST Framework)
// ============================================================================
export const alertasService = {
  async getAlertas(): Promise<Alerta[]> {
    const response = await fetch(`${API_BASE_URL}/alertas/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error al consultar alertas');
    const data = await response.json();
    return extractResults<Alerta>(data);
  },

  async createAlerta(data: AlertaInput): Promise<Alerta> {
    const response = await fetch(`${API_BASE_URL}/alertas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al crear alerta');
    }
    return await response.json();
  },

  async resolveAlerta(id: number): Promise<Alerta> {
    const response = await fetch(`${API_BASE_URL}/alertas/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'resuelta' }),
    });
    if (!response.ok) throw new Error('Error al resolver alerta');
    return await response.json();
  },
};

// ============================================================================
// 4. SERVICIOS PARA CRUD DE RECOMENDACIONES (Conectado a Django REST Framework)
// ============================================================================
export const recomendacionesService = {
  async getRecomendaciones(medicionId?: number): Promise<Recomendacion[]> {
    const query = medicionId ? `?medicion=${medicionId}` : '';
    const response = await fetch(`${API_BASE_URL}/recomendaciones/${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error al consultar recomendaciones');
    const data = await response.json();
    return extractResults<Recomendacion>(data);
  },

  async createRecomendacion(data: RecomendacionInput): Promise<Recomendacion> {
    const response = await fetch(`${API_BASE_URL}/recomendaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al registrar recomendación');
    }
    return await response.json();
  },
};

// ============================================================================
// 5. SERVICIO PROXY DE IA (Simulado en frontend hasta endpoint backend)
// ============================================================================
/**
 * PENDIENTE EN BACKEND:
 * Endpoint `/api/ia/interpretar-medicion/` aún no implementado en Django.
 * Se mantiene esta simulación local controlada para no bloquear la interfaz.
 */
export const iaProxyService = {
  async interpretarMedicion(payload: SolicitudInterpretacionIA): Promise<RespuestaInterpretacionIA> {
    await delay(1000);
    const targetMedicion = INITIAL_MEDICIONES.find((m) => m.id === payload.medicion_id);

    let interpretacion = '';
    let recomendacion = '';
    let impacto: 'optimo' | 'moderado' | 'critico' = 'moderado';
    let requiereAlerta = false;

    const tipo = targetMedicion?.tipo || 'calidad_del_aire';
    const valor = targetMedicion?.valor ?? 85;
    const unidad = targetMedicion?.unidad || 'AQI';

    if (tipo === 'calidad_del_aire') {
      if (valor > 100) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `El nivel de partículas (${valor} ${unidad}) sobrepasa los estándares seguros para la población. Existe riesgo de afecciones respiratorias severas.`;
        recomendacion = 'Emitir alerta comunitaria inmediata, suspender actividades deportivas en exteriores y recomendar el uso de mascarilla.';
      } else {
        impacto = 'optimo';
        interpretacion = `Los índices de calidad de aire (${valor} ${unidad}) se encuentran dentro de los parámetros saludables.`;
        recomendacion = 'Mantener vigilancia periódica de los corredores vehiculares cercanos.';
      }
    } else if (tipo === 'temperatura') {
      if (valor > 32) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `Ola de calor detectada (${valor}°C). Alto riesgo de deshidratación y estrés térmico en flora y fauna.`;
        recomendacion = 'Fomentar puntos de hidratación comunitarios y activar protocolos de prevención de incendios forestales.';
      } else {
        impacto = 'optimo';
        interpretacion = `Temperatura controlada de ${valor}°C dentro de los promedios estacionales normales.`;
        recomendacion = 'Continuar con el régimen regular de hidratación y cuidado de áreas verdes.';
      }
    } else if (tipo === 'lluvia') {
      if (valor > 40) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `Nivel acumulado de precipitaciones (${valor} mm) clasificado como tormenta severa con potencial de escorrentía rápida.`;
        recomendacion = 'Monitorear los sistemas de drenaje y activar albergues preventivos en laderas inestables.';
      } else {
        impacto = 'moderado';
        interpretacion = `Precipitaciones moderadas (${valor} mm) que aportan a los niveles freáticos sin riesgo inmediato de saturación.`;
        recomendacion = 'Limpieza preventiva de rejillas y alcantarillado.';
      }
    } else {
      interpretacion = `Medición de ${tipo} registrada con valor ${valor} ${unidad}. Condición monitoreada con éxito.`;
      recomendacion = 'Seguimiento de la serie temporal para detectar desviaciones estadísticas.';
    }

    return {
      medicion_id: payload.medicion_id,
      resumen_interpretacion: interpretacion,
      nivel_impacto: impacto,
      recomendacion_sugerida: recomendacion,
      requiere_alerta: requiereAlerta,
      alerta_sugerida: requiereAlerta
        ? {
            titulo: `Alerta generada por IA: Anomalía en ${tipo}`,
            descripcion: interpretacion,
            nivel: impacto === 'critico' ? 'alto' : 'medio',
          }
        : undefined,
      fecha_generacion: new Date().toISOString(),
    };
  },
};
