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
    const isPreviousPath = window.sessionStorage.getItem('previousPath');
    if (!isPreviousPath) {
      redirect('/');
      return;
    }

    setTimeout(() => {
      window.sessionStorage.removeItem('previousPath');
    }, 0);
    redirect(isPreviousPath);
    return;
  }

  //   Only not  logged in user can access
  return (
    <Suspense fallback={<LoginFormLoader />}>
      <section>{children}</section>
    </Suspense>
  );
};

export default AuthLayout;
