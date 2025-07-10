// src/index.ts
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { getLogger } from './core/logging';
import installRest from './rest';
import config from 'config';
import koaCors from '@koa/cors';
import { initializeData } from './data';
import type { AagisAppContext, AagisAppState } from './types/koa';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

async function main(): Promise<void> {
  const app = new Koa<AagisAppState, AagisAppContext>();

  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin!) !== -1) {
          return ctx.request.header.origin!;
        }
        // Not a valid domain at this point, let's return the first valid as we should return a string
        return CORS_ORIGINS[0] || '';
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    }),
  );
  
  app.use(bodyParser());

  await initializeData();
  installRest(app);
  
  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}

main();
