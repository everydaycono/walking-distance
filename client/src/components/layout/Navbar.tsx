'use client';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import { Switch } from '@/components/ui/switch';
import Avatar from '../Avatar';
import { Moon, PenSquare, Search, SunMoon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import ArticleSearchModal from '../modal/ArticleSearchModal';
import { useState } from 'react';
import Drawer from './Drawer';

const Navbar = () => {
  const { data, status: loginStatus } = useSession();
  const { setTheme, theme } = useTheme();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleModal = (status: boolean) => setModalOpen(status);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  return (
    <>
      <ArticleSearchModal open={isModalOpen} toggleModal={toggleModal} />
      <nav className="border-gray-200 transition-none bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto py-4 px-4">
          <div className="">
            <Link className="flex items-center" href={'/'}>
              <Image
                height={40}
                width={40}
                src="/walkdi.svg"
                alt="walki"
                priority
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                WalkDi
              </span>
            </Link>
          </div>

          <Drawer
            handleDrawerClose={handleDrawerClose}
            isDrawerOpen={isDrawerOpen}
          />

          {/* visible on sm-md size */}
          <button
            onClick={() => setDrawerOpen(!isDrawerOpen)}
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

          {/* visible on lg size */}
          <div className="hidden md:block md:w-auto" id="navbar-default">
            <div className="flex">
              <Button
                variant="outline"
                className="mx-3 relative bg-gray-50  border-gray-300 text-gray-900    text-sm rounded-lg    focus:ring-blue-500    focus:border-blue-500 h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2                       dark:bg-gray-700    dark:border-gray-600    dark:placeholder-gray-400    dark:text-white    dark:focus:ring-blue-500    dark:focus:border-blue-500"
                onClick={() => setModalOpen(true)}
              >
                <Search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
                <span className="hidden xl:inline-flex">
                  Search articles...
                </span>
                <span className="sr-only">Search articles</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

              <div className="flex items-center space-x-2">
                <Moon />
                <Switch
                  id="airplane-mode"
                  checked={theme === 'light' ? true : false}
                  onCheckedChange={(event) =>
                    setTheme(event ? 'light' : 'dark')
                  }
                  className="data-[state=checked]:bg-yellow-300 data-[state=unchecked]:bg-gray-200"
                />
                <SunMoon />
              </div>

              <div className="flex mx-5 items-center">
                {loginStatus === 'loading' ? (
                  <div className="w- h-7 bg-gray-200 rounded-sm dark:bg-gray-700" />
                ) : (
                  loginStatus === 'authenticated' && (
                    <Link href="/article/new-post">
                      <PenSquare
                        size={20}
                        className="hover:scale-110 transition duration-200 cursor-pointer"
                      />
                    </Link>
                  )
                )}
              </div>

              {/* USER STATE */}
              {loginStatus === 'loading' ? (
                <svg
                  className="w-8 h-8 text-gray-200 dark:text-gray-700 mr-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              ) : loginStatus === 'unauthenticated' ? (
                <Avatar />
              ) : (
                <Avatar user={data?.user} />
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
