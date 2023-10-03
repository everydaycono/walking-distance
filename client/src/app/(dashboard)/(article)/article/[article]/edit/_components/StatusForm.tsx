'use client';
import { FC, useEffect, useState } from 'react';
import { Ban, Loader2, MoveRight, ShieldCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SelectItem, SelectLabel } from '@radix-ui/react-select';
import { useMutation } from '@tanstack/react-query';
import { articleAPI } from '@/services/api/articleQuery';
import { useRouter } from 'next/navigation';
interface StatusFormProps {
  articleId: string;
  status: string;
}

const StatusForm: FC<StatusFormProps> = ({ articleId, status }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setStatus] = useState(status);

  const { data, isLoading, error, mutate, isIdle } = useMutation({
    mutationFn: () =>
      articleAPI.updateArticle(articleId, { status: newStatus }),
    onSuccess: (data) => {
      router.refresh();
    },
    onError: (error) => {
      console.log(error, 'error');
    }
  });

  const handleEditButton = () => {
    if (newStatus === status) return;
    mutate();
  };

  useEffect(() => {
    if (!isLoading) return;

    setIsEditing(false);
  }, [isLoading]);
  return (
    <div className="mb-5">
      <div className="w-full flex justify-between items-start px-6 py-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mr-10">
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            status
          </p>
          {isEditing ? (
            <>
              <select
                onChange={(e) => setStatus(e.target.value)}
                value={newStatus}
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="publish">publish 🔓</option>
                <option value="onlyme">onlyme 🔒</option>
                <option value="drfat">drfat 📝</option>
              </select>
            </>
          ) : (
            <h5>
              {status}
              {status === 'publish' && '🔓'}
              {status === 'onlyme' && '🔒'}
              {status === 'drfat' && '📝'}
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

export default StatusForm;
