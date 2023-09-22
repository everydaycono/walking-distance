import { CreateArticleType } from '@/app/(article)/article/new-post/article.type';
import api, { AuthApi } from './base';

const baseURL = '/api/article';

export type createPostType = {
  articleId: string;
  content: string;
  parent?: number;
};

export type commentType = {
  id: number;
  content: string;
  createAt: string;
  updateAt: string;
  pass: boolean;
  user: User;
  children: commentType[];
};

export interface User {
  firstName: string;
  lastName: string;
  avatar: any;
  email: string;
}

export type UpdateCommentType = {
  commentId: number;
  content: string;
};
export type ArticleType = {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  status: string;
  views: number;
  likes: number;
  isRecommended: boolean;
  createAt: string;
  updateAt: string;
  category: {
    id: string;
    label: string;
    createAt: string;
    updateAt: string;
  };
  tags: {
    id: string;
    label: string;
    createAt: string;
    updateAt: string;
  }[];
  user: User;
};
export type DeleteCommentType = Omit<UpdateCommentType, 'content'>;

export const articleAPI = {
  // create article
  createArticle: async (payload: CreateArticleType) => {
    const { data } = await AuthApi.post(`${baseURL}`, payload);
    return data;
  },
  createArticleComment: async ({
    articleId,
    content,
    parent
  }: createPostType) => {
    console.log({ articleId, content, parent });
    const { data } = await AuthApi.post(`/api/comment/${articleId}`, {
      content,
      parent
    });
    return data;
  },
  getArticles: async () => {
    const { data } = await api('/api/article');
    return data as ArticleType[];
  },
  getArticleComment: async ({
    articleId
  }: Pick<createPostType, 'articleId'>) => {
    const { data } = await api(`/api/comment/article/${articleId}`);
    return data as commentType[];
  },
  updateComment: async ({ commentId, content }: UpdateCommentType) => {
    const { data } = await AuthApi.patch(`/api/comment/${commentId}`, {
      content
    });
    return data;
  },
  deleteComment: async ({ commentId }: DeleteCommentType) => {
    const { data } = await AuthApi.delete(`/api/comment/${commentId}`);
    return data;
  }
};
