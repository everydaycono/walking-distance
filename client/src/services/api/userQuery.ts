import { isAxiosError } from 'axios';
import api from './base';

type loginType = {
  email: string;
  password: string;
};

type loginUserType = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  id: string;
  token: {
    access: string;
    refresh: string;
  };
};

export const loginUser = async (credentials: loginType) => {
  try {
    // API 호출 로직을 여기에 작성
    // throw new
    // throw new Error('?!?!?!?');
    const { data } = await api.post(
      '/api/auth/login',
      JSON.stringify(credentials)
    );

    return data as loginUserType;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
