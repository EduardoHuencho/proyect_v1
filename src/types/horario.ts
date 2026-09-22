import type { Pictograma } from './pictograma';

export interface ActividadHorarioBD {
  id: string;
  hour: string;
  dayOfWeek: string;
  infantId: string;
  pictogramId: string;
  
  pictogram?: Pictograma; 
}