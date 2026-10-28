/**
 * SERVICIOS DE API - AMBIENTE Y CLIMA
 * 
 * NOTA DE ARQUITECTURA:
 * - El frontend consume exclusivamente la API REST de Django.
 * - Toda interacción de IA se realiza como proxy a través de los endpoints de Django.
 *   (Está PROHIBIDO llamar a proveedores de IA externos directamente desde el cliente).
 * - Actualmente, las llamadas reales mediante `fetch` se encuentran comentadas para
 *   permitir el desarrollo con Mocks simulados y retraso de red (network latency).
 *   Para pasar a producción, únicamente descomenta las llamadas `fetch` y remueve los mocks.
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
  INITIAL_ZONAS,
  INITIAL_MEDICIONES,
  INITIAL_ALERTAS,
  INITIAL_RECOMENDACIONES,
} from './mockData';

// Configuración base de la API Django
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Utilidad para simular latencia de red (500ms - 800ms)
const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Estado en memoria para persistencia simulada de los Mocks
let mockZonas: Zona[] = [...INITIAL_ZONAS];
let mockMediciones: Medicion[] = [...INITIAL_MEDICIONES];
let mockAlertas: Alerta[] = [...INITIAL_ALERTAS];
let mockRecomendaciones: Recomendacion[] = [...INITIAL_RECOMENDACIONES];

// ============================================================================
// 1. SERVICIOS PARA CRUD DE ZONAS
// ============================================================================
export const zonasService = {
  /**
   * Obtiene la lista completa de zonas
   */
  async getZonas(): Promise<Zona[]> {
    // --- LLAMADA REAL AL BACKEND (Descomentar al conectar con Django) ---
    /*
    const response = await fetch(`${API_BASE_URL}/zonas/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: Error al obtener las zonas`);
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    return [...mockZonas];
  },

  /**
   * Obtiene el detalle de una zona por ID
   */
  async getZonaById(id: number): Promise<Zona> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se encontró la zona`);
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const zona = mockZonas.find((z) => z.id === id);
    if (!zona) throw new Error(`Zona con ID ${id} no encontrada.`);
    return { ...zona };
  },

  /**
   * Crea una nueva zona
   */
  async createZona(data: ZonaInput): Promise<Zona> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/zonas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: No se pudo crear la zona`);
    }
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    // Validar nombre único simulado
    const exists = mockZonas.some(
      (z) => z.nombre_de_zona.trim().toLowerCase() === data.nombre_de_zona.trim().toLowerCase()
    );
    if (exists) {
      throw new Error(`Ya existe una zona registrada con el nombre "${data.nombre_de_zona}".`);
    }

    const newZona: Zona = {
      id: mockZonas.length > 0 ? Math.max(...mockZonas.map((z) => z.id)) + 1 : 1,
      ...data,
    };
    mockZonas.unshift(newZona);
    return { ...newZona };
  },

  /**
   * Actualiza una zona existente
   */
  async updateZona(id: number, data: Partial<ZonaInput>): Promise<Zona> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'PUT', // o 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se pudo actualizar la zona`);
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const index = mockZonas.findIndex((z) => z.id === id);
    if (index === -1) throw new Error(`Zona con ID ${id} no encontrada.`);

    // Validar duplicado si cambió el nombre
    if (data.nombre_de_zona) {
      const duplicate = mockZonas.some(
        (z) => z.id !== id && z.nombre_de_zona.trim().toLowerCase() === data.nombre_de_zona?.trim().toLowerCase()
      );
      if (duplicate) {
        throw new Error(`El nombre de zona "${data.nombre_de_zona}" ya está en uso.`);
      }
    }

    const updatedZona: Zona = { ...mockZonas[index], ...data };
    mockZonas[index] = updatedZona;
    return { ...updatedZona };
  },

  /**
   * Elimina una zona
   */
  async deleteZona(id: number): Promise<void> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/zonas/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error ${response.status}: No se pudo eliminar la zona`);
    return;
    */

    // --- MOCK SIMULADO ---
    await delay();
    const index = mockZonas.findIndex((z) => z.id === id);
    if (index === -1) throw new Error(`Zona con ID ${id} no encontrada.`);
    mockZonas.splice(index, 1);
  },
};

// ============================================================================
// 2. SERVICIOS PARA CRUD DE MEDICIONES
// ============================================================================
export const medicionesService = {
  async getMediciones(zonaId?: number): Promise<Medicion[]> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const query = zonaId ? `?zona=${zonaId}` : '';
    const response = await fetch(`${API_BASE_URL}/mediciones/${query}`);
    if (!response.ok) throw new Error('Error al cargar mediciones');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    if (zonaId) {
      return mockMediciones.filter((m) => m.zona === zonaId);
    }
    return [...mockMediciones];
  },

  async createMedicion(data: MedicionInput): Promise<Medicion> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/mediciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar medición');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const zonaObj = mockZonas.find((z) => z.id === data.zona);
    const newMedicion: Medicion = {
      id: mockMediciones.length > 0 ? Math.max(...mockMediciones.map((m) => m.id)) + 1 : 1,
      ...data,
      medicion_zona: zonaObj ? zonaObj.nombre_de_zona : 'Zona Desconocida',
    };
    mockMediciones.unshift(newMedicion);
    return newMedicion;
  },

  async deleteMedicion(id: number): Promise<void> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/mediciones/${id}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar medición');
    return;
    */

    await delay();
    mockMediciones = mockMediciones.filter((m) => m.id !== id);
  },
};

// ============================================================================
// 3. SERVICIOS PARA CRUD DE ALERTAS
// ============================================================================
export const alertasService = {
  async getAlertas(): Promise<Alerta[]> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/alertas/`);
    if (!response.ok) throw new Error('Error al consultar alertas');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    return [...mockAlertas];
  },

  async createAlerta(data: AlertaInput): Promise<Alerta> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/alertas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear alerta');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const zonaObj = mockZonas.find((z) => z.id === data.zona);
    const newAlerta: Alerta = {
      id: mockAlertas.length > 0 ? Math.max(...mockAlertas.map((a) => a.id)) + 1 : 1,
      ...data,
      fecha_y_hora: new Date().toISOString(),
      alerta_zona: zonaObj ? zonaObj.nombre_de_zona : 'Zona Desconocida',
    };
    mockAlertas.unshift(newAlerta);
    return newAlerta;
  },

  async resolveAlerta(id: number): Promise<Alerta> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/alertas/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'resuelta' }),
    });
    if (!response.ok) throw new Error('Error al resolver alerta');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const index = mockAlertas.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Alerta no encontrada');
    mockAlertas[index].estado = 'resuelta';
    return { ...mockAlertas[index] };
  },
};

