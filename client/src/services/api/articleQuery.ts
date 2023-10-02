import { CreateArticleType } from '@/app/(article)/article/new-post/article.type';
import api, { AuthApi } from './base';
import { IArticle } from '@/app/(dashboard)/types/articles.type';
import { isAxiosError } from 'axios';

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
export type myArticleType = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  avatar: any;
  email: string;
  role: string;
  status: string;
  type: string;
  refreshToken: string;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  emailVerificationExpiry: string;
  createAt: string;
  updateAt: string;
  articles: Omit<ArticleType, 'category' | 'tags' | 'user'>[];
};

export type updateArticleType = {
  title?: string;
  content?: string;
  status?: string;
  category?: string;
};

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
  getArticle: async (articleId: string) => {
    const { data } = await api(`/api/article/${articleId}`);
    return data as IArticle;
  },
  getMyArticles: async () => {
    const { data } = await AuthApi('/api/user/my/articles');
    return data as myArticleType[];
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
  },
  updateArticle: async (articleId: string, payload: updateArticleType) => {
    try {
      const { category, title, content, status } = payload;
      if (!category && !title && !content && !status) {
        throw new Error('Invalid payload');
      }
      const { data } = await AuthApi.patch(
        `/api/article/${articleId}`,
        payload
      );
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }
      //@ts-ignore
      throw error?.message || 'something went wrong';
    }
  },
  deleteArticle: async (articleId: string) => {
    const { data } = await AuthApi.delete(`/api/article/${articleId}`);
    return data;
  }
};
