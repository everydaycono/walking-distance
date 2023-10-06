'use client';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { FC } from 'react';
interface layoutProps {
  children: React.ReactNode;
}
const DashboardLayout: FC<layoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="w-full">
        <div className="max-w-7xl mx-auto my-10 flex space-x-5  px-5">
          {/* Main  */}
          <div className="w-full">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
