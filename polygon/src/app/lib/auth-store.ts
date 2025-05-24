// lib/auth-store.ts
import { atom } from 'jotai';

export interface ExtendedUser {
  id: string;
  email: string;
  username: string;
  token: string;
  roles: string[];
}

export const userAtom = atom<ExtendedUser | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const userRolesAtom = atom((get) => get(userAtom)?.roles || []);
export const authTokenAtom = atom((get) => get(userAtom)?.token || null);
