import { CreateArticleType } from '@/app/(article)/create/article/article.type';
import api from './base';

const baseURL = '/api/article';

export const articleAPI = {
  // create article
  createArticle: async (payload: CreateArticleType) => {
    const { data } = await api.post(`${baseURL}`, payload);
    return data;
  }
};
