// src/rest/archeosite.ts
import Router from '@koa/router';
import * as archeositeService from '../service/archeosite';

import type { AagisAppState, AagisAppContext } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateArcheoSiteRequest,
  CreateArcheoSiteResponse,
  GetAllArcheoSitesResponse,
  GetArcheoSiteByIdResponse,
  UpdateArcheoSiteRequest,
  UpdateArcheoSiteResponse,
} from '../types/archeosite';
import type { IdParams } from '../types/common';

const getAllArcheosites = async (ctx: KoaContext<GetAllArcheoSitesResponse>) =>{
  const archeosites = await archeositeService.getAll();
  ctx.body = {
    items: archeosites,
  };      
};

const getArcheositeById = async (ctx: KoaContext<GetArcheoSiteByIdResponse, IdParams>)=>{
  const archeosite = await archeositeService.getById(Number(ctx.params.id));
  ctx.body = archeosite;
};

const createArcheosite = async (
  ctx: KoaContext<CreateArcheoSiteResponse, void, CreateArcheoSiteRequest>,
) =>{
  const newArcheosite = await archeositeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newArcheosite;
};

const updateArcheosite = async (
  ctx: KoaContext<UpdateArcheoSiteResponse, IdParams, UpdateArcheoSiteRequest>,
)=>{
  const archeologischeSite = await archeositeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = archeologischeSite;
};

const deleteArcheosite = async (ctx: KoaContext<void, IdParams>)=>{
  await archeositeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter)=>{
  const router = new Router<AagisAppState, AagisAppContext>({
    prefix: '/archeosites',
  });
  router.get('/', getAllArcheosites );
  router.get('/:id', getArcheositeById );
  router.post('/', createArcheosite );
  router.put('/:id', updateArcheosite);
  router.delete('/:id', deleteArcheosite);

  // de archeosites router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
