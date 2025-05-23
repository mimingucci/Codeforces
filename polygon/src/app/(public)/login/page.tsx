'use client';

import Loading from '@/components/Loading';
import LoginForm from '@/components/Login';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'authenticated') {
      router.push('/');
      return;
    }

    setLoading(false);
  }, [status, router]);

  // Show loading animation while checking auth
  if (loading || status === 'loading') {
    return <Loading />;
  }

  return (
    <div className="p-[1rem] bg-[#c8c9cc] h-full w-full">
      <div className="text-center tablet:flex tablet:flex-row-reverse rounded-[20px] overflow-hidden max-w-[80rem] m-auto">
        <LoginForm />
      </div>
    </div>
  );
}
