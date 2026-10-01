import type { Pictograma } from './pictograma';

export type JornadaBackend = 'MORNING' | 'AFTERNOON' | 'NIGHT';

export type DiaSemana = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RutinaDia {
  infantId: string;
  dayOfWeek: DiaSemana;
}

export interface Actividad {
  name: string;
  pictogramId: string;
  stage: JornadaBackend;
  position: number;
}

export interface ActividadResumen { 
  id: string;
  name: string;
  position: number;
  pictogram?: Pictograma;
}

export interface RutinaAgrupadaDia {
  id: string;
  infantId: string;
  dayOfWeek: DiaSemana;
  morning: ActividadResumen[];
  afternoon: ActividadResumen[];
  night: ActividadResumen[];
}

export interface ActividadRutinaVista {
  id: string;
  routineId?: string;
  infantId?: string;
  dayOfWeek: DiaSemana;
  stage: JornadaBackend;
  position: number;
  name: string;
  pictogram?: Pictograma;
}