import { LoginResponse } from '@/features/auth/type';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: LoginResponse;
  }
}
