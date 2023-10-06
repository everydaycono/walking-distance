import Navbar from '@/components/layout/Navbar';
import { FC } from 'react';

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default layout;
