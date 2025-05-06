export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  email: string;
  username: string;
  enabled: boolean;
  firstname: string;
  lastname: string;
  description: string;
  rating: number;
  contribute: number;
  country: string;
  avatar: string;
  createdAt: string;
  roles?: Role[];
}
