import Navbar from '@/components/layout/Navbar';
import { FC } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="w-full">
        <div className="max-w-7xl mx-auto my-10">{children}</div>
      </div>
    </div>
  );
};

export default layout;
