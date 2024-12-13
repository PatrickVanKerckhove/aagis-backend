// src/rest/archeosite.ts
import Router from '@koa/router';
import * as archeositeService from '../service/archeosite';
import type { Context} from 'koa';

const getAllArcheosites = async (ctx: Context) =>{
  const archeosites = await archeositeService.getAll();
  ctx.body = {
    items: archeosites,
  };      
};

const getArcheositeById = async (ctx: Context)=>{
  const archeosite = await archeositeService.getById(Number(ctx.params.id));
  ctx.body = archeosite;
};

const createArcheosite = async (ctx: Context) =>{
  const newArcheosite = await archeositeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newArcheosite;
};

const updateArcheosite = async (ctx: Context)=>{
  const archeologischeSite = await archeositeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = archeologischeSite;
};

const deleteArcheosite = async (ctx: Context)=>{
  await archeositeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router)=>{
  const router = new Router({
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
