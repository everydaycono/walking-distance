import api from './base';

const baseURL = '/api/tag';

export const tagAPI = {
  // get all tag
  getAllTag: async () => {
    const { data } = await api.get(`${baseURL}`);
    return data;
  }
};
