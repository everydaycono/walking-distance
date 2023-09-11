import { tokenEncryptor } from '@/utils/crypto-token';
import axios from 'axios';
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
    const decryptSession = tokenEncryptor.accessDecrypt(
      session?.user?.token?.access as string
    );
    config.headers['Authorization'] = `Bearer ${decryptSession}`;
    return config;
  }
  return config;
});

export default api;
