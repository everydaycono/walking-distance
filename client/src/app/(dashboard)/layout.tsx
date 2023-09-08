import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { FC } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
