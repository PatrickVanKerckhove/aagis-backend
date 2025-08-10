// src/rest/user.ts
import Router from '@koa/router';
import * as userService from '../service/user';
import type { AagisAppContext, AagisAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  GetUserRequest,
  LoginResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../types/user';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole, authDelay } from '../core/auth';
import Role from '../core/roles';
import type { Next } from 'koa';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents a user in the system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - naam
 *             - email
 *           properties:
 *             naam:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *           example:
 *             id: 123
 *             naam: "Patrick Van Kerckhove"
 *             email: "patrick.vankerckhove@hogent.be"
 *     UsersList:
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/User"
 */

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 */
const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) =>{
  const users = await userService.getAll();
  ctx.body = { items: users };      
};
getAllUsers.validationScheme = null;

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Get a single user by their id or your own information if you use 'me' as the id
 *     tags:
 *      - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>)=>{
  const user = await userService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(), //optie 1 - gewoon id
      Joi.string().valid('me'),
    ),
  },
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags:
 *      - Users
 *     requestBody:
 *       description: The user's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: A JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
const registerUser = async (ctx: KoaContext<LoginResponse, void, CreateUserRequest>) =>{
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;  
  ctx.body = { token };
};
registerUser.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(128),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     requestBody:
 *       description: The user's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const updateUser = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>)=>{
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = user;
};
updateUser.validationScheme = {
  params: { id: Joi.number().integer().positive() },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *      - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403Forbidden'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const deleteUser = async (ctx: KoaContext<void, IdParams>)=>{
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteUser.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

export default (parent: KoaRouter)=>{
  const router = new Router<AagisAppState, AagisAppContext> ({
    prefix: '/users',
  });

  router.post('/', authDelay, validate(registerUser.validationScheme),
    registerUser );

  const requireAdmin = makeRequireRole(Role.ADMIN);  
   
  router.get('/', 
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers );
  router.get('/:id', 
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById );
  router.put('/:id', 
    requireAuthentication,
    validate(updateUser.validationScheme),
    checkUserId,
    updateUser);
  router.delete('/:id', 
    requireAuthentication,
    validate(deleteUser.validationScheme),
    checkUserId,
    deleteUser);

  // de users router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
