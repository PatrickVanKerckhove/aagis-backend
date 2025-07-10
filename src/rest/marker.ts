// src/rest/marker.ts
import Router from '@koa/router';
import * as archeositeService from '../service/archeosite';
import * as markerService from '../service/marker';

import type { AagisAppState, AagisAppContext } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateMarkerRequest,
  CreateMarkerResponse,
  GetAllMarkersResponse,
  GetMarkerByIdResponse,
  UpdateMarkerRequest,
  UpdateMarkerResponse,
} from '../types/marker';
import type { IdParams } from '../types/common';

const getAllMarkers = async (ctx: KoaContext<GetAllMarkersResponse>) =>{
  const wendes = await markerService.getAll();
  ctx.body = {
    items: wendes,
  };      
};

const getMarkerById = async (ctx: KoaContext<GetMarkerByIdResponse, IdParams>)=>{
  const marker = await markerService.getById(Number(ctx.params.id));
  ctx.body = marker;
};

const createMarker = async (
  ctx: KoaContext<CreateMarkerResponse, void, CreateMarkerRequest>,
) =>{
  const newMarker = await markerService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newMarker;
};

const updateMarker = async (
  ctx: KoaContext<UpdateMarkerResponse, IdParams, UpdateMarkerRequest>,
)=>{
  const marker = await markerService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = marker;
};

const deleteMarker = async (ctx: KoaContext<void, IdParams>)=>{
  await markerService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getMarkersBySiteId = async (ctx: KoaContext<GetAllMarkersResponse, IdParams>)=>{
  const archeosites = await archeositeService.getMarkersBySiteId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: archeosites,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<AagisAppState, AagisAppContext>({ 
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
