// types/auth-types.ts
export interface LoginResponse {
  token: string;
  id: string; // String to handle Java Long properly
  email: string;
  username: string;
  roles: string[];
}
