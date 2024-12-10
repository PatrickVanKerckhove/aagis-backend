// src/rest/marker.ts
import Router from '@koa/router';
import type { Context } from 'koa';
import * as archeositeService from '../service/archeosite';

const getWendesBySiteId = async (ctx: Context)=>{
  const archeosites = archeositeService.getWendesBySiteId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: archeosites,
  };
};

export default (parent: Router) => {
  const router = new Router({ 
    prefix: '/wendes', 
  });

  // GET /api/wendes/:siteId/archeosites
  router.get('/:id/archeosites', getWendesBySiteId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
