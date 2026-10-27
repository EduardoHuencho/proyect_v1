export interface CategoriaProgreso {
  id: string;
  nombre: string;
  correctas: number;
  totales: number;
  color?: string;
}

export interface BackendGameProgress {
  id: string;
  gameDate: string;
  correctAnswers: number;
  totalAnswers: number;
  categoryPlayed?: {
    id: string;
    categoryName: string;
    color?: string;
  };
}

export interface CreateGameProgressPayload {
  infantId: string;
  game: string;
  categoryPlayedId: string;
  correctAnswers: number;
  totalAnswers: number;
}

export interface ProgresoInfanteData {
  nombreInfante: string;
  avatarUrl?: string;
  totalCorrectas: number;
  totalIntentos: number;
  porcentajeExito: number;
  categorias: CategoriaProgreso[];
}
