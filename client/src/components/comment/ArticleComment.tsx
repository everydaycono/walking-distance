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
import { articleAPI, createPostType } from '@/services/api/articleQuery';
import { Button } from '../ui/button';
import { Loader, Loader2, X } from 'lucide-react';

interface ArticleCommentProps {
  articleId: string;
}

const ArticleComment: FC<ArticleCommentProps> = ({ articleId }) => {
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState({
    itemId: 0,
    content: ''
  });

  const {
    data,
    isLoading: isCommentLoading,
    error: commentError
  } = useQuery({
    queryKey: ['comment', articleId],
    queryFn: () => articleAPI.getArticleComment({ articleId }),
    onSuccess: (data) => {
      console.log(data, 'Success');
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

  const handleReplyPostComment = () => {
    console.log('REPLY');
    console.log({
      articleId,
      content,
      ...(replyContent.itemId !== 0 && {
        parent: replyContent.itemId
      })
    });
    postComment({
      articleId,
      content,
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

  return (
    <div className="w-fullbg-white rounded-lg p-1">
      <h3 className="font-semibold p-1">Discussion</h3>
      <div className="flex flex-col gap-5">
        <form onSubmit={handlePostComment}>
          <div className="grid w-full gap-1 mt-4 mb-3">
            <Label htmlFor="message-2">Your Message</Label>
            <Textarea
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
        {data?.map((item) => {
          return (
            <div key={item.id}>
              <div className="flex w-full justify-between border rounded-md">
                <div className="p-3">
                  <div className="flex gap-3 items-center">
                    <img
                      src="https://avatars.githubusercontent.com/u/22263436?v=4"
                      className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"
                    />
                    <h3 className="font-bold">
                      {item.user.firstName} {item.user.lastName}
                      <br />
                      <span className="text-sm text-gray-400 font-normal">
                        {new Date(item.createAt).toDateString()}
                      </span>
                    </h3>
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
                <div key={item.id}>
                  <div className="flex justify-between ml-5">
                    <div className="w-full">
                      <div className="grid w-full gap-1 mt-4 mb-3">
                        <Label htmlFor="message-2">message reply</Label>
                        <Textarea
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Type your message here."
                          id="message-2"
                        />
                      </div>
                      <div className="w-full flex justify-between mb-3">
                        <p className="text-sm text-muted-foreground">
                          Your message will be copied to the support team.
                        </p>
                        <div className="flex items-center space-x-3">
                          <Button variant={'ghost'}>
                            <X />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleReplyPostComment}
                            className="py-0"
                            disabled={isLoading}
                          >
                            {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Children */}
              {item.children.map((item) => (
                <div key={item.id}>
                  <div className="text-gray-300 font-bold pl-14">|</div>
                  <div className="flex justify-between border ml-5  rounded-md">
                    <div className="p-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src="https://avatars.githubusercontent.com/u/22263436?v=4"
                          className="object-cover w-10 h-10 rounded-full border-2 border-emerald-400  shadow-emerald-400"
                        />
                        <h3 className="font-bold">
                          User 2
                          <br />
                          <span className="text-sm text-gray-400 font-normal">
                            Level 1
                          </span>
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-2">{item.content}</p>
                      <button className="text-right text-blue-500 cursor-pointer">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleComment;
