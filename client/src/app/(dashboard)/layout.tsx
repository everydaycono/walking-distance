import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { FC } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  // const session = await getServerSession(authOptions);
  return (
    <div className="flex min-h-screen flex-col">
      {/* <h1>{session?.user.token.access}</h1> */}
      {/* <h1>{session?.user.token.refresh}</h1> */}
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
