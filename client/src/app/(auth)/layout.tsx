'use client';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FC, Suspense } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<layoutProps> = ({ children }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return <div>Loading</div>;
  }

  if (status === 'authenticated') {
    redirect('/');
  }

  //   Only not  logged in user can access
  return (
    <Suspense fallback={<div>Loading</div>}>
      <section>{children}</section>
    </Suspense>
  );
};

export default AuthLayout;
