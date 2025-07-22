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
import Joi from 'joi';
import validate from '../core/validation';
import { WendeType, AstronomischEvent } from '@prisma/client';
import { requireAuthentication } from '../core/auth';

const getAllWendes = async (ctx: KoaContext<GetAllWendesResponse>) =>{
  const wendes = await wendeService.getAll();
  ctx.body = {
    items: wendes,
  };      
};
getAllWendes.validationScheme = null;

const getWendeById = async (ctx: KoaContext<GetWendeByIdResponse, IdParams>)=>{
  const wende = await wendeService.getById(ctx.params.id);
  ctx.body = wende;
};
getWendeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createWende = async (
  ctx: KoaContext<CreateWendeResponse, void, CreateWendeRequest>,
) =>{
  const newWende = await wendeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newWende;
};
createWende.validationScheme = {
  body: {
    siteId: Joi.number().integer().positive(),
    wendeType: Joi.string().valid(WendeType),
    astronomischEvent: Joi.string().valid(AstronomischEvent),
    datumTijd: Joi.date().iso(),
    azimuthoek: Joi.number()
      .precision(2)
      .min(0)
      .max(360),
  },
};

const updateWende = async (
  ctx: KoaContext<UpdateWendeResponse, IdParams, UpdateWendeRequest>,
)=>{
  const wende = await wendeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = wende;
};
updateWende.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    siteId: Joi.number().optional().integer().positive(),
    wendeType: Joi.string().optional().valid(WendeType),
    astronomischEvent: Joi.string().optional().valid(AstronomischEvent),
    datumTijd: Joi.date().optional().iso(),
    azimuthoek: Joi.number()
      .optional()
      .precision(2)
      .min(0)
      .max(360),
  },
};

const deleteWende = async (ctx: KoaContext<void, IdParams>)=>{
  await wendeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteWende.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
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

  router.use(requireAuthentication);

  router.get('/', validate(getAllWendes.validationScheme),
    getAllWendes);
  router.get('/:id', validate(getWendeById.validationScheme),
    getWendeById);
  router.post('/', validate(createWende.validationScheme),
    createWende);
  router.put('/:id', validate(updateWende.validationScheme),
    updateWende);
  router.delete('/:id', validate(deleteWende.validationScheme),
    deleteWende);

  // GET /api/wendes/:siteId/archeosites
  router.get('/:id/archeosites', getWendesBySiteId);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
