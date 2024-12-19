// src/rest/wende.ts
import Router from '@koa/router';
import type { Context } from 'koa';
import * as archeositeService from '../service/archeosite';
import * as wendeService from '../service/wende';

const getAllWendes = async (ctx: Context) =>{
  const wendes = await wendeService.getAll();
  ctx.body = {
    items: wendes,
  };      
};

const getWendeById = async (ctx: Context)=>{
  const wende = await wendeService.getById(Number(ctx.params.id));
  ctx.body = wende;
};

const createWende = async (ctx: Context) =>{
  const newWende = await wendeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newWende;
};

const updateWende = async (ctx: Context)=>{
  const wende = await wendeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = wende;
};

const deleteWende = async (ctx: Context)=>{
  await wendeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

const getWendesBySiteId = async (ctx: Context)=>{
  const archeosites = await archeositeService.getWendesBySiteId(
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
