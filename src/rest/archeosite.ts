// src/rest/archeosite.ts
import Router from '@koa/router';
import * as archeositeService from '../service/archeosite';
import type { Context} from 'koa';

const getAllArcheosites = async (ctx: Context) =>{
  ctx.body = {
    items: archeositeService.getAll(),
  };      
};

const createArcheosite = async (ctx: Context) =>{
  const newArcheosite = archeositeService.create({
    ...ctx.request.body,
    siteId: Number(ctx.request.body.siteId),
    naam: String(ctx.request.body.naam),
    land: String(ctx.request.body.land),
    beschrijving: String(ctx.request.body.beschrijving),
    breedtegraad: Number(ctx.request.body.breedtegraad),
    lengtegraad: Number(ctx.request.body.lengtegraad),
    hoogte: Number(ctx.request.body.hoogte),
    foto: String(ctx.request.body.foto),
    geselecteerd: Boolean(ctx.request.body.geselecteerd),
  });
  ctx.body = newArcheosite;
};

const getArcheositeById = async (ctx: Context)=>{
  ctx.body = archeositeService.getById(Number(ctx.params.id));
};

export default (parent: Router)=>{
  const router = new Router({
    prefix: '/archeosites',
  });
  router.get('/', getAllArcheosites );
  router.post('/', createArcheosite );
  router.get('/:id', getArcheositeById );

  // de archeosites router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
