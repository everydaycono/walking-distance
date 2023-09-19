'use client';
import LoginFormLoader from '@/components/Loader/LoginFormLoader';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FC, Suspense } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<layoutProps> = ({ children }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return <LoginFormLoader />;
  }

  if (status === 'authenticated') {
    redirect('/');
  }

  //   Only not  logged in user can access
  return (
    <Suspense fallback={<LoginFormLoader />}>
      <section>{children}</section>
    </Suspense>
  );
};

export default AuthLayout;
