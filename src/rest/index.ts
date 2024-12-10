// src/rest/index.ts
import Router from '@koa/router';
import type Application from 'koa';
import installHealthRouter from './health';
import installArcheositeRouter from './archeosite';
import installMarkerRouter from './marker';
import installWendeRouter from './wende';

export default (app: Application)=>{
  const router = new Router({
    prefix: '/api',
  });

  installHealthRouter(router);
  installArcheositeRouter(router);
  installMarkerRouter(router);
  installWendeRouter(router);

  app.use(router.routes())
    .use(router.allowedMethods());
};
