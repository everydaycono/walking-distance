import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
