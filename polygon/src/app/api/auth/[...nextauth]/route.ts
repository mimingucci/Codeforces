// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import apiClient from 'app/lib/api-client';
import { LoginResponse } from 'types/auth-types';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await apiClient.post('/api/v1/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data as LoginResponse; // Already unwrapped by interceptor

          if (user && user.token) {
            return {
              id: user.id.toString(), // Convert to string as NextAuth expects
              email: user.email,
              username: user.username,
              token: user.token,
              roles: user.roles,
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.token = user.token;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.token = token.token as string;
        session.user.roles = token.roles as string[];
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
