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

/**
 * @swagger
 * tags:
 *   name: ArcheologischeSites
 *   description: Represents via the coordinates the center of an archeological site.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArcheologischeSite:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - naam
 *             - land
 *             - breedtegraad
 *             - lengtegraad
 *           properties:
 *             naam:
 *               type: string
 *             land:
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
 *             hoogte:
 *               type: number
 *               nullable: true
 *             foto:
 *               type: string
 *               nullable: true
 *           example:
 *             id: 1
 *             naam: "Stonehenge"
 *             land: "Engeland"
 *             beschrijving: "Prehistorisch monument in Wiltshire, Engeland, bekend om zijn astronomische uitlijningen."
 *             breedtegraad: 51.178883
 *             lengtegraad: -1.826204
 *             hoogte: 101.0
 *             foto: "/images/Stonehenge_800x600.jpg"
 *     ArcheoSiteList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ArcheologischeSite"
 *
 *   requestBodies:
 *     ArcheologischeSite:
 *       description: The archeological site info to save
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *               land:
 *                 type: string
 *               beschrijving:
 *                 type: string
 *               breedtegraad:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *               lengtegraad:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *               hoogte:
 *                 type: number
 *               foto:
 *                 type: string
 *             required:
 *               - naam
 *               - land
 *               - breedtegraad
 *               - lengtegraad
 */

/**
 * @swagger
 * /api/archeosites:
 *   get:
 *     summary: Get all archeological sites
 *     tags:
 *       - ArcheologischeSites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of archeological sites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ArcheoSiteList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */

const getAllArcheosites = async (ctx: KoaContext<GetAllArcheoSitesResponse>) =>{
  const archeosites = await archeositeService.getAll();
  ctx.body = {
    items: archeosites,
  };      
};
getAllArcheosites.validationScheme = null;

/**
 * @swagger
/api/archeosites/{id}:
 *   get:
 *     summary: Get a single archeological site
 *     tags:
 *      - ArcheologischeSites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested archeological site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ArcheologischeSite"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getArcheositeById = async (ctx: KoaContext<GetArcheoSiteByIdResponse, IdParams>)=>{
  const archeosite = await archeositeService.getById(ctx.params.id);
  ctx.body = archeosite;
};
getArcheositeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/archeosites:
 *   post:
 *     summary: Create a new archeological site
 *     description: Creates a new archeological site for the signed in user.
 *     tags:
 *      - ArcheologischeSites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/ArcheologischeSite"
 *     responses:
 *       200:
 *         description: The created archeological site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ArcheologischeSite"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/archeosites/{id}:
 *   put:
 *     summary: Update an existing archeological site
 *     tags:
 *      - ArcheologischeSites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/ArcheologischeSite"
 *     responses:
 *       200:
 *         description: The updated archeological site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ArcheologischeSite"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
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

/**
 * @swagger
 * /api/archeosites/{id}:
 *   delete:
 *     summary: Delete a archeological site
 *     tags:
 *      - ArcheologischeSites
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
