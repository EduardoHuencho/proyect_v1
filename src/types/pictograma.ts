
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
  // falta agregar el campo para saber si el pictograma es privado o publico
  userId?: string;
  infantId?: string;
}

export interface PictogramaEnFrase extends Pictograma {
  phraseId: string;
}