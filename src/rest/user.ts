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

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) =>{
  const users = await userService.getAll();
  ctx.body = { items: users };      
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, IdParams>)=>{
  const user = await userService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = user;
};

const createUser = async (ctx: KoaContext<CreateUserResponse, void, CreateUserRequest>) =>{
  const user = await userService.create(ctx.request.body);
  ctx.status = 200;  
  ctx.body = user;
};

const updateUser = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>)=>{
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = user;
};

const deleteUser = async (ctx: KoaContext<void, IdParams>)=>{
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: KoaRouter)=>{
  const router = new Router<AagisAppState, AagisAppContext> ({
    prefix: '/users',
  });
  router.get('/', getAllUsers );
  router.get('/:id', getUserById );
  router.post('/', createUser );
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);

  // de users router hangen onder parent
  parent
    .use(router.routes()) // effectieve routing
    .use(router.allowedMethods()); // HTTP 405
};
