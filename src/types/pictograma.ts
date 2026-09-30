
export interface Categoria {
  id: string;
  categoryName: string;
}

export interface Pictograma {
  id: string;
  pictogramName: string;
  personal: boolean;
  description: string;
  pictoImageUrl: string;
  category: Categoria;
  pictoImageKey: string;
}

export interface CrearPictogramaInput {
  file: File;
  pictogramName: string;
  description?: string;
  categoryId: string;
  personal: boolean;
  userId?: string;
  infantId?: string;
}

export interface PictogramaEnFrase extends Pictograma {
  phraseId: string;
}