// src/types/wende.ts
import type { Entity, ListResponse } from './common';
import type { Decimal } from '@prisma/client/runtime/library';
import type { AstronomischEvent, WendeType } from '@prisma/client';

export interface Wende extends Entity{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
}

export interface WendeCreateInput{
  siteId: number;
  wendeType: WendeType;
  astronomischEvent: AstronomischEvent;
  datumTijd: Date;
  azimuthoek: Decimal;
}

export interface WendeUpdateInput extends WendeCreateInput{}

export interface CreateWendeRequest extends WendeCreateInput{}
export interface UpdateWendeRequest extends WendeCreateInput{}

export interface GetAllWendesResponse extends ListResponse<Wende>{}
export interface GetWendeByIdResponse extends Wende {}
export interface CreateWendeResponse extends GetWendeByIdResponse{}
export interface UpdateWendeResponse extends GetWendeByIdResponse{}
