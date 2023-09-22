import api from './base';

type TagArticle = {
  id: string;
  label: string;
  createAt: string;
  updateAt: string;
  articles: Article[];
};

export type Article = {
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
};

export const searchAPI = {
  getSearchArticleByTag: async (tag: string) => {
    const { data } = await api.get(`/api/search/article/tag?label=${tag}`);
    return data as TagArticle;
  },
  getSearchArticleBykeyword: async (keyword: string) => {
    const { data } = await api.get(`/api/search/article?keyword=${keyword}`);
    return data as Article[];
  }
};
