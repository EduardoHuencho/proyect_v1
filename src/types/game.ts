export interface CategoriaJuego {
  id: string;
  categoryName: string;
  color: string;
}

export interface PictogramaJuego {
  id: string;
  pictogramName: string;
  personal: boolean;
  description: string;
  pictoImageUrl: string;
  category: CategoriaJuego;
  infantId: string[];
  pictoImageKey: string;
}

export interface RondaJuego {
  round: number;
  prompt: string;
  correctPictogramId: string;
  pictograms: PictogramaJuego[];
}

export type JuegoRondas = RondaJuego[];
