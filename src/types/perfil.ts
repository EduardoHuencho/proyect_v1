export interface Infante {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  avatarUrl?: string | null;
}

export interface CrearInfanteInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  userId: string;
  avatarUrl: string;
}