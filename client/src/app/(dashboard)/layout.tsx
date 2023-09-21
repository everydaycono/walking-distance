'use client';
import Navbar from '@/components/layout/Navbar';
import { Separator } from '@/components/ui/separator';
import { categoryAPI } from '@/services/api/categoryQuery';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface layoutProps {
  children: React.ReactNode;
}
const pathNameFunction = (pathName: string) => {
  if (pathName === '/') return '';
  if (pathName.startsWith('/category/')) {
    return pathName.split('/category/')[1];
  }
  if (pathName.startsWith('/tags/')) {
    return pathName.split('/tags/')[1];
  }
  return pathName;
};
const layout: FC<layoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [category, setCategory] = useState('');

  const {
    data: categories,
    isLoading: isCategoryLoading,
    error
  } = useQuery({
    queryKey: ['walkdi', 'category'],
    queryFn: () => categoryAPI.getAllCategory(),
    onSuccess: () => {},
    onError: (err) => {
      console.log(err, 'ERR');
    }
  });

  useEffect(() => {
    setCategory(pathNameFunction(pathname));
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="w-full">
        <div className="max-w-7xl mx-auto my-10 flex space-x-5  px-5">
          <div className="w-full">
            {/* Banner  */}
            <div
              id="controls-carousel"
              className="relative w-full"
              data-carousel="static"
            >
              {/* Carousel wrapper */}
              <div className="relative h-40 md:h-64 overflow-hidden rounded-lg">
                {/* Item 1 */}
                <div className="duration-700 ease-in-out" data-carousel-item="">
                  <img
                    src="https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>
              </div>
              {/* Slider controls */}
              <button
                type="button"
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev=""
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next=""
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>

            {category && (
              <div className="my-5">
                <div className="flex items-center">
                  <p className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
                    {category}
                  </p>
                  <span className="px-2 text-lg text-blue-600">
                    {pathname.split('/')[1]}
                  </span>
                </div>
              </div>
            )}
            {pathname.split('/')[1] !== 'tags' && (
              <article className="my-5">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  {isCategoryLoading && (
                    <>
                      <div className="animate-pulse h-[38px] w-20 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-20 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-20 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-20 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-20 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                    </>
                  )}
                  {categories?.map((item, idx) => {
                    const commonClass =
                      'inline-flex relative justify-center items-center w-24 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white';
                    const classNames = [
                      commonClass,
                      idx === 0
                        ? 'rounded-l-sm'
                        : idx === categories.length - 1
                        ? 'rounded-r-sm'
                        : 'border-t border-b'
                    ].join(' ');
                    return (
                      <Link
                        key={item.id}
                        href={`/category/${item.label}`}
                        type="button"
                        className={classNames}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </article>
            )}
            {children}
          </div>
          <div className="min-w-80 md:block hidden">
            <div className="bg-white border border-gray-200 rounded-lg shadow sm:px-4 sm:py-8 dark:bg-gray-800 dark:border-gray-700">
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Reommend Articles
              </h5>

              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

              <ul>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
              </ul>
            </div>

            <div className="my-6" />
            <div className="bg-white border border-gray-200 rounded-lg shadow sm:px-4 sm:py-8 dark:bg-gray-800 dark:border-gray-700">
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Tags
              </h5>

              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

              <ul className="flex flex-wrap">
                <li>
                  <Link
                    href={'/tags/123'}
                    className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    123
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/tags/running'}
                    className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    Running
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/tags/runday'}
                    className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    Runday
                  </Link>
                </li>
                <li>
                  <Link
                    href={'/tags/tech'}
                    className="bg-gray-100 whitespace-pre-wrap text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    Tech
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
