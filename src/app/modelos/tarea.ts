


export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADA = 'COMPLETADA'
}


export interface Tarea {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio?: string; // Antes era fechaCreacion
  fechaFin?: string;    // Antes era fechaVencimiento
  estado: EstadoTarea;
}