import { CreateArticleType } from '@/app/(dashboard)/article/new-post/article.type';
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
  getArticleComment: async ({
    articleId
  }: Pick<createPostType, 'articleId'>) => {
    const { data } = await api(`/api/comment/article/${articleId}`);
    return data as commentType[];
  }
};
