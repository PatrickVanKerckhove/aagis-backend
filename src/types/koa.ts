// src/types/koa.ts
import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface AagisAppState {
  session: SessionInfo;
}

export interface AagisAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  AagisAppState,
  AagisAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<AagisAppState, AagisAppContext> {}

export interface KoaRouter extends Router<AagisAppState, AagisAppContext> {}
