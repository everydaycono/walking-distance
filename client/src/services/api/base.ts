import axios from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});
export const AuthApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

AuthApi.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) {
    config.headers['Authorization'] = `Bearer ${session.user.token.access}`;
  }
  return config;
});

export default api;
