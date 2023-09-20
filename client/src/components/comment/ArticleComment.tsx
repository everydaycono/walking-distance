'use client';

import {
  EventHandler,
  FC,
  FormEvent,
  MouseEvent,
  MouseEventHandler,
  useState
} from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  articleAPI,
  commentType,
  createPostType
} from '@/services/api/articleQuery';
import { Button } from '../ui/button';
import { Loader, Loader2, X } from 'lucide-react';
import ReplyComment from './ReplyComment';
import NestedComment from './NestedComment';
import { useSession } from 'next-auth/react';

interface ArticleCommentProps {
  articleId: string;
}

const ArticleComment: FC<ArticleCommentProps> = ({ articleId }) => {
  const [content, setContent] = useState('');
  const { data: userData, status } = useSession();
  const [replyContent, setReplyContent] = useState({
    itemId: 0,
    content: ''
  });
  const [commentList, setCommentList] = useState<commentType[]>([]);

  const replyCancel = () => {
    setReplyContent({
      itemId: 0,
      content: ''
    });
  };
  const {
    data,
    isLoading: isCommentLoading,
    error: commentError,
    refetch
  } = useQuery({
    queryKey: ['comment', articleId],
    queryFn: () => articleAPI.getArticleComment({ articleId }),
    onSuccess: (data) => {
      setCommentList(data);
    },
    onError: (err) => {
      console.log(err, 'Error');
    }
  });

  const {
    mutate: postComment,
    error,
    data: commentData,
    isLoading
  } = useMutation({
    mutationFn: (data: createPostType) => {
      console.log(data.parent);
      return articleAPI.createArticleComment(data);
    },
    onSuccess: () => {
      refetch();
      setContent('');
    }
  });
  const handlePostComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    postComment({
      articleId,
      content
    });
  };

  const handleReplyPostComment = ({
    replyComment
  }: {
    replyComment: string;
  }) => {
    postComment({
      articleId,
      content: replyComment,
      ...(replyContent.itemId !== 0 && {
        parent: replyContent.itemId
      })
    });
  };

  const handlePostReply = (itemId: number) => {
    setReplyContent((prev) => {
      return {
        ...prev,
        itemId
      };
    });
  };

  const handleRefetch = () => {
    refetch();
  };

  return (
    <div className="w-fullbg-white rounded-lg p-1">
      <h3 className="font-semibold p-1">Discussion</h3>
      <div className="flex flex-col gap-5">
        <form onSubmit={handlePostComment}>
          <div className="grid w-full gap-1 mt-4 mb-3">
            <Label htmlFor="message-2">Your Message</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here."
              id="message-2"
            />
          </div>
          <div className="w-full flex justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>
            <Button className="py-0" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Comment
            </Button>
          </div>
        </form>
        {commentList?.map((item) => {
          return (
            <div key={item.id}>
              <div className="flex w-full justify-between border rounded-md">
                <div className="p-3 w-full">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <img
                        src={`${
                          item.user.avatar ??
                          'https://avatars.githubusercontent.com/u/22263436?v=4'
                        }`}
                        className="object-cover w-10 h-10 rounded-full border-2"
                      />
                      <h3 className="font-bold">
                        {item.user.firstName} {item.user.lastName}
                        <br />
                        <span className="text-sm text-gray-400 font-normal">
                          {new Date(item.createAt).toDateString()}
                        </span>
                      </h3>
                    </div>
                    <div></div>
                  </div>
                  <p className="text-gray-600 mt-2">{item.content}</p>
                  <button
                    onClick={() => handlePostReply(item.id)}
                    className="text-right text-blue-500"
                  >
                    Reply
                  </button>
                </div>
              </div>
              {replyContent.itemId === item.id && (
                <ReplyComment
                  replyId={replyContent.itemId}
                  articleId={articleId}
                  handleReplyCancel={replyCancel}
                  handleRefetch={handleRefetch}
                />
              )}

              {/* Children */}
              {item.children.map((item) => (
                <NestedComment key={item.id} children={item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleComment;
