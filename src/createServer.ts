// src/createServer.ts
import Koa from 'koa';
import { getLogger } from './core/logging';
import installRest from './rest';
import { initializeData, shutdownData } from './data';
import type { 
  KoaApplication,
  AagisAppContext, 
  AagisAppState } from './types/koa';
import installMiddlewares from './core/installMiddlewares';

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

//Factory design pattern
export default async function createServer(): Promise<Server> {
  const app = new Koa<AagisAppState, AagisAppContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(9000, () => {
          getLogger().info('🚀 Server listening on http://localhost:9000');
          resolve();
        });
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye! 👋');
    },
  };
}

