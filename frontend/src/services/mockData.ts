import { Zona, Medicion, Alerta, Recomendacion } from '../types';

export const INITIAL_ZONAS: Zona[] = [
  {
    id: 1,
    nombre_de_zona: 'Parque Metropolitano Norte',
    municipio: 'Medellín',
    descripcion: 'Zona verde urbana con alto tránsito peatonal y monitoreo de microclima.',
    tipo: 'urbana',
    activa: true,
  },
  {
    id: 2,
    nombre_de_zona: 'Reserva Forestal La Cristalina',
    municipio: 'Guarne',
    descripcion: 'Cuenca hídrica y reserva natural protegida en área montañosa.',
    tipo: 'rural',
    activa: true,
  },
  {
    id: 3,
    nombre_de_zona: 'Distrito Industrial Sur',
    municipio: 'Itagüí',
    descripcion: 'Zona de manufactura y alto flujo de carga pesada, foco de calidad de aire.',
    tipo: 'urbana',
    activa: true,
  },
  {
    id: 4,
    nombre_de_zona: 'Corredor Agrícola Las Palmas',
    municipio: 'Envigado',
    descripcion: 'Área rural de cultivo y parcelaciones con sensores de humedad y lluvia.',
    tipo: 'rural',
    activa: false,
  },
];

export const INITIAL_MEDICIONES: Medicion[] = [
  {
    id: 1,
    tipo: 'temperatura',
    valor: 27.5,
    unidad: '°C',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    zona: 1,
    medicion_zona: 'Parque Metropolitano Norte',
  },
  {
    id: 2,
    tipo: 'calidad_del_aire',
    valor: 115.0,
    unidad: 'AQI (PM2.5)',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    zona: 3,
    medicion_zona: 'Distrito Industrial Sur',
  },
  {
    id: 3,
    tipo: 'lluvia',
    valor: 45.2,
    unidad: 'mm',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    zona: 2,
    medicion_zona: 'Reserva Forestal La Cristalina',
  },
  {
    id: 4,
    tipo: 'ruido',
    valor: 78.4,
    unidad: 'dB',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    zona: 3,
    medicion_zona: 'Distrito Industrial Sur',
  },
];

export const INITIAL_ALERTAS: Alerta[] = [
  {
    id: 1,
    titulo: 'Calidad del aire no saludable en Distrito Industrial',
    descripcion: 'Niveles de partículas PM2.5 superan el umbral permitido durante 3 horas consecutivas.',
    nivel: 'alto',
    estado: 'activa',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    zona: 3,
    medicion: 2,
    alerta_zona: 'Distrito Industrial Sur',
  },
  {
    id: 2,
    titulo: 'Alerta por precipitaciones intensas',
    descripcion: 'Acumulado de lluvias superior a 40mm con riesgo de deslizamiento preventivo.',
    nivel: 'medio',
    estado: 'activa',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    zona: 2,
    medicion: 3,
    alerta_zona: 'Reserva Forestal La Cristalina',
  },
];

export const INITIAL_RECOMENDACIONES: Recomendacion[] = [
  {
    id: 1,
    texto: 'Se sugiere restringir actividades físicas al aire libre a niños y adultos mayores en la zona industrial.',
    origen: 'ia',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    medicion: 2,
  },
  {
    id: 2,
    texto: 'Monitorear niveles de quebradas afluentes durante las próximas 4 horas.',
    origen: 'manual',
    fecha_y_hora: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    medicion: 3,
  },
];
