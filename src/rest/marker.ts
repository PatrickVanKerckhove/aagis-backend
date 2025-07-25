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

/**
 * @swagger
 * tags:
 *   name: Markers
 *   description: Represents an orientation marker, a point seen at the horizon that marks where an astronomical event, like a solstice or lunar standstill, occurs.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Marker:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - archeosite
 *             - naam
 *             - breedtegraad
 *             - lengtegraad
 *           properties:
 *             archeosite:
 *               $ref: "#/components/schemas/ArcheologischeSite"
 *             wende:
 *               $ref: "#/components/schemas/Wende"
 *             naam:
 *               type: string
 *             beschrijving:
 *               type: string
 *               nullable: true
 *             breedtegraad:
 *               type: number
 *               minimum: -90
 *               maximum: 90
 *             lengtegraad:
 *               type: number
 *               minimum: -180
 *               maximum: 180
 *           example:
 *             id: 1
 *             archeosite:
 *               id: 1
 *               naam: "Stonehenge"
 *               land: "Engeland"
 *               beschrijving: "Prehistorisch monument in Wiltshire, Engeland."
 *               breedtegraad: 51.178883
 *               lengtegraad: -1.826204
 *               hoogte: 101.0
 *               foto: "/images/Stonehenge_800x600.jpg"
 *             wende: 
 *               id: 1
 *               siteId: 1
 *               wendeType: ZOMERZONNEWENDE
 *               astronomischEvent: OPGANG
 *               datumTijd: "2023-06-21T04:52:00Z"
 *               azimuthoek: 51.3
 *             naam: "Heel Stone"
 *             beschrijving: "Megaliet in lijn met de zonsopgang tijdens de zomerzonnewende."
 *             breedtegraad: 51.179085
 *             lengtegraad: -1.825797
 *     MarkerList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Marker"
 *
 *   requestBodies:
 *     Marker:
 *       description: The marker info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               archeosite:
 *                 $ref: "#/components/schemas/ArcheologischeSite"
 *               wende:
 *                 $ref: "#/components/schemas/Wende"
 *               naam:
 *                 type: string
 *               beschrijving:
 *                 type: string
 *                 nullable: true
 *               breedtegraad:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *               lengtegraad:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *             required:
 *               - archeosite
 *               - naam
 *               - breedtegraad
 *               - lengtegraad
 */

/**
 * @swagger
 * /api/markers:
 *   get:
 *     summary: Get all orientation markers
 *     tags:
 *       - Markers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orientation markers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MarkerList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const getAllMarkers = async (ctx: KoaContext<GetAllMarkersResponse>) =>{
  const wendes = await markerService.getAll();
  ctx.body = {
    items: wendes,
  };      
};
getAllMarkers.validationScheme = null;

/**
 * @swagger
/api/markers/{id}:
 *   get:
 *     summary: Get a single marker
 *     tags:
 *      - Markers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested marker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Marker"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getMarkerById = async (ctx: KoaContext<GetMarkerByIdResponse, IdParams>)=>{
  const marker = await markerService.getById(ctx.params.id);
  ctx.body = marker;
};
getMarkerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/markers:
 *   post:
 *     summary: Create a new marker
 *     description: Creates a new marker.
 *     tags:
 *      - Markers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Marker"
 *     responses:
 *       200:
 *         description: The created marker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Marker"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/markers/{id}:
 *   put:
 *     summary: Update an existing marker
 *     tags:
 *      - Markers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/Marker"
 *     responses:
 *       200:
 *         description: The updated marker
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Marker"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const updateMarker = async (
  ctx: KoaContext<UpdateMarkerResponse, IdParams, UpdateMarkerRequest>,
)=>{
  const marker = await markerService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = marker;
};
updateMarker.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
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

/**
 * @swagger
 * /api/markers/{id}:
 *   delete:
 *     summary: Delete a marker
 *     tags:
 *      - Markers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful.
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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
