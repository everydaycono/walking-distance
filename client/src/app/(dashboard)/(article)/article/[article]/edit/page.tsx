import { IArticle } from '@/app/(dashboard)/types/articles.type';
import { Separator } from '@/components/ui/separator';
import QuillWrapper from '@/components/wrapper/QuillWrapper';
import { articleAPI } from '@/services/api/articleQuery';
import { isValidURL } from '@/utils/userImgurl';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import QuillForm from './_components/QuillForm';
import TitleForm from './_components/TitleForm';
import StatusForm from './_components/StatusForm';

interface pageProps {
  params: {
    article: string;
  };
}

const getArticle = async (articleId: string) => {
  const res = await fetch(
    `${process.env.SERVER_BASE_URL}/api/article/${articleId}`,
    {
      cache: 'no-cache'
    }
  );

  if (!res.ok) {
    throw new Error('something went wrong');
  }
  return res.json();
};

const ArticleEdit: FC<pageProps> = async ({ params }) => {
  const articleData = (await getArticle(params.article)) as IArticle;
  return (
    <div className="max-w-4xl mx-auto px-5 my-20">
      <StatusForm articleId={params.article} status={articleData.status} />
      <TitleForm title={articleData.title} articleId={params.article} />
      <div>
        <div className="py-3 sm:py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
                src={isValidURL(articleData.user.avatar)}
                alt="Neil image"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white mr-5">
                  {articleData.user.firstName} {articleData.user.lastName}
                </p>
                <p className="text-sm text-gray-700 truncate dark:text-gray-400">
                  {articleData.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {new Date(articleData.createAt).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="mx-5">
        <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
          {articleData.category.label}
        </span>
      </div>
      <Separator className="my-4" />
      {articleData.thumbnail && (
        <div className="flex justify-center my-5">
          <Image
            priority={false}
            src={isValidURL(articleData.thumbnail)}
            width={500}
            height={500}
            alt={articleData.thumbnail}
          />
        </div>
      )}
      {/* QUill */}
      <QuillForm articleId={params.article} value={articleData.content} />
      <Separator className="my-4" />
    </div>
  );
};

export default ArticleEdit;
