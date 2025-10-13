import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

let cachedDb: NeonHttpDatabase | null = null;

export function getDb(): NeonHttpDatabase {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  const client = neon(url);
  cachedDb = drizzle(client);
  return cachedDb;
}
