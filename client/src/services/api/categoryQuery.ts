import api from './base';

const baseURL = '/api/category';

export const categoryAPI = {
  // get all category
  getAllCategory: async () => {
    const { data } = await api.get(`${baseURL}`);
    return data;
  }
};
