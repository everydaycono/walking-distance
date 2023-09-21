import api from './base';

const baseURL = '/api/category';

type CategoriesType = {
  id: string;
  label: string;
  createAt: string;
  updateAt: string;
};

type CategoryType = {
  id: string;
  label: string;
  createAt: string;
  updateAt: string;
  articles: Article[];
};

type Article = {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  status: string;
  views: number;
  likes: number;
  isRecommended: boolean;
  createAt: string;
  updateAt: string;
};

export const categoryAPI = {
  // get all category
  getAllCategory: async () => {
    const { data } = await api.get(baseURL);
    return data as CategoriesType[];
  },
  getCategoryLabel: async (label: string) => {
    const { data } = await api.get(`${baseURL}/${label}`);
    return data as CategoryType;
  }
};
