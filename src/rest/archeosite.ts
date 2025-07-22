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
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllArcheosites = async (ctx: KoaContext<GetAllArcheoSitesResponse>) =>{
  const archeosites = await archeositeService.getAll();
  ctx.body = {
    items: archeosites,
  };      
};
getAllArcheosites.validationScheme = null;

const getArcheositeById = async (ctx: KoaContext<GetArcheoSiteByIdResponse, IdParams>)=>{
  const archeosite = await archeositeService.getById(ctx.params.id);
  ctx.body = archeosite;
};
getArcheositeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createArcheosite = async (
  ctx: KoaContext<CreateArcheoSiteResponse, void, CreateArcheoSiteRequest>,
) =>{
  const newArcheosite = await archeositeService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newArcheosite;
};
createArcheosite.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    land: Joi.string().max(255),
    beschrijving: Joi.optional().allow(null),
    breedtegraad: Joi.number()
      .precision(8)
      .min(-90)
      .max(90),
    lengtegraad: Joi.number()
      .precision(8)
      .min(-180)
      .max(180),
    hoogte: Joi.number()
      .optional()
      .allow(null)
      .precision(2)
      .min(-999.99)
      .max(9999.99),
    foto: Joi.string().optional().allow(null).max(255),
  },
};

const updateArcheosite = async (
  ctx: KoaContext<UpdateArcheoSiteResponse, IdParams, UpdateArcheoSiteRequest>,
)=>{
  const archeologischeSite = await archeositeService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = archeologischeSite;
};
updateArcheosite.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    naam: Joi.string().optional().max(255),
    land: Joi.string().optional().max(255),
    beschrijving: Joi.optional().allow(null),
    breedtegraad: Joi.number()
      .optional()
      .precision(8)
      .min(-90)
      .max(90),
    lengtegraad: Joi.number()
      .optional()
      .precision(8)
      .min(-180)
      .max(180),
    hoogte: Joi.number()
      .optional()
      .allow(null)
      .precision(2)
      .min(-999.99)
      .max(9999.99),
    foto: Joi.string().optional().allow(null).max(255),
  },
};

const deleteArcheosite = async (ctx: KoaContext<void, IdParams>)=>{
  await archeositeService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteArcheosite.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter)=>{
  const router = new Router<AagisAppState, AagisAppContext>({
    prefix: '/archeosites',
  });
  router.use(requireAuthentication);
  
  router.get('/', validate(getAllArcheosites.validationScheme),
    getAllArcheosites );
  router.get('/:id', validate(getArcheositeById.validationScheme), 
    getArcheositeById );
  router.post('/', validate(createArcheosite.validationScheme),
    createArcheosite );
  router.put('/:id', validate(updateArcheosite.validationScheme),
    updateArcheosite);
  router.delete('/:id', validate(deleteArcheosite.validationScheme),
    deleteArcheosite);

  // de archeosites router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
