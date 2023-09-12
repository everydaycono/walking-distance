import { CreateArticleType } from '@/app/(article)/create/article/article.type';
import api, { AuthApi } from './base';

const baseURL = '/api/article';

export const articleAPI = {
  // create article
  createArticle: async (payload: CreateArticleType) => {
    const { data } = await AuthApi.post(`${baseURL}`, payload);
    return data;
  }
};
