import { FC, useState } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader2, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { articleAPI, createPostType } from '@/services/api/articleQuery';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

interface ReplyCommentProps {
  replyId: number;
  articleId: string;
  handleReplyCancel: () => void;
  handleRefetch: () => void;
}

const ReplyComment: FC<ReplyCommentProps> = ({
  replyId,
  articleId,
  handleReplyCancel,
  handleRefetch
}) => {
  const { data: userData, status } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  const [content, setContent] = useState('');

  const {
    mutate: handleReplyComment,
    error,
    data: commentData,
    isLoading
  } = useMutation({
    mutationFn: (data: createPostType) => {
      return articleAPI.createArticleComment(data);
    },
    onSuccess: () => {
      handleRefetch();
      setContent('');
      handleReplyCancel();
    }
  });

  const handleSignin = () => {
    window.sessionStorage.setItem('previousPath', pathName);
    router.push('/login');
    return;
  };

  const handleCommentReploy = () => {
    if (!articleId || content === '' || !replyId) return;

    handleReplyComment({
      articleId,
      content,
      parent: replyId
    });
  };

  return (
    <div key={replyId}>
      <div className="flex justify-between ml-5">
        <div className="w-full">
          <div className="grid w-full gap-1 mt-4 mb-3">
            <Label htmlFor="message-2">message reply</Label>
            <Textarea
              disabled={status !== 'authenticated'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                status !== 'authenticated'
                  ? 'Sign in to comment'
                  : 'Type your message here.'
              }
              id="message-2"
            />
          </div>
          <div className="w-full flex justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>

            <div className="flex items-center space-x-3">
              {status !== 'authenticated' ? (
                <Button className="py-0 h-8" onClick={handleSignin}>
                  Sign in
                </Button>
              ) : (
                <>
                  <Button variant={'ghost'} onClick={handleReplyCancel}>
                    <X />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCommentReploy}
                    className="py-0"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Post Comment
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyComment;
