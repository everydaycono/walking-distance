import { IUser } from '@/types/next-auth';
import { signOut } from 'next-auth/react';
import { FC } from 'react';

interface AvatarProps {
  user?: IUser;
  loading?: boolean;
}

const Avatar: FC<AvatarProps> = ({ user, loading = false }) => {
  return (
    <div className="flex items-center">
      {user && (
        <div>
          <h6 className="mr-4">Welcome, {user.firstName} 😀</h6>
          <button onClick={() => signOut()}>logout</button>
        </div>
      )}
      <div
        className={`${
          loading ? 'animation-pulse' : ''
        } relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}
      >
        {!user || !user?.avatar ? (
          <svg
            className="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <img
            className="w-10 h-10 rounded-full"
            src={user.avatar}
            alt="Rounded avatar"
          />
        )}
      </div>
    </div>
  );
};

export default Avatar;
