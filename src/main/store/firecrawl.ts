import { FirecrawlApp } from 'firecrawl';
import dotenv from 'dotenv';

dotenv.config();

export const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});
