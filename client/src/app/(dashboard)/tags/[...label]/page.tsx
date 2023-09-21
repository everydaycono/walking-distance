'use client';
import ArticleSkeleton from '@/components/skeleton/ArticleSkeleton';
import { searchAPI } from '@/services/api/searchQuery';
import { isValidURL } from '@/utils/userImgurl';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export interface pageProps {
  params: Params;
}

export interface Params {
  label: string[];
}

const page: FC<pageProps> = ({ params }) => {
  const {
    data: tagList,
    isLoading: isTagLoading,
    error
  } = useQuery({
    queryKey: ['tags', params.label[0]],
    queryFn: () => searchAPI.getSearchArticleByTag(params.label[0]),
    onSuccess: () => {},
    onError: (err) => {
      console.log(err, 'ERR');
    },
    staleTime: 1000 * 60 * 5 // 5minutes
  });
  return (
    <div>
      {isTagLoading ? (
        <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      ) : (
        <p>{tagList?.articles.length} has been searched</p>
      )}

      <div>
        {isTagLoading ? (
          <>
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
          </>
        ) : (
          tagList?.articles.map((item) => {
            const thumbNamilurl = isValidURL(item.thumbnail ?? '');
            return (
              <div
                key={item.id}
                className="flex items-center flex-row md:max-w-2xl my-5"
              >
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
                <div className="flex flex-col justify-between px-4 leading-normal">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-pink-300 mr-3 rounded-full"></div>
                    <h4>
                      USER
                      {/* {item.user.firstName} {item.user.lastName} */}
                    </h4>
                  </div>
                  <Link
                    //   href={{
                    //     pathname: `/@${item.user.firstName}-${item.user.lastName}/${item.id}`
                    //   }}
                    href="/@user"
                    className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white cursor-pointer hover:underline"
                  >
                    {item.title}
                  </Link>
                  <Link
                    href={`/@user/${item.title}`}
                    className="mb-3 font-normal text-gray-700 dark:text-gray-400 cursor-pointer"
                  >
                    {item.content.substring(0, 50)}...
                  </Link>

                  <p>{new Date(item.createAt).toDateString()}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default page;
