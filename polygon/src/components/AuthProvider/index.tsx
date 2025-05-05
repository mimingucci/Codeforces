'use client';

import { useSession } from 'next-auth/react';
import { useSetAtom } from 'jotai';
import { userAtom } from 'app/lib/auth-store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else if (status === 'unauthenticated') {
      setUser(null);
      router.push('/login');
    }
  }, [session, status, setUser, router]);

  return <>{children}</>;
}
