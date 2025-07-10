// src/rest/index.ts
import Router from '@koa/router';
import installHealthRouter from './health';
import installArcheositeRouter from './archeosite';
import installMarkerRouter from './marker';
import installWendeRouter from './wende';
import installUserRouter from './user';
import type {
  AagisAppContext,
  AagisAppState,
  KoaApplication,
} from '../types/koa';

export default (app: KoaApplication)=>{
  const router = new Router<AagisAppState, AagisAppContext>({
    prefix: '/api',
  });

  installHealthRouter(router);
  installArcheositeRouter(router);
  installMarkerRouter(router);
  installWendeRouter(router);
  installUserRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
