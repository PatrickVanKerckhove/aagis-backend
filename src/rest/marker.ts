// src/rest/marker.ts
import Router from '@koa/router';
import type { Context } from 'koa';
import * as archeositeService from '../service/archeosite';
import * as markerService from '../service/marker';

const getAllMarkers = async (ctx: Context) =>{
  const wendes = await markerService.getAll();
  ctx.body = {
    items: wendes,
  };      
};

const getMarkerById = async (ctx: Context)=>{
  const marker = await markerService.getById(Number(ctx.params.id));
  ctx.body = marker;
};

const createMarker = async (ctx: Context) =>{
  const newMarker = await markerService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newMarker;
};

const updateMarker = async (ctx: Context)=>{
  const marker = await markerService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = marker;
};

const deleteMarker = async (ctx: Context)=>{
  await markerService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getMarkersBySiteId = async (ctx: Context)=>{
  const archeosites = await archeositeService.getMarkersBySiteId(
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

  router.get('/', getAllMarkers);
  router.get('/:id', getMarkerById);
  router.post('/', createMarker);
  router.put('/:id', updateMarker);
  router.delete('/:id', deleteMarker);
  
  // GET /api/markers/:siteId/archeosites
  router.get('/:id/archeosites', getMarkersBySiteId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
