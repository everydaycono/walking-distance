'use client';

import {
  DeleteCommentType,
  UpdateCommentType,
  commentType
} from '@/services/api/articleQuery';
import { UseMutateFunction } from '@tanstack/react-query';
import { Ban, FileEdit, Flag, Loader2, Trash2 } from 'lucide-react';
import { Session } from 'next-auth';
import { FC, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface NestedCommentProps {
  children: commentType;
  userData: Session | null;
  handleDeleteComment: UseMutateFunction<
    any,
    unknown,
    DeleteCommentType,
    unknown
  >;
  handleUpdateComment: UseMutateFunction<
    any,
    unknown,
    UpdateCommentType,
    unknown
  >;
  updateCommentLoading: boolean;
}

const NestedComment: FC<NestedCommentProps> = ({
  children,
  userData,
  handleDeleteComment,
  handleUpdateComment,
  updateCommentLoading
}) => {
  const [editComment, setEditComment] = useState<{
    id: null | number;
    content: string;
  }>({
    id: null,
    content: ''
  });
  const isMyComment =
    children.user.email === userData?.user.email &&
    children.user.firstName === userData?.user.firstName &&
    children.user.lastName === userData?.user.lastName;

  const handleCommentEdit = ({
    commentId,
    comment
  }: {
    commentId: number;
    comment: string;
  }) => {
    setEditComment({
      id: commentId,
      content: comment
    });
  };

  const handleCommentDelete = ({ commentId }: { commentId: number }) => {
    handleDeleteComment({ commentId });
  };

  const handleEditCancel = () => {
    setEditComment({
      id: null,
      content: ''
    });
  };

  const updateComment = () => {
    if (!editComment.id) return;

    handleUpdateComment({
      commentId: editComment.id,
      content: editComment.content
    });
    setEditComment({
      content: '',
      id: null
    });
  };
  return (
    <div>
      <div>
        <div className="text-gray-600 font-bold pl-6">|</div>
        <div className="flex justify-between border ml-5  rounded-md">
          <div className="p-3 w-full">
            <div className="flex justify-between items-center">
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
              <div>
                <ul className="flex gap-x-2">
                  {isMyComment && (
                    <>
                      <li
                        onClick={() =>
                          handleCommentEdit({
                            commentId: children.id,
                            comment: children.content
                          })
                        }
                        className="hover:scale-110 cursor-pointer"
                      >
                        <FileEdit size={20} />
                      </li>
                      <li className="hover:scale-110 cursor-pointer">
                        <Trash2
                          onClick={() =>
                            handleCommentDelete({ commentId: children.id })
                          }
                          size={20}
                        />
                      </li>
                    </>
                  )}
                  <li className="hover:scale-110 cursor-pointer">
                    <Flag size={20} />
                  </li>
                </ul>
              </div>
            </div>
            {children.id === editComment.id ? (
              <div className="flex items-center">
                <Input
                  disabled={updateCommentLoading}
                  className="my-3"
                  value={editComment.content}
                  onChange={(event) => {
                    setEditComment((prev) => {
                      return { ...prev, content: event.target.value };
                    });
                  }}
                />
                <Button onClick={handleEditCancel} className="mr-2 bg-gray-500">
                  <Ban className="mr-2" size={20} />
                  Cancel
                </Button>
                <Button disabled={updateCommentLoading} onClick={updateComment}>
                  {updateCommentLoading && (
                    <Loader2 className="mr-2 animate-spin" />
                  )}
                  Edit
                </Button>
              </div>
            ) : (
              <p className="dark:text-white text-gray-600 mt-2">
                {children.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NestedComment;
