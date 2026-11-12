export interface BackendCategory {
  id: string;
  categoryName: string;
  color?: string;
}

export interface BackendAdminPictogram {
  id: string;
  pictogramName: string;
  personal: boolean;
  description?: string;
  pictoImageUrl: string;
  pictoImageKey?: string;
  category?: BackendCategory;
  infantId?: string[];
}

export interface AdminPictogram {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryColor?: string;
  imageUrl: string;
  isPublic: boolean;
  infantId?: string[];
}

export type VisibilityFilter = 'all' | 'public' | 'private';
export type NameSortOrder = 'asc' | 'desc';
