import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  credentials: true,
  origin: process.env.APP_URL
};
