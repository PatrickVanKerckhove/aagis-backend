// src/rest/user.ts
import Router from '@koa/router';
import * as userService from '../service/user';
import type { Context} from 'koa';

const getAllUsers = async (ctx: Context) =>{
  const users = await userService.getAll();
  ctx.body = {
    items: users,
  };      
};

const getUserById = async (ctx: Context)=>{
  const user = await userService.getById(Number(ctx.params.id));
  ctx.body = user;
};

const createUser = async (ctx: Context) =>{
  const newUser = await userService.create(ctx.request.body!);
  ctx.status = 201;  
  ctx.body = newUser;
};

const updateUser = async (ctx: Context)=>{
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body!);
  ctx.body = user;
};

const deleteUser = async (ctx: Context)=>{
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

export default (parent: Router)=>{
  const router = new Router({
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
