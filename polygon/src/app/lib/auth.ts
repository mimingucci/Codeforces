// lib/auth.ts
import { getServerSession } from 'next-auth';
import { type ExtendedUser } from './auth-store';
import { signOut } from 'next-auth/react';
import { SetStateAction } from 'jotai';
import { authOptions } from 'app/api/auth/[...nextauth]/route';

export const auth = () => getServerSession(authOptions);

export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return { ...session.user };
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user?.token;
}

export function hasRole(user: ExtendedUser | null, role: string): boolean {
  return user?.roles?.includes(role) || false;
}

export async function logout(
  setUser: (update: SetStateAction<ExtendedUser | null>) => void
) {
  try {
    await signOut({
      redirect: false,
    });
    setUser(null);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}
