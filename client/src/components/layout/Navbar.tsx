'use client';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import Avatar from '../Avatar';

const Navbar = () => {
  const { data, status: loginStatus } = useSession();

  const { setTheme } = useTheme();

  return (
    <nav className="bg-white border-b-stone-100  border-[1px] mb-5 dark:bg-gray-900 dark:border-b-gray-300">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex">
          <h1 className="scale-150">🦮</h1>
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Walking distance
          </span>
        </div>

        <Button onClick={() => setTheme('light')}>light</Button>
        <Button onClick={() => setTheme('dark')}>dark</Button>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          {/* USER STATE */}
          {loginStatus === 'loading' && <Avatar loading={true} />}
          {loginStatus === 'unauthenticated' && <Avatar />}
          {loginStatus === 'authenticated' && <Avatar user={data.user} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
