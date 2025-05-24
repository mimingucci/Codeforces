export interface LoginRequest {
  email: string;
  password: string;
}

export enum Role {
  ADMIN,
  SUPER_ADMIN,
  USER,
}

export interface LoginResponse {
  token?: string;
  email?: string;
  id?: string;
  username?: string;
  roles?: Role[];
}
