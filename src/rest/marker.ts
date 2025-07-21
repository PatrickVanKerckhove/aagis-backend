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
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

const getAllMarkers = async (ctx: KoaContext<GetAllMarkersResponse>) =>{
  const wendes = await markerService.getAll();
  ctx.body = {
    items: wendes,
  };      
};
getAllMarkers.validationScheme = null;

const getMarkerById = async (ctx: KoaContext<GetMarkerByIdResponse, IdParams>)=>{
  const marker = await markerService.getById(ctx.params.id);
  ctx.body = marker;
};
getMarkerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createMarker = async (
  ctx: KoaContext<CreateMarkerResponse, void, CreateMarkerRequest>,
) =>{
  const newMarker = await markerService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newMarker;
};
createMarker.validationScheme = {
  body: {
    siteId: Joi.number().integer().positive(),
    wendeId: Joi.number().integer().positive(),
    naam: Joi.string().max(255),
    beschrijving: Joi.optional().allow(null),
    breedtegraad: Joi.number()
      .precision(8)
      .min(-90)
      .max(90),
    lengtegraad: Joi.number()
      .precision(8)
      .min(-180)
      .max(180),
  },  
};

const updateMarker = async (
  ctx: KoaContext<UpdateMarkerResponse, IdParams, UpdateMarkerRequest>,
)=>{
  const marker = await markerService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = marker;
};
updateMarker.validationScheme = {
  body: {
    siteId: Joi.number().optional().integer().positive(),
    wendeId: Joi.number().optional().integer().positive(),
    naam: Joi.string().optional().max(255),
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
  }, 
};

const deleteMarker = async (ctx: KoaContext<void, IdParams>)=>{
  await markerService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteMarker.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
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

  router.use(requireAuthentication);
  
  router.get('/', validate(getAllMarkers.validationScheme),
    getAllMarkers);
  router.get('/:id', validate(getMarkerById.validationScheme),
    getMarkerById);
  router.post('/', validate(createMarker.validationScheme),
    createMarker);
  router.put('/:id', validate(updateMarker.validationScheme),
    updateMarker);
  router.delete('/:id', validate(deleteMarker.validationScheme),
    deleteMarker);
  
  // GET /api/markers/:siteId/archeosites
  router.get('/:id/archeosites', getMarkersBySiteId);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
