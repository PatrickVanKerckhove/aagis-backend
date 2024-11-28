// src/rest/index.ts
import Router from '@koa/router';
import type Application from 'koa';
import installArcheositeRouter from './archeosite';
import installHealthRouter from './health';
import installMarkerRouter from './marker';

export default (app: Application)=>{
  const router = new Router({
    prefix: '/api',
  });

  installArcheositeRouter(router);
  installHealthRouter(router);
  installMarkerRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
