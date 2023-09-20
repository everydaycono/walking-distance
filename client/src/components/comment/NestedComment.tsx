'use client';

import { commentType } from '@/services/api/articleQuery';
import { FC } from 'react';

interface NestedCommentProps {
  children: commentType;
}

const NestedComment: FC<NestedCommentProps> = ({ children }) => {
  return (
    <div>
      <div>
        <div className="text-gray-600 font-bold pl-6">|</div>
        <div className="flex justify-between border ml-5  rounded-md">
          <div className="p-3">
            <div className="flex gap-3 items-center">
              <img
                src={
                  children.user.avatar ??
                  'https://avatars.githubusercontent.com/u/22263436?v=4'
                }
                className="object-cover w-10 h-10 rounded-full border-2"
              />
              <h3 className="font-bold">
                {children.user.firstName} {children.user.lastName}
                <br />
                <span className="text-sm text-gray-400 font-normal">
                  {new Date(children.createAt).toDateString()}
                </span>
              </h3>
            </div>
            <p className="dark:text-white text-gray-600 mt-2">
              {children.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NestedComment;
