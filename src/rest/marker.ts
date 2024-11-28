// src/rest/marker.ts
import Router from '@koa/router';
import type { Context } from 'koa';
import * as archeositeService from '../service/archeosite';

const getMarkersBySiteId = async (ctx: Context)=>{
  const archeosites = archeositeService.getMarkersBySiteId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: archeosites,
  };
};

export default (parent: Router) => {
  const router = new Router({ 
    prefix: '/markers', 
  });

  // GET /api/markers/:siteId/archeosites
  router.get('/:id/archeosites', getMarkersBySiteId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
