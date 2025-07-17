// src/rest/user.ts
import Router from '@koa/router';
import * as userService from '../service/user';
import type { AagisAppContext, AagisAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateUserRequest,
  CreateUserResponse,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '../types/user';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) =>{
  const users = await userService.getAll();
  ctx.body = { items: users };      
};
getAllUsers.validationScheme = null;

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, IdParams>)=>{
  const user = await userService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const createUser = async (ctx: KoaContext<CreateUserResponse, void, CreateUserRequest>) =>{
  const user = await userService.create(ctx.request.body);
  ctx.status = 200;  
  ctx.body = user;
};
createUser.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    email: Joi.string().email(), 
  },
};

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
  router.get('/', validate(getAllUsers.validationScheme),
    getAllUsers );
  router.get('/:id', validate(getUserById.validationScheme),
    getUserById );
  router.post('/', validate(createUser.validationScheme),
    createUser );
  router.put('/:id', validate(updateUser.validationScheme),
    updateUser);
  router.delete('/:id', validate(deleteUser.validationScheme),
    deleteUser);

  // de users router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
