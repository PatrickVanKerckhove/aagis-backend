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
import Role from '../core/roles';
import type { Next } from 'koa';

/**
 * @swagger
 * tags:
 *   name: Wendes
 *   description: Represents a (winter or summer) solstice or a (minor/major) (southern/northern) lunar standstill.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Wende:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - siteId
 *             - wendeType
 *             - astronomischEvent
 *             - datumTijd
 *             - azimuthoek
 *             - calculatedBy
 *             - createdBy
 *             - isPublic
 *           properties:
 *             siteId:
 *               type: integer
 *             archeosite:
 *               $ref: "#/components/schemas/ArcheologischeSite"
 *             wendeType:
 *               type: string
 *               enum:
 *                 - ZOMERZONNEWENDE
 *                 - WINTERZONNEWENDE
 *                 - NOORDGROTEMAANWENDE
 *                 - NOORDKLEINEMAANWENDE
 *                 - ZUIDGROTEMAANWENDE
 *                 - ZUIDKLEINEMAANWENDE
 *               description: Type of the wende (e.g., summer solstice, lunar standstill)
 *             astronomischEvent:
 *               type: string
 *               enum:
 *                 - OPGANG 
 *                 - ONDERGANG
 *               description: Astronomical event (rise or set)
 *             datumTijd:
 *               type: string
 *               format: date-time
 *               description: Date and time of the wende in ISO 8601 format
 *             azimuthoek:
 *               type: number
 *               minimum: 0
 *               maximum: 360
 *               description: Azimuth angle in degrees (0-360, North = 0° = 360°), clockwise
 *             calculatedBy:
 *               type: string
 *               description: Tool which calculated the wende
 *             createdBy:
 *               type: integer
 *               description: ID of the user who created the wende
 *             isPublic:
 *               type: boolean
 *               description: Whether the wende is publicly accessible
 *           example:
 *             id: 1
 *             siteId: 1
 *             wendeType: ZOMERZONNEWENDE
 *             astronomischEvent: OPGANG
 *             datumTijd: "2023-06-21T04:52:00Z"
 *             azimuthoek: 51.3
 *             calculatedBy: "PhotoEphemerisApp"
 *             createdBy: 1
 *             isPublic: true
 *             archeosite:
 *               id: 1
 *               naam: "Stonehenge"
 *               land: "Engeland"
 *               beschrijving: "Prehistorisch monument in Wiltshire, Engeland."
 *               breedtegraad: 51.178883
 *               lengtegraad: -1.826204
 *               hoogte: 101
 *               foto: "/images/Stonehenge_800x600.jpg"
 *     WendeList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Wende"
 *     WendeCreateRequest:
 *       type: object
 *       required:
 *         - siteId
 *         - wendeType
 *         - astronomischEvent
 *         - datumTijd
 *         - azimuthoek
 *         - calculatedBy
 *       properties:
 *         siteId:
 *           type: integer
 *         wendeType:
 *           type: string
 *           enum:
 *             - ZOMERZONNEWENDE
 *             - WINTERZONNEWENDE
 *             - NOORDGROTEMAANWENDE
 *             - NOORDKLEINEMAANWENDE
 *             - ZUIDGROTEMAANWENDE
 *             - ZUIDKLEINEMAANWENDE
 *           description: Type of the wende
 *         astronomischEvent:
 *           type: string
 *           enum:
 *             - OPGANG
 *             - ONDERGANG
 *           description: Astronomical event (rise or set)
 *         datumTijd:
 *           type: string
 *           format: date-time
 *         azimuthoek:
 *           type: number
 *           minimum: 0
 *           maximum: 360
 *           description: Azimuth angle in degrees (0-360)
 *         calculatedBy:
 *           type: string 
 *       example:
 *         siteId: 1
 *         wendeType: ZOMERZONNEWENDE
 *         astronomischEvent: OPGANG
 *         datumTijd: "2025-06-21T04:52:00Z"
 *         azimuthoek: 51.3
 *         calculatedBy: "PhotoEphemerisApp"
 *     WendeUpdateRequest:
 *       type: object
 *       properties:
 *         siteId:
 *           type: integer
 *         wendeType:
 *           type: string
 *           enum:
 *             - ZOMERZONNEWENDE
 *             - WINTERZONNEWENDE
 *             - NOORDGROTEMAANWENDE
 *             - NOORDKLEINEMAANWENDE
 *             - ZUIDGROTEMAANWENDE
 *             - ZUIDKLEINEMAANWENDE
 *         astronomischEvent:
 *           type: string
 *           enum: 
 *             - OPGANG
 *             - ONDERGANG
 *         datumTijd:
 *           type: string
 *           format: date-time
 *         azimuthoek:
 *           type: number
 *           minimum: 0
 *           maximum: 360
 *         calculatedBy:
 *           type: string
 *         isPublic:
 *           type: boolean
 *           description: Whether the wende is publicly accessible (admin only)
 *       example:
 *         wendeType: WINTERZONNEWENDE
 *         azimuthoek: 230.5
 *         isPublic: true    
 */

