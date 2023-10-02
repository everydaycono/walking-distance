'use client';
import Navbar from '@/components/layout/Navbar';
import { Separator } from '@/components/ui/separator';
import { articleAPI } from '@/services/api/articleQuery';
import { categoryAPI } from '@/services/api/categoryQuery';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import WalkdiBanner from '@/components/WalkdiBanner';
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

const tagList = [
  { id: 1, label: 'running', path: 'running' },
  { id: 2, label: 'dog', path: 'dog' },
  { id: 3, label: 'tech', path: 'tech' },
  { id: 4, label: 'health', path: 'health' },
  { id: 5, label: 'travel', path: 'travel' }
];
const DashboardLayout: FC<layoutProps> = ({ children }) => {
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

  const {
    data: recommendArticles,
    error: recommendArticlesError,
    isLoading
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articleAPI.getArticles()
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
            <WalkdiBanner />

            {category && (
              <div className="mt-5">
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
              <article className="mb-5">
                <div
                  className="w-full inline-flex mt-5 rounded-md shadow-sm"
                  role="group"
                >
                  {isCategoryLoading && (
                    <>
                      <div className="animate-pulse h-[38px] w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                      <div className="animate-pulse h-[38px] w-full inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"></div>
                    </>
                  )}
                </div>
                <div className="bg-gray-100 w-full dark:bg-gray-800 rounded-sm">
                  <div className="flex justify-around">
                    {categories?.map((item, idx) => {
                      const currentPath = category === item.label;
                      return (
                        <Link
                          key={item.id}
                          href={`/category/${item.label}`}
                          type="button"
                          className={`${
                            currentPath ? 'underline' : ''
                          } flex justify-center text-center text-lg hover:underline py-1 font-bold capitalize`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </article>
            )}
            {children}
          </div>
          <div className="md:block hidden min-w-fit">
            <div className="bg-white border border-gray-200 rounded-lg shadow sm:px-4 sm:py-8 dark:bg-gray-800 dark:border-gray-700">
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Reommend Articles
              </h5>

              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

              <ul>
                {recommendArticles?.map((item) => {
                  return (
                    <div key={item.id} className="underline cursor-pointer">
                      <Link href={`/article/${item.id}`} key={item.id}>
                        {item.title}
                      </Link>
                    </div>
                  );
                })}
              </ul>
            </div>

            <div className="my-6" />
            <div className="bg-white border border-gray-200 rounded-lg shadow sm:px-4 sm:py-8 dark:bg-gray-800 dark:border-gray-700">
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                Tags
              </h5>

              <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

              <ul className="flex flex-wrap max-w-[200px]">
                {tagList.map((item) => {
                  return (
                    <li key={item.id}>
                      <Link
                        href={`/tags/${item.path}`}
                        className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
