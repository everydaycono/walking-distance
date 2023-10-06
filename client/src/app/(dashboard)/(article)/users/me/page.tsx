'use client';
import ArticleSkeleton from '@/components/skeleton/ArticleSkeleton';
import { articleAPI } from '@/services/api/articleQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import LoadingSkeleton from './_components/LoadingSkeleton';
import Image from 'next/image';
import { isValidURL } from '@/utils/userImgurl';
import Link from 'next/link';
import { FileEdit, Flag, Loader2, Trash2 } from 'lucide-react';

const MyPage = () => {
  const router = useRouter();
  const { data: userData, status } = useSession();

  const {
    data: myArticleData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-article'],
    queryFn: () => articleAPI.getMyArticles()
  });

  const {
    data,
    mutate,
    isLoading: deleteArticleLoading
  } = useMutation({
    mutationFn: (articleId: string) => articleAPI.deleteArticle(articleId),
    onSuccess: () => {
      refetch();
    },
    onError: () => {}
  });

  const handleArticleDelete = (articleId: string) => {
    mutate(articleId);
  };

  if (status === 'loading' || isLoading) {
    return <LoadingSkeleton />;
  }

  if (status === 'unauthenticated') {
    return router.push('/login');
  }

  return (
    <div className="w-full my-10">
      {/* user  */}
      <div>
        <h2 className="text-4xl font-extrabold dark:text-white">
          Hello, {userData?.user.firstName}
        </h2>
        <p className="my-4 text-lg text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, ipsam.
        </p>
        <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eos
          vitae quas, accusantium iusto sequi officia? Rerum minus deserunt
          mollitia.
        </p>
      </div>
      {/* articles */}

      {myArticleData &&
        myArticleData[0].articles?.map((item) => {
          const thumbNamilurl = isValidURL(item.thumbnail);
          return (
            <div key={item.id} className="flex items-center flex-row my-5">
              <div className="w-48 h-32 overflow-hidden">
                <Image
                  priority={false}
                  width={192}
                  height={128}
                  className="object-fill w-full h-96 md:h-auto md:w-48 hover:scale-110 transition duration-200"
                  src={thumbNamilurl}
                  alt={item.title}
                />
              </div>
              <div className="flex justify-between w-full pr-5">
                <div className="flex flex-col justify-between px-4 leading-normal">
                  <Link
                    href={{
                      pathname: `/article/${item.id}`
                    }}
                    className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer hover:underline"
                  >
                    {item.title}
                  </Link>
                  <Link
                    href={`/article/${item.title}`}
                    className="mb-3 font-normal text-gray-700 dark:text-gray-400 cursor-pointer"
                  >
                    {item.content.substring(0, 50)}...
                  </Link>

                  <p>{new Date(item.createAt).toDateString()}</p>
                </div>
                <div>
                  <ul className="flex gap-x-2 items-center">
                    <li>
                      <Link
                        className="flex items-center over:scale-110 cursor-pointer"
                        href={`/article/${item.id}/edit`}
                      >
                        <p className="mr-2">Edit</p>
                        <FileEdit size={20} />
                      </Link>
                    </li>
                    <li
                      className="hover:scale-110 cursor-pointer"
                      onClick={() => handleArticleDelete(item.id)}
                    >
                      {deleteArticleLoading ? (
                        <Loader2 />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </li>
                    <li className="hover:scale-110 cursor-pointer">
                      <h5>{item.status}</h5>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MyPage;
