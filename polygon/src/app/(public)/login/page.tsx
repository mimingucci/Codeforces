'use client';

import LoginForm from '@/components/Login';

export default function Login() {
  return (
    <div className="p-[1rem] bg-[#c8c9cc] h-full w-full">
      <div className="text-center tablet:flex tablet:flex-row-reverse rounded-[20px] overflow-hidden max-w-[80rem] m-auto">
        <LoginForm />
      </div>
    </div>
  );
}
