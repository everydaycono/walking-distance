'use client';
import { useUserProvider } from '@/components/providers/useUserProvider';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<layoutProps> = ({ children }) => {
  const { user } = useUserProvider();

  const router = useRouter();
  if (user) {
    router.replace('/');
    return;
  }

  //   Only not  logged in user can access
  return <div>{children}</div>;
};

export default AuthLayout;
