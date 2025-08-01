// src/rest/health.ts
import Router from '@koa/router';
import * as healthService from '../service/health';
import type { AagisAppContext, AagisAppState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';

const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};

export default function installHealthRouter(parent: KoaRouter) {
  const router = new Router<AagisAppState, AagisAppContext>({ prefix: '/health' });

  router.get('/ping', ping);
  router.get('/version', getVersion);

  parent.use(router.routes())
    .use(router.allowedMethods());
};
