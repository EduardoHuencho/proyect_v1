export interface AdminPictogram {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description?: string;
  isPublic: boolean;
  authorFirstName: string;
  authorLastName: string;
  authorEmail: string;
  createdAt: string; // ISO string o formato de fecha
  isDeleted?: boolean;
}

export type VisibilityFilter = 'all' | 'public' | 'private';
export type DateSortOrder = 'newest' | 'oldest';
