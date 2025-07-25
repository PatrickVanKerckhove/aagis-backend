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
 *             - archeosite
 *             - wendeType
 *             - astronomischEvent
 *             - datumTijd
 *             - azimuthoek
 *           properties:
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
 *             wendeType: ZOMERZONNEWENDE
 *             astronomischEvent: OPGANG
 *             datumTijd: "2023-06-21T04:52:00Z"
 *             azimuthoek: 51.3
 *     WendeList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Wende"
 *
 *   requestBodies:
 *     Wende:
 *       description: The wende info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               archeosite:
 *                 $ref: "#/components/schemas/ArcheologischeSite"
 *               wendeType:
 *                 type: string
 *                 enum:
 *                   - ZOMERZONNEWENDE
 *                   - WINTERZONNEWENDE
 *                   - NOORDGROTEMAANWENDE
 *                   - NOORDKLEINEMAANWENDE
 *                   - ZUIDGROTEMAANWENDE
 *                   - ZUIDKLEINEMAANWENDE
 *                 description: Type of the wende
 *               astronomischEvent:
 *                 type: string
 *                 enum:
 *                   - OPGANG
 *                   - ONDERGANG
 *                 description: Astronomical event (rise or set)
 *               datumTijd:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the wende in ISO 8601 format
 *               azimuthoek:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 360
 *                 description: Azimuth angle in degrees (0-360)
 *             required:
 *               - archeosite
 *               - wendeType
 *               - astronomischEvent
 *               - datumTijd
 *               - azimuthoek
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
  const wendes = await wendeService.getAll();
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
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getWendeById = async (ctx: KoaContext<GetWendeByIdResponse, IdParams>)=>{
  const wende = await wendeService.getById(ctx.params.id);
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
 *       $ref: "#/components/requestBodies/Wende"
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
 *       $ref: "#/components/requestBodies/Wende"
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
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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
