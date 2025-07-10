// src/rest/wende.ts
import Router from '@koa/router';
import * as archeositeService from '../service/archeosite';
import * as wendeService from '../service/wende';

import type { AagisAppState, AagisAppContext } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateWendeRequest,
  CreateWendeResponse,
  GetAllWendesResponse,
  GetWendeByIdResponse,
  UpdateWendeRequest,
  UpdateWendeResponse,
} from '../types/wende';
import type { IdParams } from '../types/common';

const getAllWendes = async (ctx: KoaContext<GetAllWendesResponse>) =>{
  const wendes = await wendeService.getAll();
  ctx.body = {
    items: wendes,
  };      
};

const getWendeById = async (ctx: KoaContext<GetWendeByIdResponse, IdParams>)=>{
  const wende = await wendeService.getById(Number(ctx.params.id));
  ctx.body = wende;
};

const createWende = async (
  ctx: KoaContext<CreateWendeResponse, void, CreateWendeRequest>,
) =>{
  const newWende = await wendeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newWende;
};

const updateWende = async (
  ctx: KoaContext<UpdateWendeResponse, IdParams, UpdateWendeRequest>,
)=>{
  const wende = await wendeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = wende;
};

const deleteWende = async (ctx: KoaContext<void, IdParams>)=>{
  await wendeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getWendesBySiteId = async (ctx: KoaContext<GetAllWendesResponse, IdParams>)=>{
  const archeosites = await archeositeService.getWendesBySiteId(
    Number(ctx.params.id),
  );
  ctx.body = {
    items: archeosites,
  };
};

export default (parent: KoaRouter) => {
  const router = new Router<AagisAppState, AagisAppContext>({ 
    prefix: '/wendes', 
  });

  router.get('/', getAllWendes);
  router.get('/:id', getWendeById);
  router.post('/', createWende);
  router.put('/:id', updateWende);
  router.delete('/:id', deleteWende);

  // GET /api/wendes/:siteId/archeosites
  router.get('/:id/archeosites', getWendesBySiteId);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
