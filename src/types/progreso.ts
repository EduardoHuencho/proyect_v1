export interface CategoriaProgreso {
  id: string;
  nombre: string;
  correctas: number;
  totales: number;
  color?: string;
}

export interface ProgresoInfanteData {
  nombreInfante: string;
  avatarUrl?: string;
  totalCorrectas: number;
  totalIntentos: number;
  porcentajeExito: number;
  categorias: CategoriaProgreso[];
}

