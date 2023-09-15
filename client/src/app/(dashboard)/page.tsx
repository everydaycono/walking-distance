import Fetch from '@/components/Fetch';
import Image from 'next/image';
import Link from 'next/link';

import { FC } from 'react';
import { IArticle } from './types/articles.type';

interface pageProps {}

async function getData() {
  const res = await fetch(`${process.env.SERVER_BASE_URL}/api/article`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('something went wrong');
  }
  return res.json();
}

const page: FC<pageProps> = async ({}) => {
  const data = (await getData()) as IArticle[];

  return (
    <div>
      <Fetch />
      <div>
        {data.map((item) => {
          const thumbNamilurl =
            item.thumbnail ||
            'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80';
          return (
            <div className="flex flex-col items-center md:flex-row md:max-w-2xl my-5">
              <div className="w-48 h-32 bg-red-500 overflow-hidden">
                <Image
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
                    {item.user.firstName} {item.user.lastName}
                  </h4>
                </div>
                <Link
                  href={{
                    pathname: `/@${item.user.firstName}-${item.user.lastName}/${item.id}`
                  }}
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
        })}
      </div>
    </div>
  );
};

export default page;