// ============================================================================
// 4. SERVICIOS PARA CRUD DE RECOMENDACIONES
// ============================================================================
export const recomendacionesService = {
  async getRecomendaciones(medicionId?: number): Promise<Recomendacion[]> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const query = medicionId ? `?medicion=${medicionId}` : '';
    const response = await fetch(`${API_BASE_URL}/recomendaciones/${query}`);
    if (!response.ok) throw new Error('Error al consultar recomendaciones');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    if (medicionId) {
      return mockRecomendaciones.filter((r) => r.medicion === medicionId);
    }
    return [...mockRecomendaciones];
  },

  async createRecomendacion(data: RecomendacionInput): Promise<Recomendacion> {
    // --- LLAMADA REAL AL BACKEND ---
    /*
    const response = await fetch(`${API_BASE_URL}/recomendaciones/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar recomendación');
    return await response.json();
    */

    // --- MOCK SIMULADO ---
    await delay();
    const newRecomendacion: Recomendacion = {
      id: mockRecomendaciones.length > 0 ? Math.max(...mockRecomendaciones.map((r) => r.id)) + 1 : 1,
      ...data,
      fecha_y_hora: new Date().toISOString(),
    };
    mockRecomendaciones.unshift(newRecomendacion);
    return newRecomendacion;
  },
};

// ============================================================================
// 5. SERVICIO PROXY DE IA (Django Backend Proxy)
// ============================================================================
/**
 * IMPORTANTE:
 * Este método consume ÚNICAMENTE el endpoint de nuestro backend Django.
 * El backend se encarga de autenticar con el proveedor de IA y proteger las API Keys.
 */
