'use client';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useUserProvider } from '../providers/useUserProvider';

const Navbar = () => {
  const { user, handleUserLogout } = useUserProvider();
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
          {/* {user && <button onClick={handleUserLogout}> logout</button>}
          {!user && <Link href="/login">Login</Link>} */}
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
          </ul>
          {/* USER STATE */}
          {/* {user ? (
            <div>
              <h1>{user.firstName}</h1>
            </div>
          ) : (
            <div>
              <h1>No user</h1>
            </div>
          )} */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
