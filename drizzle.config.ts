import { defineConfig } from 'drizzle-kit';
import { config as loadEnv } from 'dotenv';

// Load env from .env.local for CLI usage
loadEnv({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