export const iaProxyService = {
  async interpretarMedicion(payload: SolicitudInterpretacionIA): Promise<RespuestaInterpretacionIA> {
    // --- LLAMADA REAL AL BACKEND PROXY (Descomentar al conectar con Django) ---
    /*
    const response = await fetch(`${API_BASE_URL}/ia/interpretar-medicion/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Fallo al procesar interpretación con IA en el backend');
    }
    return await response.json();
    */

    // --- MOCK SIMULADO DEL PROXY DE IA ---
    await delay(1200); // La IA suele tomar un tiempo prudente
    const targetMedicion = mockMediciones.find((m) => m.id === payload.medicion_id);

    if (!targetMedicion) {
      throw new Error(`No se encontró la medición #${payload.medicion_id} para analizar.`);
    }

    let interpretacion = '';
    let recomendacion = '';
    let impacto: 'optimo' | 'moderado' | 'critico' = 'moderado';
    let requiereAlerta = false;

    if (targetMedicion.tipo === 'calidad_del_aire') {
      if (targetMedicion.valor > 100) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `El nivel de partículas (${targetMedicion.valor} ${targetMedicion.unidad}) sobrepasa los estándares seguros para la población. Existe riesgo de afecciones respiratorias severas.`;
        recomendacion = 'Emitir alerta comunitaria inmediata, suspender actividades deportivas en exteriores y recomendar el uso de mascarilla.';
      } else {
        impacto = 'optimo';
        interpretacion = `Los índices de calidad de aire (${targetMedicion.valor} ${targetMedicion.unidad}) se encuentran dentro de los parámetros saludables.`;
        recomendacion = 'Mantener vigilancia periódica de los corredores vehiculares cercanos.';
      }
    } else if (targetMedicion.tipo === 'temperatura') {
      if (targetMedicion.valor > 32) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `Ola de calor detectada (${targetMedicion.valor}°C). Alto riesgo de deshidratación y estrés térmico en flora y fauna.`;
        recomendacion = 'Fomentar puntos de hidratación comunitarios y activar protocolos de prevención de incendios forestales.';
      } else {
        impacto = 'optimo';
        interpretacion = `Temperatura controlada de ${targetMedicion.valor}°C dentro de los promedios estacionales normales.`;
        recomendacion = 'Continuar con el régimen regular de hidratación y cuidado de áreas verdes.';
      }
    } else if (targetMedicion.tipo === 'lluvia') {
      if (targetMedicion.valor > 40) {
        impacto = 'critico';
        requiereAlerta = true;
        interpretacion = `Nivel acumulado de precipitaciones (${targetMedicion.valor} mm) clasificado como tormenta severa con potencial de escorrentía rápida.`;
        recomendacion = 'Monitorear los sistemas de drenaje y activar albergues preventivos en laderas inestables.';
      } else {
        impacto = 'moderado';
        interpretacion = `Precipitaciones moderadas (${targetMedicion.valor} mm) que aportan a los niveles freáticos sin riesgo inmediato de saturación.`;
        recomendacion = 'Limpieza preventiva de rejillas y alcantarillado.';
      }
    } else {
      interpretacion = `Medición de ${targetMedicion.tipo} registrada con valor ${targetMedicion.valor} ${targetMedicion.unidad}. Condición monitoreada con éxito.`;
      recomendacion = 'Seguimiento de la serie temporal para detectar desviaciones estadísticas.';
    }

    return {
      medicion_id: targetMedicion.id,
      resumen_interpretacion: interpretacion,
      nivel_impacto: impacto,
      recomendacion_sugerida: recomendacion,
      requiere_alerta: requiereAlerta,
      alerta_sugerida: requiereAlerta
        ? {
            titulo: `Alerta generada por IA: Anomalía en ${targetMedicion.tipo}`,
            descripcion: interpretacion,
            nivel: impacto === 'critico' ? 'alto' : 'medio',
          }
        : undefined,
      fecha_generacion: new Date().toISOString(),
    };
  },
};
