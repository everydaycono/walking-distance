'use client';
import { Input } from '@/components/ui/input';
import { articleAPI } from '@/services/api/articleQuery';
import { useMutation } from '@tanstack/react-query';
import { Ban, Loader2, MoveRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface TitleFormProps {
  title: string;
  articleId: string;
}

const TitleForm: FC<TitleFormProps> = ({ articleId, title }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setTitle] = useState(title);

  const { data, isLoading, error, mutate, isIdle, status } = useMutation({
    mutationFn: () => articleAPI.updateArticle(articleId, { title: newTitle }),
    onSuccess: (data) => {
      router.refresh();
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });

  const handleEditButton = () => {
    if (newTitle === title) return;
    mutate();
  };

  useEffect(() => {
    if (!isLoading) return;

    setIsEditing(false);
  }, [isLoading]);

  return (
    <div>
      <div className="w-full flex justify-between items-start px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mr-10">
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            title
          </p>
          {isEditing ? (
            <Input
              onChange={(e) => setTitle(e.target.value)}
              value={newTitle}
              className="w-full"
              type="text"
              placeholder={title}
            />
          ) : (
            <h5 className="text-2xl h-10 font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h5>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleEditButton}
              disabled={isLoading}
              className="inline-flex justify-between items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Save
              {isLoading ? (
                <Loader2 />
              ) : (
                <ShieldCheck className="ml-2" size={20} />
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex justify-between items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Cancel
              <Ban className="ml-2" size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Edit
            <MoveRight className="ml-2" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleForm;
