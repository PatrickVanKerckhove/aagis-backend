// src/rest/user.ts
import Router from '@koa/router';
import * as userService from '../service/user';
import type { Context} from 'koa';
import type { AagisAppContext, AagisAppState} from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterUserRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
  GetUserRequest,
} from '../types/user';
import type { IdParams } from '../types/common';

const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) =>{
  const users = await userService.getAll();
  ctx.body = {
    items: users,
  };      
};

const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>)=>{
  const user = await userService.getById(Number(ctx.params.id));
  ctx.body = user;
};

const createUser = async (ctx: Context) =>{
  const newUser = await userService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newUser;
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
