import axios from 'axios';

const appUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${appUrl.replace(/\/$/, '')}/api`,
  withCredentials: true,
});
