'use client';
import {
  Binary,
  Contact2,
  FilePlus2,
  Home,
  LayoutList,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect } from 'react';

interface DrawerProps {
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
}

const noLoginDrawerList = [
  { id: 1, icon: <Contact2 />, name: 'signin', path: '/login' },
  { id: 2, icon: <UserPlus />, name: 'register', path: '/register' }
];

const loginDrawerList = [
  { id: 1, icon: <Home />, name: 'Home', path: '/' },
  { id: 2, icon: <LayoutList />, name: 'My page', path: '/users/me' },
  { id: 3, icon: <FilePlus2 />, name: 'New post', path: '/article/new-post' }
];

const Drawer: FC<DrawerProps> = ({ isDrawerOpen, handleDrawerClose }) => {
  const { status: loginStatus } = useSession();
  const pathname = usePathname();
  const loginList =
    loginStatus === 'authenticated' ? loginDrawerList : noLoginDrawerList;

  useEffect(() => {
    if (!isDrawerOpen) return;
    handleDrawerClose();
  }, [pathname]);

  return (
    <>
      <div
        onClick={handleDrawerClose}
        className={`${
          isDrawerOpen &&
          'fixed top-0 left-0 z-[39]  w-full h-full bg-gray-700 opacity-90'
        }`}
      ></div>
      <div
        id="drawer-disable-body-scrolling"
        className={`${
          isDrawerOpen ? '' : '-translate-x-full'
        } fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-64 dark:bg-gray-800 md:hidden`}
        tabIndex={-1}
        aria-labelledby="drawer-disable-body-scrolling-label"
      >
        <h5
          id="drawer-disable-body-scrolling-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Menu
        </h5>
        <button
          onClick={handleDrawerClose}
          type="button"
          data-drawer-hide="drawer-disable-body-scrolling"
          aria-controls="drawer-disable-body-scrolling"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {loginList.map((item) => {
              return (
                <Link
                  href={item.path}
                  key={item.id}
                  className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Drawer;