/**
 * @swagger
 * /api/wendes:
 *   get:
 *     summary: Get all wendes
 *     tags:
 *       - Wendes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wendes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WendeList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const getAllWendes = async (ctx: KoaContext<GetAllWendesResponse>) =>{
  const { userId, roles } = ctx.state.session;
  const wendes = await wendeService.getAll(userId, roles.includes(Role.ADMIN));
  ctx.body = {
    items: wendes,
  };      
};
getAllWendes.validationScheme = null;

/**
 * @swagger
/api/wendes/{id}:
 *   get:
 *     summary: Get a single wende
 *     tags:
 *      - Wendes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested wende
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wende"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const checkWendeAccess = async (ctx: KoaContext<unknown, IdParams>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  if (roles.includes(Role.ADMIN)) {
    return next();
  }

  const wende = await wendeService.getById(Number(id), userId, false);
  if (!wende) {
    return ctx.throw(404, 'Er is geen wende met dit id.', { code: 'NOT_FOUND' });
  }

  if (wende.createdBy === userId || wende.isPublic) {
    return next();
  }

  return ctx.throw(403, 'Je hebt geen toegang tot deze wende.', { code: 'FORBIDDEN' });
};

const getWendeById = async (ctx: KoaContext<GetWendeByIdResponse, IdParams>)=>{
  const { userId, roles } = ctx.state.session;
  const wende = await wendeService.getById(ctx.params.id, userId, roles.includes(Role.ADMIN));
  ctx.body = wende;
};
getWendeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/wendes:
 *   post:
 *     summary: Create a new wende
 *     description: Creates a new wende.
 *     tags:
 *      - Wendes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: The wende info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WendeCreateRequest"
 *     responses:
 *       200:
 *         description: The created wende
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wende"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const createWende = async (
  ctx: KoaContext<CreateWendeResponse, void, CreateWendeRequest>,
) =>{
  const { userId } = ctx.state.session;
  const newWende = await wendeService.create(ctx.request.body, userId);
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
    calculatedBy: Joi.string().max(255),  
  },
};

/**
 * @swagger
 * /api/wendes/{id}:
 *   put:
 *     summary: Update an existing wende
 *     tags:
 *      - Wendes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       description: The wende info to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WendeUpdateRequest"
 *     responses:
 *       200:
 *         description: The updated wende
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Wende"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const updateWende = async (
  ctx: KoaContext<UpdateWendeResponse, IdParams, UpdateWendeRequest>,
)=>{
  const { userId, roles } = ctx.state.session;
  const wende = await wendeService.updateById(
    Number(ctx.params.id), 
    ctx.request.body,
    userId,
    roles.includes(Role.ADMIN),
  );
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
    calculatedBy: Joi.string().max(255).optional(),
    isPublic: Joi.boolean().optional(),  
  },
};

/**
 * @swagger
 * /api/wende/{id}:
 *   delete:
 *     summary: Delete a wende
 *     tags:
 *      - Wendes
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
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const deleteWende = async (ctx: KoaContext<void, IdParams>)=>{
  const { userId, roles } = ctx.state.session;
  await wendeService.deleteById(Number(ctx.params.id), userId, roles.includes(Role.ADMIN));
  ctx.status = 204;
};
deleteWende.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const getWendesBySiteId = async (ctx: KoaContext<GetAllWendesResponse, IdParams>)=>{
  const { userId, roles } = ctx.state.session;
  const archeosites = await archeositeService.getWendesBySiteId(
    Number(ctx.params.id), userId, roles.includes(Role.ADMIN),

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
    checkWendeAccess, getWendeById);
  router.post('/', validate(createWende.validationScheme),
    createWende);
  router.put('/:id', validate(updateWende.validationScheme),
    checkWendeAccess,updateWende);
  router.delete('/:id', validate(deleteWende.validationScheme),
    checkWendeAccess, deleteWende);

  // GET /api/wendes/:siteId/archeosites
  router.get('/:id/archeosites', getWendesBySiteId);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
